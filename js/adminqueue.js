document.addEventListener("DOMContentLoaded", () => {
    const filterDateInput = document.getElementById('filter-date');
    const filterStatusSelect = document.getElementById('filter-status');
    const listContainer = document.getElementById('queue-list-container');

    let allBookings = [];

    /* ─── Helper: format date YYYY-MM-DD → DD/MM/YYYY ─── */
    function fmtDate(dateStr) {
        if (!dateStr) return '-';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }

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
                    bpAlert.error("ไม่สามารถดำเนินการได้", "คิวที่ถูกยกเลิกแล้ว ไม่สามารถเปลี่ยนสถานะได้ครับ");
                    return;
                }
                const newStatus = booking.status === 'รอตัด' ? 'เสร็จสิ้น' : 'รอตัด';
                window.useBooking.updateBookingStatus(id, newStatus);
                booking.status = newStatus;
                renderTable();
            }
        }
    }

    /* ─────────────── EDIT BOOKING MODAL ─────────────── */
    function injectEditModal() {
        if (document.getElementById('edit-booking-modal')) return;

        const barbers = window.useBooking ? window.useBooking.getBarbers() : [];
        const services = window.useBooking ? window.useBooking.getServices() : [];

        const timeSlots = [
            '11.00 - 12.00', '12.00 - 13.00', '13.00 - 14.00', '14.00 - 15.00',
            '15.00 - 16.00', '16.00 - 17.00', '17.00 - 18.00', '18.00 - 19.00',
            '19.00 - 20.00', '20.00 - 21.00'
        ];

        const barberOptions = barbers.map(b =>
            `<option value="${b.id}">${b.name}</option>`).join('');
        const serviceOptions = services.map(s =>
            `<option value="${s.name}">${s.name}</option>`).join('');
        const timeOptions = timeSlots.map(t =>
            `<option value="${t}">${t} น.</option>`).join('');

        const modal = document.createElement('div');
        modal.id = 'edit-booking-modal';
        modal.style.cssText = `
            display:none; position:fixed; inset:0;
            background:rgba(0,0,0,0.5); z-index:9999;
            justify-content:center; align-items:center;
        `;
        modal.innerHTML = `
            <div style="background:#fff; border-radius:14px; padding:28px 32px;
                        width:min(460px,92vw); box-shadow:0 8px 32px rgba(0,0,0,0.2); font-family:'Sarabun',sans-serif;">
                <h3 style="margin:0 0 18px; color:#5A3E25; font-size:20px;">✏️ แก้ไขการจอง</h3>

                <div style="margin-bottom:12px; display: flex; gap: 10px;">
                    <div style="flex: 1;">
                        <label style="font-weight:600; color:#8B5E3C; display:block; margin-bottom:4px;">ชื่อลูกค้า</label>
                        <input type="text" id="edit-display-name" readonly
                            style="width:100%; padding:8px 10px; border:1px solid #eee; border-radius:8px; font-size:14px; box-sizing:border-box; background:#f9f9f9; color:#666;">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-weight:600; color:#8B5E3C; display:block; margin-bottom:4px;">เบอร์โทร</label>
                        <input type="text" id="edit-display-phone" readonly
                            style="width:100%; padding:8px 10px; border:1px solid #eee; border-radius:8px; font-size:14px; box-sizing:border-box; background:#f9f9f9; color:#666;">
                    </div>
                </div>

                <div style="margin-bottom:12px;">
                    <label style="font-weight:600; color:#8B5E3C; display:block; margin-bottom:4px;">วันที่</label>
                    <input type="date" id="edit-date"
                        style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:8px; font-size:15px; box-sizing:border-box;">
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:600; color:#8B5E3C; display:block; margin-bottom:4px;">เวลา</label>
                    <select id="edit-time"
                        style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:8px; font-size:15px; box-sizing:border-box;">
                        ${timeOptions}
                    </select>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:600; color:#8B5E3C; display:block; margin-bottom:4px;">ช่าง</label>
                    <select id="edit-barber"
                        style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:8px; font-size:15px; box-sizing:border-box;">
                        ${barberOptions}
                    </select>
                </div>
                <div style="margin-bottom:20px;">
                    <label style="font-weight:600; color:#8B5E3C; display:block; margin-bottom:4px;">บริการ</label>
                    <select id="edit-service"
                        style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:8px; font-size:15px; box-sizing:border-box;">
                        ${serviceOptions}
                    </select>
                </div>

                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button id="edit-cancel-btn"
                        style="padding:9px 22px; border-radius:8px; border:1px solid #ccc;
                               background:#f5f5f5; cursor:pointer; font-size:15px;">
                        ยกเลิก
                    </button>
                    <button id="edit-save-btn"
                        style="padding:9px 22px; border-radius:8px; border:none;
                               background:#8B5E3C; color:#fff; cursor:pointer; font-size:15px; font-weight:600;">
                        บันทึก
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('edit-cancel-btn').addEventListener('click', closeEditModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeEditModal(); });
    }

    function openEditModal(id) {
        injectEditModal();
        const booking = allBookings.find(b => b.id === id);
        if (!booking) return;

        const modal = document.getElementById('edit-booking-modal');

        let displayPhone = booking.phone;
        // Fallback for old bookings that don't have phone field saved
        if (!displayPhone && booking.userEmail) {
            const users = JSON.parse(localStorage.getItem("bp_users") || "[]");
            const u = users.find(x => x.email === booking.userEmail);
            if (u) displayPhone = u.phone;
        }

        document.getElementById('edit-display-name').value = booking.name || '-';
        document.getElementById('edit-display-phone').value = displayPhone || '-';
        document.getElementById('edit-date').value = booking.date || '';
        document.getElementById('edit-time').value = booking.time || '';
        document.getElementById('edit-barber').value = booking.barber || '';
        document.getElementById('edit-service').value = booking.service || '';

        modal.style.display = 'flex';
        modal._currentId = id;

        // Remove old save handler and add new
        const saveBtn = document.getElementById('edit-save-btn');
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        newSaveBtn.addEventListener('click', () => saveEdit(id, booking));
    }

    function closeEditModal() {
        const modal = document.getElementById('edit-booking-modal');
        if (modal) modal.style.display = 'none';
    }

    function saveEdit(id, originalBooking) {
        const newDate = document.getElementById('edit-date').value;
        const newTime = document.getElementById('edit-time').value;
        const newBarberId = document.getElementById('edit-barber').value;
        const newService = document.getElementById('edit-service').value;

        if (!newDate) { bpAlert.error("ข้อมูลไม่ครบ", "กรุณาเลือกวันที่ก่อนบันทึกครับ"); return; }

        const barbers = window.useBooking ? window.useBooking.getBarbers() : [];
        const newBarberName = (barbers.find(b => b.id === newBarberId) || {}).name || newBarberId;

        const hasDateTimeChanged = newDate !== originalBooking.date || newTime !== originalBooking.time || newBarberId !== originalBooking.barber;

        if (window.useBooking) {
            // Check if slot is available (excluding the current booking itself)
            const isAvailable = window.useBooking.isSlotAvailable(newDate, newTime, newBarberId, id);
            if (!isAvailable) {
                bpAlert.error("เวลาไม่ว่าง", "❌ ขออภัย ช่วงเวลาที่คุณเลือกมีผู้จองแล้วหรือช่างไม่ว่างในเวลาดังกล่าว กรุณาเลือกเวลาอื่นครับ");
                return;
            }

            window.useBooking.updateBookingDetails(id, {
                date: newDate,
                time: newTime,
                barber: newBarberId,
                barberName: newBarberName,
                service: newService
            });

            // Notify customer about reschedule
            const targetEmail = originalBooking.userEmail || '';
            const targetUser = originalBooking.name || '';

            if (hasDateTimeChanged) {
                const msg = `ทางร้านแจ้งเปลี่ยนแปลงข้อมูลการนัดหมายของคุณ\n` +
                    `📅 วันที่ใหม่: ${fmtDate(newDate)} เวลา ${newTime} น.\n` +
                    `✂️ ช่าง: ${newBarberName}\n` +
                    `💈 บริการ: ${newService}\n\n` +
                    `หากไม่สะดวกเวลาดังกล่าว กรุณาติดต่อทักแชทที่เพจ Facebook ของร้านได้เลยครับ`;
                window.useBooking.sendNotification(targetEmail, targetUser,
                    `แจ้งเลื่อนนัดตัดผม (วันที่ ${fmtDate(originalBooking.date)})`, msg, 'admin');
            }
        }

        closeEditModal();
        loadData();
        bpAlert.success("บันทึกสำเร็จ", "✅ บันทึกการแก้ไขข้อมูลการจองเรียบร้อยแล้วครับ");
    }

    /* ─────────────── DELETE WITH NOTIFICATION ─────────────── */
    function deleteBookingAdmin(id) {
        const booking = allBookings.find(b => b.id === id);
        if (!booking) return;

        const isCancelled = booking.status === 'cancelled' || booking.status === 'ยกเลิก';
        const dateStr = fmtDate(booking.date);
        const confirmMsg = `คุณต้องการลบข้อมูลการจองของคุณ "${booking.name || 'ไม่ระบุชื่อ'}" วันที่ ${dateStr} ใช่หรือไม่?`;

        bpAlert.confirm('ยืนยันการลบคิว', confirmMsg).then((result) => {
            if (result.isConfirmed) {
                if (window.useBooking) {
                    // ส่งแจ้งเตือนเฉพาะกรณีที่ลูกค้ายังไม่ได้ยกเลิกเอง
                    if (!isCancelled) {
                        const targetEmail = booking.userEmail || '';
                        const targetUser = booking.name || '';
                        const msg = `ทางร้านกราบขออภัยเป็นอย่างยิ่งที่จำเป็นต้องยกเลิกคิวของคุณเวลา ${booking.time || '-'} น. วันที่ ${dateStr}\n` +
                            `ลูกค้าสามารถติดต่อขอรับเงินคืนเต็มจำนวนได้ทันที หรือจองวันนัดใหม่ได้\n` +
                            `โดยรบกวนทักแชทที่เพจ Facebook ของร้านได้เลยครับ`;
                        window.useBooking.sendNotification(targetEmail, targetUser,
                            `แจ้งยกเลิกคิวตัดผม (วันที่ ${dateStr})`, msg, 'admin');
                    }

                    window.useBooking.deleteBooking(id);
                    loadData();
                    bpAlert.success("ลบสำเร็จ", "ลบข้อมูลการจองออกจากระบบเรียบร้อยแล้วครับ");
                }
            }
        });
    }

    function handleCall(id) {
        // ในระบบจริงอาจจะมีการส่ง Push Notification หรือ Signal ไปที่หน้าจอเรียกคิว
        // ในที่นี้เราจะแสดง Alert และบันทึกประวัติการเรียก (ถ้ามี)
        bpAlert.success("เรียกคิวสำเร็จ", "ระบบได้ทำการส่งสัญญาณเรียกคิวเรียบร้อยแล้วครับผม");
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
                openEditModal(e.currentTarget.getAttribute('data-id'));
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
