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

            const newTime = prompt("แก้ไขเวลา (เช่น 15.00):", booking.time);
            if (newTime === null) return;

            const newService = prompt("แก้ไขบริการ:", booking.service);
            if (newService === null) return;

            window.useBooking.updateBookingDetails(id, { time: newTime, service: newService });
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

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background:#f4f4f4; text-align:left;">
                <th style="padding:10px;">เวลา</th>
                <th style="padding:10px;">ชื่อ</th>
                <th style="padding:10px;">บริการ</th>
                <th style="padding:10px;">ช่าง</th>
                <th style="padding:10px;">สถานะ</th>
                <th style="padding:10px;">จัดการ</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        filtered.forEach(booking => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #eee';

            const statusColor = booking.status === 'เสร็จสิ้น' ? 'green' : 'orange';

            tr.innerHTML = `
                <td style="padding:10px;">${booking.date || ''} ${booking.time || ''}</td>
                <td style="padding:10px;">${booking.name || '-'}</td>
                <td style="padding:10px;">${booking.service || '-'}</td>
                <td style="padding:10px;">${booking.barberName || booking.barber || '-'}</td>
                <td style="padding:10px;">
                    <span style="color: ${statusColor}">${booking.status || 'รอตัด'}</span>
                </td>
                <td style="padding:10px;">
                    <div style="display:flex; gap:5px;">
                        <button class="btn-toggle-status" data-id="${booking.id}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#fff;">
                            เปลี่ยนสถานะ
                        </button>
                        <button class="btn-edit-booking" data-id="${booking.id}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ffa500; color:white;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete-booking" data-id="${booking.id}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ff5252; color:white;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        const outerDiv = document.createElement('div');
        outerDiv.style.width = '100%';
        outerDiv.appendChild(table);
        listContainer.appendChild(outerDiv);

        // Attach events
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
