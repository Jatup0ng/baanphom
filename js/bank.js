document.addEventListener("DOMContentLoaded", () => {
    // 1. Check Login
    const status = localStorage.getItem("isLoggedIn");
    const currentUser = JSON.parse(localStorage.getItem("bp_currentUser") || "null");
    if (status !== "yes" || !currentUser) {
        alert("⛔ กรุณาเข้าสู่ระบบ");
        window.location.href = "/index.html";
        return;
    }

    // DOM Elements
    const bankService = document.getElementById('bank-service');
    const bankDatetime = document.getElementById('bank-datetime');
    const bankDuration = document.getElementById('bank-duration');
    const bankPrice = document.getElementById('bank-price');
    const bankStatus = document.getElementById('bank-payment-status');
    const nextBtn = document.getElementById('next');
    const slipInput = document.getElementById('slip-file');
    const slipPreview = document.getElementById('slip-preview');
    const previewContainer = document.getElementById('preview-container');
    const uploadLabel = document.getElementById('upload-label');

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
        bankService.innerText = data.service || '-';
        bankDatetime.innerText = `${formatDate(data.date)} เวลา ${data.time} น.`;
        bankDuration.innerText = `${data.duration || '-'} นาที`;
        bankPrice.innerText = `${data.price || '-'} บาท`;
    }

    // Slip Preview Logic
    slipInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                slipPreview.src = e.target.result;
                previewContainer.style.display = 'block';
                uploadLabel.innerHTML = `<i class="fas fa-check"></i> เลือกภาพใหม่ (${file.name})`;
                uploadLabel.style.color = '#2ecc71';
                uploadLabel.style.borderColor = '#2ecc71';
            }
            reader.readAsDataURL(file);
        } else {
            previewContainer.style.display = 'none';
            uploadLabel.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> เลือกรูปภาพสลิป`;
            uploadLabel.style.color = '#8B5E3C';
            uploadLabel.style.borderColor = '#8B5E3C';
        }
    });

    // Payment Logic
    nextBtn.addEventListener("click", () => {
        if (!data) return;

        // 1. Validate Slip
        if (!slipInput.files || slipInput.files.length === 0) {
            alert("❌ กรุณาแนบสลิปการโอนเงินก่อนกดยืนยัน");
            return;
        }

        // 2. Check availability
        if (window.useBooking) {
            const isAvailable = window.useBooking.isSlotAvailable(data.date, data.time, data.barber);
            if (!isAvailable) {
                alert("❌ ขออภัย คิวเวลานี้เพิ่งถูกจองไปเมื่อสักครู่ กรุณากลับไปเลือกเวลาใหม่น้าา");
                window.location.href = "/booking/book.html";
                return;
            }
        }

        // 3. Show Loading
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('active');

        // 4. Process Confirmation
        setTimeout(() => {
            if (overlay) overlay.classList.remove('active');

            setTimeout(() => {
                bankStatus.innerText = " *ชำระเงินเสร็จสิ้น";
                bankStatus.className = "status-success";

                data.id = Date.now().toString();
                data.status = 'รอตัด';
                data.paymentMethod = 'โอนเงิน';

                if (currentUser) {
                    data.name = currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.firstName;
                    data.userEmail = currentUser.email || '';
                    data.phone = currentUser.phone || '';
                } else {
                    data.name = 'ลูกค้าทั่วไป';
                }

                if (window.useBooking) {
                    window.useBooking.addBooking(data);
                }

                localStorage.setItem('tempBooking', JSON.stringify(data));

                setTimeout(() => {
                    window.location.href = "/Queue/q.html";
                }, 1000);
            }, 300);
        }, 1800);
    });
});
