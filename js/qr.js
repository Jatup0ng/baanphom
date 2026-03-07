document.addEventListener("DOMContentLoaded", () => {
    // 1. Check Login
    const status = localStorage.getItem("isLoggedIn");
    const currentUser = JSON.parse(localStorage.getItem("bp_currentUser") || "null");
    if (status !== "yes" || !currentUser) {
        alert("⛔ กรุณาเข้าสู่ระบบ");
        window.location.href = "/index.html";
        return;
    }
    // Per-user history key
    const historyKey = 'bookingHistory_' + currentUser.email;

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

        // Generate QR code dynamically
        const qrImg = document.getElementById('dynamic-qr');
        const price = parseFloat(data.price) || 0;
        if (qrImg && price > 0) {

            const promptpayID = "0948104265";
            qrImg.src = `https://promptpay.io/${promptpayID}/${price}.png`;
        }
    }

    // Payment Logic
    nextBtn.addEventListener("click", () => {
        // Update UI
        qrStatus.innerText = " *ชำระเงินเสร็จสิ้น";
        qrStatus.className = "status-success";

        if (!data) return;

        data.id = Date.now().toString();
        data.status = 'รอตัด';
        data.name = localStorage.getItem('userName') || 'ลูกค้าทั่วไป';

        // Save to Admin (this calculates queueID and saves to master list)
        if (window.useBooking) {
            window.useBooking.addBooking(data);
        }

        // Update tempBooking with the newly assigned queueID
        localStorage.setItem('tempBooking', JSON.stringify(data));

        // Redirect
        setTimeout(() => {
            window.location.href = "/Queue/q.html";
        }, 1500);
    });
});
