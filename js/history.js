document.addEventListener("DOMContentLoaded", () => {
    // Gatekeeper
    const status = localStorage.getItem("isLoggedIn");
    const currentUser = JSON.parse(localStorage.getItem("bp_currentUser") || "null");
    if (status !== "yes" || !currentUser) {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้าประวัติ");
        window.location.href = '/index.html';
        return;
    }
    // Per-user history key
    const historyKey = 'bookingHistory_' + currentUser.email;

    const container = document.getElementById('history-container');
    let historyList = [];

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = dateStr.split("-");
        if (d.length !== 3) return dateStr;
        return `${d[2]}/${d[1]}/${d[0]}`;
    }

    function removeHistory(id) {
        if (confirm("ยืนยันการยกเลิกการจอง?")) {
            if (window.useBooking) {
                window.useBooking.updateBookingStatus(id, 'cancelled');
                window.useBooking.updateBookingDetails(id, { cancelledAt: new Date().toISOString() });
                loadHistory(); // Reload from master list
            }
        }
    }

    function toggleCard(id) {
        const item = historyList.find(i => String(i.id) === String(id));
        if (item) {
            item.expanded = !item.expanded;
            renderHistory();
        }
    }

    function renderHistory() {
        container.innerHTML = '';

        if (historyList.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#999;"><p> --- ยังไม่มีประวัติการจอง --- </p></div>`;
            return;
        }

        historyList.forEach(item => {
            const card = document.createElement('div');
            card.className = `booking-card ${item.expanded ? 'active' : ''}`;

            // Define styling for cancelled items
            const isCancelled = item.status === 'cancelled';
            const statusTextColor = isCancelled ? 'red' : '#5A3E25';
            const statusText = isCancelled ? ' (ยกเลิกแล้ว)' : '';

            const header = document.createElement('div');
            header.className = 'card-header';
            header.innerHTML = `
                <div class="header-info">
                    <h3 style="color: ${statusTextColor}; margin-bottom: 10px; font-size: 30px; font-weight: bold;">ID: Q-${item.queueID || 'Unknown'}${statusText}</h3>
                    <p style="margin-bottom: 5px;"><strong>บริการ:</strong> ${item.service}</p>
                    <p style="margin-bottom: 5px;"><strong>ช่างตัดผม:</strong> ${item.barberName || 'ระบุไม่ได้'}</p>
                    <p style="margin-bottom: 5px;"><strong>วัน เวลา:</strong> ${formatDate(item.date)} เวลา ${item.time} น.</p>
                </div>
                <button class="toggle-btn" data-id="${item.id}">
                    <i class="fas fa-angle-down"></i>
                </button>
            `;
            card.appendChild(header);

            if (item.expanded) {
                const body = document.createElement('div');
                body.className = 'card-body mt-3';
                let actionArea = '';

                if (!isCancelled) {
                    actionArea = `
                        <div style="text-align: center; margin-top: 20px;">
                            <button class="cancel-btn" data-cancel-id="${item.id}">
                                ยกเลิกการจอง
                            </button>
                            <p style="color: red; font-size: 12px; margin-top: 10px;">***คำเตือน หากยกเลิกหลังการจอง 1 ชั่วโมง จะไม่สามารถขอเงินคืนได้***</p>
                            <p style="color: red; font-size: 12px; margin-top: 8px; margin-bottom: 5px;">ติดต่อขอคืนเงินได้ที่ Facebook</p>
                        </div>
                    `;
                } else {
                    let cancelTimeText = "";
                    let isRefundable = false;

                    if (item.createdAt && item.cancelledAt) {
                        const createdTime = new Date(item.createdAt).getTime();
                        const cancelTime = new Date(item.cancelledAt).getTime();
                        const diffMs = cancelTime - createdTime;
                        const diffMins = Math.floor(diffMs / 60000);

                        if (diffMins < 60) {
                            cancelTimeText = `กดยกเลิกหลังจากจอง: ${diffMins} นาที`;
                            isRefundable = true;
                        } else {
                            const hours = Math.floor(diffMins / 60);
                            const mins = diffMins % 60;
                            cancelTimeText = `กดยกเลิกหลังจากจอง: ${hours} ชั่วโมง ${mins} นาที`;
                        }
                    } else {
                        // For old bookings without timestamps
                        cancelTimeText = "ไม่ทราบเวลาที่ยกเลิกแน่ชัด";
                    }

                    const refundMessage = isRefundable
                        ? `<p style="color: #28a745; font-size: 14px; font-weight: bold; margin-top: 8px;">สามารถขอเงินคืนได้ (ยกเลิกภายใน 1 ชั่วโมง)</p>`
                        : `<p style="color: red; font-size: 14px; font-weight: bold; margin-top: 8px;">ไม่มีการคืนเงิน (ยกเลิกหลัง 1 ชั่วโมง)</p>`;

                    actionArea = `
                        <div style="text-align: center; margin-top: 20px;">
                            <p style="color: red; font-size: 16px; font-weight: bold;">คิวนี้ถูกยกเลิกแล้ว</p>
                            <p style="color: #5A3E25; font-size: 14px; margin-top: 5px;">${cancelTimeText}</p>
                            ${refundMessage}
                            <p style="color: #5A3E25; font-size: 12px; margin-top: 8px;">ติดต่อขอคืนเงินได้ที่ Facebook</p>
                        </div>
                    `;
                }

                body.innerHTML = `
                    <h5 style="color: #5A3E25; font-size: 30px; margin-top: 10px;letter-spacing: 8px; text-align: center;">---------------------------------------------</h5>
                    <h4 style="color: #5A3E25; margin-bottom: 10px; font-size: 20px; font-weight: bold; margin-top: 10px;">รายละเอียดการจอง</h4>
                    <div class="detail-row">
                        <p><strong>วัน เวลา:</strong> ${formatDate(item.date)} เวลา ${item.time}</p>
                    </div>
                    <div class="detail-row">
                        <p><strong>ระยะเวลา:</strong> ${item.duration} นาที</p>
                    </div>
                    <div class="detail-row">
                        <p><strong>ค่าบริการ:</strong> ${item.price} บาท</p> <span style="color: #28a745; font-weight: bold; margin-left: 10px;">ชำระเงินแล้ว</span>
                    </div>
                   
                    ${actionArea}
                `;
                card.appendChild(body);
            }

            container.appendChild(card);
        });

        // Attach event listeners
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                toggleCard(id);
            });
        });

        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-cancel-id');
                removeHistory(id);
            });
        });
    }

    function loadHistory() {
        if (window.useBooking) {
            const allBookings = window.useBooking.getBookings();
            const userEmail = currentUser.email || '';

            // Filter bookings by this user's email
            // Also map it to include 'expanded' state
            historyList = allBookings
                .filter(b => b.userEmail && b.userEmail.toLowerCase() === userEmail.toLowerCase())
                .map(item => ({
                    ...item,
                    expanded: false
                }));

            // Show newest first (assuming sorting by queue date logic, or just reverse order of creation)
            // Use Booking sorts by Date and Time ascending, so reversing it puts future bookings at the top
            historyList.reverse();
        }
        renderHistory();
    }

    loadHistory();
});
