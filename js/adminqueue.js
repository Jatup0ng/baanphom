document.addEventListener("DOMContentLoaded", () => {
    const filterDateInput = document.getElementById('filter-date');
    const filterStatusSelect = document.getElementById('filter-status');
    const listContainer = document.getElementById('queue-list-container');

    let allBookings = [];

    function loadData() {
        if (window.useBooking) {
            allBookings = window.useBooking.getBookings();
            renderTable();
        }
    }

    function toggleStatus(id) {
        if (window.useBooking) {
            const booking = allBookings.find(b => b.id === id);
            if (booking) {
                if (booking.status === 'cancelled' || booking.status === 'ยกเลิก') {
                    alert("คิวที่ถูกยกเลิกแล้ว ไม่สามารถเปลี่ยนสถานะได้");
                    return;
                }
                const newStatus = booking.status === 'รอตัด' ? 'เสร็จสิ้น' : 'รอตัด';
                window.useBooking.updateBookingStatus(id, newStatus);
                booking.status = newStatus; // optimistic
                renderTable();
            }
        }
    }

    function editBooking(id) {
        if (window.useBooking) {
            const booking = allBookings.find(b => b.id === id);
            if (!booking) return;

            const newService = prompt("แก้ไขบริการ:", booking.service);
            if (newService === null) return;

            window.useBooking.updateBookingDetails(id, { service: newService });
            loadData();
        }
    }

    function deleteBookingAdmin(id) {
        if (confirm("คุณต้องการลบคิวนี้ใช่หรือไม่?")) {
            if (window.useBooking) {
                window.useBooking.deleteBooking(id);
                loadData();
            }
        }
    }

    function handleCall(id) {
        if (confirm("แจ้งเตือนลูกค้าท่านนี้ใช่หรือไม่?")) {
            const booking = allBookings.find(b => b.id === id);
            if (booking && booking.name) {
                const title = "การแจ้งเตือน";
                const message = `ใกล้ถึงคิวของคุณแล้ว\nคุณ ${booking.name} อีก 1 คิวโปรดเตรียมตัวและเตรียมผมให้พร้อม!`;

                // Create Notification
                const allNotifs = JSON.parse(localStorage.getItem('bp_notifications') || '[]');
                allNotifs.push({
                    id: Date.now().toString(),
                    targetUser: booking.name,
                    targetEmail: booking.userEmail || '',
                    title: title,
                    message: message,
                    timestamp: new Date().toISOString(),
                    read: false
                });
                localStorage.setItem('bp_notifications', JSON.stringify(allNotifs));
                alert("ส่งการแจ้งเตือนสำเร็จ ✅");
            } else {
                alert("ไม่พบข้อมูลลูกค้า");
            }
        }
    }

    function renderTable() {
        listContainer.innerHTML = '';

        const filterDate = filterDateInput.value;
        const filterStatus = filterStatusSelect.value;

        const filtered = allBookings.filter(b => {
            let matchDate = true;
            let matchStatus = true;

            if (filterDate) {
                matchDate = b.date === filterDate;
            }

            if (filterStatus !== 'ทั้งหมด') {
                matchStatus = b.status === filterStatus;
            }

            return matchDate && matchStatus;
        });

        if (filtered.length === 0) {
            listContainer.innerHTML = `
                <div class="white-inner-box">
                    <i class="fas fa-exclamation-circle"></i> ยังไม่พบข้อมูลการจอง
                </div>
            `;
            return;
        }

        // 1. หัวข้อ อยู่นอกกรอบขาว แยกเป็นกล่องตัวเอง
        const headerRow = document.createElement('div');
        headerRow.className = 'q-header-row';
        headerRow.innerHTML = `
            <div class="q-col">เวลา</div>
            <div class="q-col">ชื่อ</div>
            <div class="q-col">บริการ</div>
            <div class="q-col">ช่าง</div>
            <div class="q-col">สถานะ</div>
            <div class="q-col">จัดการ</div>
        `;
        listContainer.appendChild(headerRow);

        // 2. กรอบขาวแยก สำหรับข้อมูล
        const dataBox = document.createElement('div');
        dataBox.className = 'q-data-container';

        filtered.forEach(booking => {
            const dataRow = document.createElement('div');
            dataRow.className = 'q-data-line';

            let statusColor = 'orange';
            let statusText = booking.status || 'รอตัด';
            let isCancelled = false;

            if (booking.status === 'เสร็จสิ้น') {
                statusColor = 'green';
            } else if (booking.status === 'cancelled' || booking.status === 'ยกเลิก') {
                statusColor = 'red';
                statusText = 'ยกเลิกแล้ว';
                isCancelled = true;
            }

            const toggleBtnStyle = isCancelled
                ? 'cursor:not-allowed; opacity:0.5; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#e0e0e0;'
                : 'cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#fff;';

            dataRow.innerHTML = `
                <div class="q-col">${booking.date || ''} <br> ${booking.time || ''}</div>
                <div class="q-col">
                    ${booking.name || '-'}
                    ${booking.bookingNote ? `<br><small style="color: gray;">(${booking.bookingNote})</small>` : ''}
                </div>
                <div class="q-col">${booking.service || '-'}</div>
                <div class="q-col">${booking.barberName || booking.barber || '-'}</div>
                <div class="q-col">
                    <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
                </div>
                <div class="q-col">
                    <div style="display:flex; gap:5px; flex-wrap: wrap;">
                        <button class="btn-call" data-id="${booking.id}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#8B5E3C; color:white;">
                            <i class="fas fa-bell"></i> โทร
                        </button>
                        <button class="btn-toggle-status" data-id="${booking.id}" style="${toggleBtnStyle}" ${isCancelled ? 'disabled' : ''}>
                            เปลี่ยนสถานะ
                        </button>
                        <button class="btn-edit-booking" data-id="${booking.id}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ffa500; color:white;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete-booking" data-id="${booking.id}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ff5252; color:white;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            dataBox.appendChild(dataRow);
        });

        listContainer.appendChild(dataBox);

        // Attach events
        document.querySelectorAll('.btn-call').forEach(btn => {
            btn.addEventListener('click', (e) => {
                handleCall(e.currentTarget.getAttribute('data-id'));
            });
        });
        document.querySelectorAll('.btn-toggle-status').forEach(btn => {
            btn.addEventListener('click', (e) => {
                toggleStatus(e.currentTarget.getAttribute('data-id'));
            });
        });
        document.querySelectorAll('.btn-edit-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                editBooking(e.currentTarget.getAttribute('data-id'));
            });
        });
        document.querySelectorAll('.btn-delete-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                deleteBookingAdmin(e.currentTarget.getAttribute('data-id'));
            });
        });
    }

    // Event Listeners for filters
    filterDateInput.addEventListener('change', renderTable);
    filterStatusSelect.addEventListener('change', renderTable);

    // Initial Load
    loadData();
});
