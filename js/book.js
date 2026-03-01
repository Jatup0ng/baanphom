document.addEventListener("DOMContentLoaded", () => {
    // Shared state variables
    let selectedService = '';
    let selectedBarber = '';
    let selectedDate = '';
    let selectedTime = '';
    let userName = '';
    let barbersList = [];
    let unavailableDatesData = [];

    const allTimeSlots = [
        "11.00 - 12.00", "12.00 - 13.00", "13.00 - 14.00",
        "14.00 - 15.00", "15.00 - 16.00", "16.00 - 17.00",
        "17.00 - 18.00", "18.00 - 19.00", "19.00 - 20.00",
        "20.00 - 21.00"
    ];

    // Gatekeeper
    const status = localStorage.getItem("isLoggedIn");
    const name = localStorage.getItem("userName");

    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าจองคิว");
        window.location.href = '/index.html';
        return; // Don't run the rest of the script
    }

    if (name) {
        userName = name;
        document.getElementById('userNameInput').value = userName;
    }

    // Load data from useBooking
    barbersList = window.useBooking.getBarbers().filter(b => b.active);
    const servicesList = window.useBooking.getServices().filter(s => s.active);
    unavailableDatesData = window.useBooking.getUnavailableDates();

    // DOM Elements
    const serviceSelect = document.getElementById('inputService');
    const barberSelect = document.getElementById('barber-select');
    const priceInput = document.getElementById('priceInput');
    const dateStrip = document.getElementById('dateStrip');
    const timeGridContainer = document.getElementById('timeGridContainer');
    const timeGrid = document.getElementById('timeGrid');
    const nextBtn = document.getElementById('btnNext');

    // Populate services
    serviceSelect.innerHTML = '<option value="" selected>เลือกบริการ</option>';
    servicesList.forEach(s => {
        const option = document.createElement('option');
        option.value = s.name;
        option.textContent = s.name;
        option.dataset.price = s.price;
        option.dataset.duration = s.duration;
        serviceSelect.appendChild(option);
    });

    // Populate barbers
    barbersList.forEach(b => {
        const option = document.createElement('option');
        option.value = b.id;
        option.textContent = b.name;
        barberSelect.appendChild(option);
    });

    // Handle Service Change
    serviceSelect.addEventListener('change', (e) => {
        selectedService = e.target.value;
        const opt = e.target.options[e.target.selectedIndex];
        if (selectedService && opt) {
            priceInput.value = opt.dataset.price || "";
        } else {
            priceInput.value = "";
        }
    });

    // Helpers
    function isDateAvailable(dateStr) {
        const isShopClosed = unavailableDatesData.some(u => u.date === dateStr && !u.barberId);
        if (isShopClosed) return false;

        if (selectedBarber) {
            const isBarberClosed = unavailableDatesData.some(u => u.date === dateStr && u.barberId === selectedBarber);
            if (isBarberClosed) return false;
        }
        return true;
    }

    function isTimeSlotAvailable(time) {
        if (!selectedDate || !selectedBarber) return true;
        return window.useBooking.isSlotAvailable(selectedDate, time, selectedBarber);
    }

    // Render Dates
    function renderDates() {
        dateStrip.innerHTML = '';
        const dayNames = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            const available = isDateAvailable(dateString);

            const dateBox = document.createElement('div');
            dateBox.className = `date-box ${available ? '' : 'unavailable'} ${selectedDate === dateString ? 'selected' : ''}`;

            dateBox.innerHTML = `
                <div class="day-name">${dayNames[d.getDay()]}</div>
                <div class="day-number">${d.getDate()}</div>
            `;

            if (available) {
                dateBox.addEventListener('click', () => {
                    selectedDate = dateString;
                    selectedTime = ''; // reset time
                    renderDates();
                    renderTimes();
                });
            }
            dateStrip.appendChild(dateBox);
        }
    }

    // Render Times
    function renderTimes() {
        if (!selectedDate) {
            timeGridContainer.style.display = 'none';
            return;
        }

        timeGridContainer.style.display = 'block';
        timeGrid.innerHTML = '';

        allTimeSlots.forEach(time => {
            const available = isTimeSlotAvailable(time);

            const btn = document.createElement('button');
            btn.className = `time-slot ${available ? '' : 'disabled'} ${selectedTime === time ? 'selected' : ''}`;
            btn.textContent = time;
            btn.disabled = !available;

            if (available) {
                btn.addEventListener('click', () => {
                    selectedTime = time;
                    renderTimes(); // re-render to show selected
                });
            }

            timeGrid.appendChild(btn);
        });
    }

    // Handle Barber Change
    barberSelect.addEventListener('change', (e) => {
        selectedBarber = e.target.value;
        selectedTime = '';
        if (selectedDate && !isDateAvailable(selectedDate)) {
            selectedDate = '';
        }
        renderDates();
        renderTimes();
    });

    // Initial renders
    renderDates();
    renderTimes();

    // Next Button
    nextBtn.addEventListener('click', () => {
        if (!selectedService || !selectedBarber) {
            alert("กรุณาเลือกบริการและช่าง");
            return;
        }
        if (!selectedDate || !selectedTime) {
            alert("กรุณาเลือกวันและเวลาให้ครบถ้วน");
            return;
        }

        const selectedOpt = serviceSelect.options[serviceSelect.selectedIndex];
        let price = selectedOpt && selectedOpt.dataset.price ? selectedOpt.dataset.price : "150";
        let duration = selectedOpt && selectedOpt.dataset.duration ? selectedOpt.dataset.duration : "60";
        // Strip text if needed or just pass as is (qr.js appends directly)
        price = price.replace(' บาท', '').trim();
        duration = duration.replace(' นาที', '').trim();

        const barberName = barbersList.find(b => b.id === selectedBarber)?.name || selectedBarber;

        const bookingData = {
            service: selectedService,
            date: selectedDate,
            time: selectedTime,
            price: price,
            duration: duration,
            barber: selectedBarber,
            barberName: barberName
        };

        localStorage.setItem("tempBooking", JSON.stringify(bookingData));
        window.location.href = '../payment/pay.html';
    });
});
