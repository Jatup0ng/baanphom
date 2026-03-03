document.addEventListener("DOMContentLoaded", () => {
    // Gatekeeper
    const status = localStorage.getItem("isLoggedIn");
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้าประวัติ");
        window.location.href = '/index.html';
        return;
    }

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
            historyList = historyList.filter(item => String(item.id) !== String(id));
            localStorage.setItem('bookingHistory', JSON.stringify(historyList));
            renderHistory();
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
            container.innerHTML = `<div style="text-align:center; color:#999;"><p>ยังไม่มีประวัติการจอง</p></div>`;
            return;
        }

        historyList.forEach(item => {
            const card = document.createElement('div');
            card.className = `booking-card ${item.expanded ? 'active' : ''}`;

            const header = document.createElement('div');
            header.className = 'card-header';
            header.innerHTML = `
                <div class="header-info">
                    <h3 style="color: #5A3E25; margin-bottom: 10px; font-size: 30px; font-weight: bold;">ID: Q-${item.queueID || 'Unknown'}</h3>
                    <p style="margin-bottom: 5px;"><strong>บริการ:</strong> ${item.service}</p>
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
                        <p><strong>ค่าบริการ:</strong> ${item.price} บาท</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button class="cancel-btn" data-cancel-id="${item.id}">
                            ยกเลิกการจอง
                        </button>
                        <p style="color: red; font-size: 12px; margin-top: 8px;">***คำเตือน หากยกเลิกการจองจะไม่สามารถขอเงินคืนได้***</p>
                    </div>
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
        const stored = localStorage.getItem('bookingHistory');
        if (stored) {
            historyList = JSON.parse(stored).map(item => ({
                ...item,
                expanded: false
            }));
            historyList.reverse();
        }
        renderHistory();
    }

    loadHistory();
});
