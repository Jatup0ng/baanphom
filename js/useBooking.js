// Helper to get bookings from localStorage
function getBookings() {
    const bookings = localStorage.getItem('bookings');
    return bookings ? JSON.parse(bookings) : [];
}

// Helper to save bookings to localStorage
function saveBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

// Add a new booking
function addBooking(booking) {
    const bookings = getBookings();
    if (!booking.id) {
        booking.id = Date.now().toString();
    }
    if (!booking.createdAt) {
        booking.createdAt = new Date().toISOString();
    }

    // Update if exists, otherwise push
    const existsIndex = bookings.findIndex(b => b.id === booking.id);
    if (existsIndex !== -1) {
        bookings[existsIndex] = booking;
    } else {
        bookings.push(booking);
    }

    // Sort all bookings by Date and Time
    bookings.sort((a, b) => {
        // time format is e.g. "11.00 - 12.00", convert "11.00" to "11:00"
        const timeA = a.time ? a.time.substring(0, 5).replace('.', ':') : '00:00';
        const timeB = b.time ? b.time.substring(0, 5).replace('.', ':') : '00:00';
        const dateTimeA = new Date(`${a.date}T${timeA}`).getTime();
        const dateTimeB = new Date(`${b.date}T${timeB}`).getTime();
        return dateTimeA - dateTimeB; // Earliest first
    });

    const timeSlotMap = {
        "11.00 - 12.00": 1,
        "12.00 - 13.00": 2,
        "13.00 - 14.00": 3,
        "14.00 - 15.00": 4,
        "15.00 - 16.00": 5,
        "16.00 - 17.00": 6,
        "17.00 - 18.00": 7,
        "18.00 - 19.00": 8,
        "19.00 - 20.00": 9,
        "20.00 - 21.00": 10
    };

    // Calculate queue numbers directly from time slot map
    bookings.forEach(b => {
        b.queueID = timeSlotMap[b.time] || 0;
    });

    saveBookings(bookings);

    // Sync queueIDs to bookingHistory if it exists
    const historyStored = localStorage.getItem('bookingHistory');
    if (historyStored) {
        let historyList = JSON.parse(historyStored);
        historyList = historyList.map(hItem => {
            const match = bookings.find(b => b.id === hItem.id);
            if (match) hItem.queueID = match.queueID;
            return hItem;
        });
        localStorage.setItem('bookingHistory', JSON.stringify(historyList));
    }

    // Also update the passed-in booking object's queueID
    const updatedBooking = bookings.find(b => b.id === booking.id);
    if (updatedBooking) {
        booking.queueID = updatedBooking.queueID;
    }

    return booking;
}

// Update booking status
function updateBookingStatus(id, status) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = status;
        saveBookings(bookings);
        return true;
    }
    return false;
}

// Update booking details
function updateBookingDetails(id, newData) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index] = { ...bookings[index], ...newData };
        saveBookings(bookings);
        return true;
    }
    return false;
}

// Delete booking completely
function deleteBooking(id) {
    let bookings = getBookings();
    bookings = bookings.filter(b => b.id !== id);
    saveBookings(bookings);
}

// Get Today's bookings
function getTodayBookings() {
    const bookings = getBookings();
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date === today);
}

// --- Barbers Management ---
function getBarbers() {
    const barbers = localStorage.getItem('barbers');
    if (!barbers) {
        const defaultBarbers = [
            { id: '1', name: 'ช่างA', active: true },
            { id: '2', name: 'ช่างB', active: true }
        ];
        localStorage.setItem('barbers', JSON.stringify(defaultBarbers));
        return defaultBarbers;
    }
    return JSON.parse(barbers);
}

function saveBarbers(barbers) {
    localStorage.setItem('barbers', JSON.stringify(barbers));
}

function addBarber(barber) {
    const barbers = getBarbers();
    if (!barber.id) barber.id = Date.now().toString();
    barbers.push(barber);
    saveBarbers(barbers);
}

function updateBarber(id, newName) {
    const barbers = getBarbers();
    const idx = barbers.findIndex(b => b.id === id);
    if (idx !== -1) {
        barbers[idx].name = newName;
        saveBarbers(barbers);
    }
}

function updateBarberSchedule(id, newSchedule) {
    const barbers = getBarbers();
    const idx = barbers.findIndex(b => b.id === id);
    if (idx !== -1) {
        barbers[idx].schedule = newSchedule;
        saveBarbers(barbers);
    }
}

function deleteBarber(id) {
    let barbers = getBarbers();
    barbers = barbers.filter(b => b.id !== id);
    saveBarbers(barbers);
}

// --- Unavailable Dates Management ---
function getUnavailableDates() {
    const dates = localStorage.getItem('unavailableDates');
    return dates ? JSON.parse(dates) : [];
}

function saveUnavailableDates(dates) {
    localStorage.setItem('unavailableDates', JSON.stringify(dates));
}

function addUnavailableDate(dateInfo) {
    const dates = getUnavailableDates();
    dates.push(dateInfo);
    saveUnavailableDates(dates);
}

// Check if a specific slot is available
function isSlotAvailable(date, time, barberId) {
    // 1. Check Barber Schedule (from grid)
    const barbers = getBarbers();
    const barber = barbers.find(b => b.id === barberId);
    if (!barber) return false;

    if (barber.schedule) {
        const [year, month, day] = date.split('-');
        const d = new Date(year, month - 1, day);
        const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday ...

        if (barber.schedule[dayOfWeek] && barber.schedule[dayOfWeek][time] === false) {
            return false; // Checked off in the schedule grid
        }
    }

    // 2. Check manual specific Holidays
    const unavailableDates = getUnavailableDates();
    const isUnavailable = unavailableDates.some(u =>
        u.date === date &&
        (!u.barberId || u.barberId === barberId) &&
        (!u.time || u.time === time)
    );
    if (isUnavailable) return false;

    const bookings = getBookings();
    const isBooked = bookings.some(b =>
        b.date === date &&
        b.time === time &&
        b.barber === barberId &&
        b.status !== 'cancelled'
    );

    return !isBooked;
}

// --- Services Management ---
function getServices() {
    const services = localStorage.getItem('services');
    if (!services) {
        const defaultServices = [
            {
                id: '1',
                image: 'https://via.placeholder.com/60',
                name: 'ตัด สระ ไดร์',
                desc: 'ตัด สระ ไดร์',
                duration: '60 นาที',
                price: '150 บาท',
                active: true
            }
        ];
        localStorage.setItem('services', JSON.stringify(defaultServices));
        return defaultServices;
    }
    return JSON.parse(services);
}

function saveServices(services) {
    localStorage.setItem('services', JSON.stringify(services));
}

function addService(service) {
    const services = getServices();
    if (!service.id) service.id = Date.now().toString();
    services.push(service);
    saveServices(services);
}

function updateService(id, newData) {
    const services = getServices();
    const idx = services.findIndex(s => s.id === id);
    if (idx !== -1) {
        services[idx] = { ...services[idx], ...newData };
        saveServices(services);
    }
}

function deleteService(id) {
    let services = getServices();
    services = services.filter(s => s.id !== id);
    saveServices(services);
}

// Expose functions globally
window.useBooking = {
    getBookings,
    addBooking,
    updateBookingStatus,
    updateBookingDetails,
    deleteBooking,
    getTodayBookings,
    getBarbers,
    saveBarbers,
    addBarber,
    updateBarber,
    deleteBarber,
    updateBarberSchedule,
    getUnavailableDates,
    saveUnavailableDates,
    addUnavailableDate,
    isSlotAvailable,
    getServices,
    saveServices,
    addService,
    updateService,
    deleteService
};
