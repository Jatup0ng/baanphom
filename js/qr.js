document.addEventListener("DOMContentLoaded", () => {
    // 1. Check Login
    const status = localStorage.getItem("isLoggedIn");
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบ");
        window.location.href = "/index.html";
        return;
    }

    // DOM Elements
    const qrService = document.getElementById('qr-service');
    const qrDatetime = document.getElementById('qr-datetime');
    const qrDuration = document.getElementById('qr-duration');
    const qrPrice = document.getElementById('qr-price');
    const qrAmount = document.getElementById('qr-amount');
    const qrStatus = document.getElementById('qr-payment-status');
    const nextBtn = document.getElementById('next');

    // Load Data
    const stored = localStorage.getItem('tempBooking');
    let data;

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = dateStr.split("-");
        if (d.length !== 3) return dateStr;
        return `${d[2]}/${d[1]}/${d[0]}`;
    }

    if (stored) {
        data = JSON.parse(stored);
        qrService.innerText = data.service || '-';
        qrDatetime.innerText = `${formatDate(data.date)} เวลา ${data.time} น.`;
        qrDuration.innerText = `${data.duration || '-'} นาที`;
        qrPrice.innerText = `${data.price || '-'} บาท`;
        qrAmount.innerText = `${data.price || '-'} บาท`;
    }

    // Payment Logic
    nextBtn.addEventListener("click", () => {
        // Update UI
        qrStatus.innerText = " *ชำระเงินเสร็จสิ้น";
        qrStatus.className = "status-success";

        if (!data) return;

        // Generate Queue ID
        if (!data.queueID) {
            let nextQ = 1;
            if (window.useBooking) {
                const dayBookings = window.useBooking.getBookings().filter(b => b.date === data.date);
                if (dayBookings.length > 0) {
                    const maxQ = Math.max(...dayBookings.map(b => parseInt(b.queueID) || 0));
                    nextQ = maxQ + 1;
                }
            }
            data.queueID = nextQ;
            localStorage.setItem('tempBooking', JSON.stringify(data));
        }

        // Save History
        let historyList = JSON.parse(localStorage.getItem('bookingHistory')) || [];
        data.id = Date.now().toString();
        data.status = 'รอตัด';
        data.name = localStorage.getItem('userName') || 'ลูกค้าทั่วไป';

        historyList.push(data);
        localStorage.setItem('bookingHistory', JSON.stringify(historyList));

        // Save to Admin
        if (window.useBooking) {
            window.useBooking.addBooking(data);
        }

        // Redirect
        setTimeout(() => {
            window.location.href = "/Queue/q.html";
        }, 1500);
    });
});
