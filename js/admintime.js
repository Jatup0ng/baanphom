document.addEventListener("DOMContentLoaded", () => {
    const barberSelect = document.getElementById('schedule-barber-select');
    const instructionBar = document.getElementById('instruction-bar');
    const scheduleWorkspace = document.getElementById('schedule-workspace');

    // Holiday specific Elements
    const normalTimeBox = document.getElementById('normal-time-box');
    const holidayListHeader = document.getElementById('holiday-list-header');
    const holidayListContainer = document.getElementById('holiday-list-container');
    const newHolidayDate = document.getElementById('new-holiday-date');
    const newHolidayTime = document.getElementById('new-holiday-time');
    const newHolidayReason = document.getElementById('new-holiday-reason');
    const btnSaveHoliday = document.getElementById('btn-save-holiday');

    const scheduleGridBox = document.getElementById('schedule-grid-box');
    const scheduleGridTbody = document.getElementById('schedule-grid-tbody');
    const btnSaveSchedule = document.getElementById('btn-save-schedule');

    const daysOfWeek = [
        { label: 'จันทร์', val: 1 },
        { label: 'อังคาร', val: 2 },
        { label: 'พุธ', val: 3 },
        { label: 'พฤหัสบดี', val: 4 },
        { label: 'ศุกร์', val: 5 },
        { label: 'เสาร์', val: 6 },
        { label: 'อาทิตย์', val: 0 }
    ];
    const timeSlots = [
        '11.00 - 12.00', '12.00 - 13.00', '13.00 - 14.00', '14.00 - 15.00',
        '15.00 - 16.00', '16.00 - 17.00', '17.00 - 18.00', '18.00 - 19.00',
        '19.00 - 20.00', '20.00 - 21.00'
    ];

    let barbers = [];
    let unavailableDatesData = [];

    function loadData() {
        if (window.useBooking) {
            barbers = window.useBooking.getBarbers();
            unavailableDatesData = window.useBooking.getUnavailableDates();
            populateBarberSelect();
        }
    }

    function populateBarberSelect() {
        // preserve 'all'
        const allOption = barberSelect.querySelector('option[value="all"]');
        const defaultOption = barberSelect.querySelector('option[disabled]');

        barberSelect.innerHTML = '';
        barberSelect.appendChild(defaultOption);
        barberSelect.appendChild(allOption);

        barbers.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b.id;
            opt.innerText = b.name;
            barberSelect.appendChild(opt);
        });
    }

    function getSelectedBarberName() {
        if (barberSelect.value === 'all') return 'ทุกคน (ปิดร้าน)';
        const b = barbers.find(x => x.id === barberSelect.value);
        return b ? b.name : '';
    }

    function renderWorkspace() {
        const val = barberSelect.value;
        if (!val) {
            instructionBar.style.display = 'block';
            scheduleWorkspace.style.display = 'none';
            return;
        }

        instructionBar.style.display = 'none';
        scheduleWorkspace.style.display = 'block';

        const barberName = getSelectedBarberName();

        if (val === 'all') {
            if (scheduleGridBox) scheduleGridBox.style.display = 'none';
        } else {
            if (scheduleGridBox) scheduleGridBox.style.display = 'block';
            const b = barbers.find(x => x.id === val);
            if (b) renderScheduleGrid(b);
        }

        holidayListHeader.innerText = `วันหยุดทั้งหมด (${barberName})`;
        renderHolidays();
    }

    function renderScheduleGrid(barber) {
        if (!scheduleGridTbody) return;
        scheduleGridTbody.innerHTML = '';

        // Default schedule if undefined: all true
        const schedule = barber.schedule || {};

        daysOfWeek.forEach(day => {
            const tr = document.createElement('tr');

            let rowHtml = `
                <td class="day-cell">
                    ${day.label}
                    <button class="btn-select-all" data-day="${day.val}" style="margin-top:5px; font-size:10px; padding:2px 5px; cursor:pointer;">เลือกทั้งหมด</button>
                </td>
            `;

            timeSlots.forEach(slot => {
                const isChecked = schedule[day.val] !== undefined ? !!schedule[day.val][slot] : true;
                rowHtml += `
                    <td>
                        <input type="checkbox" class="slot-checkbox" data-day="${day.val}" data-slot="${slot}" ${isChecked ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;">
                    </td>
                `;
            });

            tr.innerHTML = rowHtml;
            scheduleGridTbody.appendChild(tr);
        });

        // Attach select all events
        scheduleGridTbody.querySelectorAll('.btn-select-all').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayVal = e.target.getAttribute('data-day');
                const checkboxes = scheduleGridTbody.querySelectorAll(`.slot-checkbox[data-day="${dayVal}"]`);
                const anyUnchecked = Array.from(checkboxes).some(cb => !cb.checked);
                checkboxes.forEach(cb => cb.checked = anyUnchecked);
            });
        });
    }

    if (btnSaveSchedule) {
        btnSaveSchedule.addEventListener('click', () => {
            const val = barberSelect.value;
            if (!val || val === 'all') return;

            const newSchedule = {};
            daysOfWeek.forEach(day => {
                newSchedule[day.val] = {};
                timeSlots.forEach(slot => {
                    const cb = scheduleGridTbody.querySelector(`.slot-checkbox[data-day="${day.val}"][data-slot="${slot}"]`);
                    newSchedule[day.val][slot] = cb ? cb.checked : false;
                });
            });

            if (window.useBooking) {
                window.useBooking.updateBarberSchedule(val, newSchedule);
                alert("บันทึกตารางเวลาเรียบร้อยแล้ว");
                loadData(); // refresh to get updated barbers
                renderWorkspace();
            }
        });
    }

    function renderHolidays() {
        holidayListContainer.innerHTML = '';
        const val = barberSelect.value;

        const filteredHolidays = unavailableDatesData.filter(d => {
            if (val === 'all') {
                return !d.barberId;
            }
            return d.barberId === val || !d.barberId;
        });

        if (filteredHolidays.length === 0) {
            holidayListContainer.innerHTML = `
                <div class="form-group">
                    <div class="white-inner-box">
                        <i class="fas fa-exclamation-circle"></i> ยังไม่มีข้อมูลวันหยุด
                    </div>
                </div>
            `;
            return;
        }

        const listDiv = document.createElement('div');
        listDiv.className = 'holiday-list';

        filteredHolidays.forEach((h, index) => {
            const item = document.createElement('div');
            item.className = 'holiday-item';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';

            let html = `<div style="color:#fff; font-size:16px;"><strong>${h.date}</strong>`;
            if (h.time) {
                html += ` <span style="font-weight:500;">(เวลา ${h.time} น.)</span>`;
            }
            if (h.reason) {
                html += ` <span style="color:#fff;">- ${h.reason}</span>`;
            }
            if (!h.barberId) {
                html += ` <span class="badge-all" style="background-color:#E53935; padding:3px 8px; font-size:12px;">ปิดทั้งร้าน</span>`;
            }
            html += `</div>`;

            html += `
                <button class="btn-delete-holiday" data-index="${index}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ff5252; color:white;">
                    <i class="fas fa-trash"></i> ลบ
                </button>
            `;

            item.innerHTML = html;
            listDiv.appendChild(item);
        });

        holidayListContainer.appendChild(listDiv);

        // Attach delete events
        document.querySelectorAll('.btn-delete-holiday').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                if (confirm('คุณต้องการลบวันหยุดนี้ใช่หรือไม่?')) {
                    // find correct index in main array
                    const originalItem = filteredHolidays[idx];
                    const mainIndex = unavailableDatesData.indexOf(originalItem);
                    if (mainIndex > -1) {
                        unavailableDatesData.splice(mainIndex, 1);
                        if (window.useBooking) {
                            window.useBooking.saveUnavailableDates(unavailableDatesData);
                        }
                        renderHolidays();
                    }
                }
            });
        });
    }

    btnSaveHoliday.addEventListener('click', () => {
        if (!newHolidayDate.value) {
            alert("กรุณาเลือกวันที่");
            return;
        }

        const selectedDate = new Date(newHolidayDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert("ไม่สามารถเลือกวันหยุดย้อนหลังได้");
            return;
        }

        const val = barberSelect.value;

        // check if exists
        const exists = unavailableDatesData.some(d =>
            d.date === newHolidayDate.value &&
            d.time === (newHolidayTime ? newHolidayTime.value || null : null) &&
            ((val === 'all' && !d.barberId) || (d.barberId === val))
        );

        if (exists) {
            alert("วันที่/เวลานี้ถูกตั้งเป็นวันหยุดแล้ว");
            return;
        }

        const payload = {
            date: newHolidayDate.value,
            time: newHolidayTime ? newHolidayTime.value || null : null,
            barberId: val === 'all' ? null : val,
            reason: newHolidayReason.value
        };

        if (window.useBooking) {
            window.useBooking.addUnavailableDate(payload);
            unavailableDatesData = window.useBooking.getUnavailableDates(); // refresh

            // ─── ส่งแจ้งเตือนลูกค้าที่ได้รับผลกระทบ ───
            const allBookings = window.useBooking.getBookings();
            const affectedBookings = allBookings.filter(b => {
                if (b.status === 'cancelled' || b.status === 'ยกเลิก' || b.status === 'เสร็จสิ้น') return false;
                if (b.date !== payload.date) return false;
                // If shop closes entirely (barberId = null) → all bookings on that date
                // If specific barber closes → only their bookings
                if (payload.barberId && b.barber !== payload.barberId) return false;
                // If specific time slot → only that slot
                if (payload.time && b.time !== payload.time) return false;
                return true;
            });

            if (affectedBookings.length > 0) {
                const [y, m, d] = payload.date.split('-');
                const dateDisplay = `${d}/${m}/${y}`;
                const reasonNote = payload.reason ? ` เนื่องจาก${payload.reason}` : '';

                affectedBookings.forEach(b => {
                    const msg =
                        `ทางร้านกราบขออภัยเป็นอย่างยิ่งที่จำเป็นต้องยกเลิกคิวของคุณเวลา ${b.time || '-'} น. วันที่ ${dateDisplay}${reasonNote}\n` +
                        `ลูกค้าสามารถติดต่อขอรับเงินคืนเต็มจำนวนได้ทันที หรือนัดหมายวันใหม่ได้\n` +
                        `โดยรบกวนทักแชทที่เพจ Facebook ของร้านได้เลยครับ`;
                    window.useBooking.sendNotification(
                        b.userEmail || '',
                        b.name || '',
                        `แจ้งยกเลิกคิวตัดผม (วันที่ ${dateDisplay})`,
                        msg,
                        'admin'
                    );
                });

                alert(`✅ บันทึกวันหยุดเรียบร้อยแล้ว\n📢 ส่งแจ้งเตือนไปหาลูกค้า ${affectedBookings.length} คนที่ได้รับผลกระทบแล้ว`);
            } else {
                alert("บันทึกวันหยุดเรียบร้อยแล้ว");
            }
        }

        newHolidayDate.value = '';
        newHolidayReason.value = '';
        renderHolidays();
    });

    barberSelect.addEventListener('change', renderWorkspace);

    // Init
    loadData();
});
