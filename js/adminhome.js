document.addEventListener("DOMContentLoaded", () => {
    const timeSlots = [
        '11.00', '12.00', '13.00', '14.00', '15.00',
        '16.00', '17.00', '18.00', '19.00', '20.00', '21.00'
    ];

    let nextQueue = null;

    function loadDashboardData() {
        // Date
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        document.getElementById('current-date').innerText = new Date().toLocaleDateString('th-TH', options);

        // Stats
        const allBookings = window.useBooking.getBookings();

        // Fix timezone issue for "today"
        const today = new Date();
        const localToday = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        const todayBookings = allBookings.filter(b => b.date === localToday);

        document.getElementById('today-queue-count').innerText = `${todayBookings.length} คิว`;
        document.getElementById('month-queue-count').innerText = `${allBookings.length} คิว`;

        // Count cancelled
        const cancelled = allBookings.filter(b => b.status === 'ยกเลิก').length;
        document.getElementById('cancel-queue-count').innerText = `${cancelled} คิว`;

        // Next Queue logic
        const pendingToday = todayBookings.filter(b => b.status === 'รอตัด').sort((a, b) => {
            return (a.time || '').localeCompare(b.time || '');
        });

        if (pendingToday.length > 0) {
            nextQueue = pendingToday[0];
        }

        renderNextQueue();
        renderTimeSlots(todayBookings);
    }

    function renderNextQueue() {
        const card = document.getElementById('next-queue-card');
        card.innerHTML = '';

        const userIcon = document.createElement('div');
        userIcon.className = 'user-icon';
        userIcon.innerHTML = `<i class="fas fa-user-circle"></i>`;
        card.appendChild(userIcon);

        const info = document.createElement('div');
        info.className = 'queue-info';

        if (!nextQueue) {
            info.innerHTML = `<div class="info-row">ไม่มีคิวเร็วๆ นี้</div>`;
            card.appendChild(info);
        } else {
            info.innerHTML = `
                <div class="info-row"><strong>เวลา:</strong> <span>${nextQueue.time}</span></div>
                <div class="info-row"><strong>ชื่อลูกค้า:</strong> <span>${nextQueue.name || 'ลูกค้า'}</span></div>
                <div class="info-row"><strong>บริการ:</strong> <span>${nextQueue.service}</span></div>
            `;
            card.appendChild(info);

            const callBtn = document.createElement('button');
            callBtn.className = 'btn-call';
            callBtn.innerHTML = `<i class="fas fa-phone-alt"></i> โทร`;
            callBtn.onclick = () => {
                alert(`กำลังเรียกคุณ ${nextQueue.name || 'ลูกค้า'} คิวที่ Q-${nextQueue.queueID}`);
            };
            card.appendChild(callBtn);
        }
    }

    function renderTimeSlots(todayBookings) {
        const list = document.getElementById('dashboard-time-list');
        list.innerHTML = '';

        timeSlots.forEach(slot => {
            const row = document.createElement('div');
            row.className = 'time-row';

            // Note: users book slots like "11.00 - 12.00". Need to check if it starts with 'slot'
            const bookingAtSlot = todayBookings.find(b => b.time && b.time.startsWith(slot) && b.status !== 'ยกเลิก');

            let slotContent = `ว่าง <i class="fas fa-plus-circle"></i>`;
            let boxStyle = "";
            let boxClass = "slot-box";

            if (bookingAtSlot) {
                slotContent = `<span>${bookingAtSlot.name || 'ลูกค้า'}</span> <span><i class="fas fa-edit"></i></span>`;
                boxStyle = "background-color: #5D4037; color: white; border: none; flex-grow: 1; border-radius: 6px; padding: 8px 15px; font-size: 14px; display: flex; justify-content: space-between; align-items: center;";
            }

            row.innerHTML = `
                <span class="time-text">${slot} น.-</span>
                <div class="${boxClass}" style="${boxStyle}">${slotContent}</div>
            `;
            list.appendChild(row);
        });
    }

    // Call init
    if (window.useBooking) {
        loadDashboardData();
    }
});
