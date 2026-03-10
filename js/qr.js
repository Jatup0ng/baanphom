document.addEventListener("DOMContentLoaded", () => {
    // 1. Check Login
    const status = localStorage.getItem("isLoggedIn");
    const currentUser = JSON.parse(localStorage.getItem("bp_currentUser") || "null");
    if (status !== "yes" || !currentUser) {
        bpAlert.error("⛔ เข้าสู่ระบบ", "กรุณาเข้าสู่ระบบก่อนดำเนินการต่อครับ").then(() => {
            window.location.href = "/index.html";
        });
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
        if (!data) return;

        // จังหวะสุดทาดก่อนชำระเงิน: ตรวจสอบอีกครั้งว่าคิวยังว่างอยู่หรือไม่ (ป้องกันการจองซ้อน)
        if (window.useBooking) {
            const isAvailable = window.useBooking.isSlotAvailable(data.date, data.time, data.barber);
            if (!isAvailable) {
                bpAlert.error("❌ คิวไม่ว่าง", "ขออภัย คิวเวลานี้เพิ่งถูกจองไปเมื่อสักครู่ กรุณากลับไปเลือกเวลาใหม่น้าา").then(() => {
                    window.location.href = "/booking/book.html";
                });
                return;
            }
        }

        // แสดง Loading Popup ก่อน
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('active');

        // ซ่อน popup แล้วค่อยดำเนินการต่อ
        setTimeout(() => {
            // ซ่อน popup
            if (overlay) overlay.classList.remove('active');

            // หลัง popup หายแล้ว เปลี่ยนสถานะ
            setTimeout(() => {
                // Update UI
                qrStatus.innerText = " *ชำระเงินเสร็จสิ้น";
                qrStatus.className = "status-success";

                data.id = Date.now().toString();
                data.status = 'รอตัด';

                // นำชื่อและนามสกุลมาต่อกันเพื่อให้แอดมินเห็นชื่อเต็ม แต่ตอนล็อกอินยังใช้แค่ชื่อแรก
                if (currentUser) {
                    data.name = currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.firstName;
                    data.userEmail = currentUser.email || '';
                    data.phone = currentUser.phone || '';
                } else {
                    data.name = 'ลูกค้าทั่วไป';
                    data.userEmail = '';
                }

                // Save to Admin (this calculates queueID and saves to master list)
                if (window.useBooking) {
                    window.useBooking.addBooking(data);
                }

                // Update tempBooking with the newly assigned queueID
                localStorage.setItem('tempBooking', JSON.stringify(data));

                // Redirect
                setTimeout(() => {
                    window.location.href = "/Queue/q.html";
                }, 1000);
            }, 300);
        }, 1800);
    });
});
