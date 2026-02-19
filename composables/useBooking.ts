export const useBooking = () => {
    // Helper to get bookings from localStorage
    const getBookings = () => {
        if (import.meta.client) {
            const bookings = localStorage.getItem('bookings');
            return bookings ? JSON.parse(bookings) : [];
        }
        return [];
    };

    // Helper to save bookings to localStorage
    const saveBookings = (bookings: any[]) => {
        if (import.meta.client) {
            localStorage.setItem('bookings', JSON.stringify(bookings));
        }
    };

    // Add a new booking
    const addBooking = (booking: any) => {
        const bookings = getBookings();
        // Generate a simple ID if not present
        if (!booking.id) {
            booking.id = Date.now().toString();
        }
        // Add timestamp if not present
        if (!booking.createdAt) {
            booking.createdAt = new Date().toISOString();
        }
        bookings.push(booking);
        saveBookings(bookings);
    };

    // Update booking status
    const updateBookingStatus = (id: string, status: string) => {
        const bookings = getBookings();
        const index = bookings.findIndex((b: any) => b.id === id);
        if (index !== -1) {
            bookings[index].status = status;
            saveBookings(bookings);
            return true;
        }
        return false;
    };

    // Get Today's bookings
    const getTodayBookings = () => {
        const bookings = getBookings();
        const today = new Date().toISOString().split('T')[0];
        return bookings.filter((b: any) => b.date === today);
    };

    return {
        getBookings,
        addBooking,
        updateBookingStatus,
        getTodayBookings
    };
};
