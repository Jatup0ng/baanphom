 // --- ส่วนที่ 1: ยามเฝ้าประตู (Gatekeeper) ---
// ต้องเช็กทันที! ก่อนที่จะทำอย่างอื่น
(function checkAccess() {
    let status = localStorage.getItem("isLoggedIn");

    // ถ้าไม่ได้ล็อกอิน (ค่าไม่ใช่ yes)
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบ");
        
        // ดีดกลับไปหน้าแรก (ถอยหลังออกไปหา index.html)
        window.location.href = "../index.html"; 
    }
})();
// --- pay.js ---

document.addEventListener('DOMContentLoaded', function() {
    loadBookingDetails();
});

function loadBookingDetails() {
    let bookingData = JSON.parse(localStorage.getItem('tempBooking'));
    if (bookingData) {
        // แสดงข้อมูลหน้าจ่ายเงิน
        if(document.getElementById('showService')) document.getElementById('showService').innerText = bookingData.service;
        if(document.getElementById('showPrice')) document.getElementById('showPrice').innerText = bookingData.price + " บาท";
        if(document.getElementById('showDuration')) document.getElementById('showDuration').innerText = bookingData.duration + " นาที";
        if(document.getElementById('showDateTime')) {
            let d = bookingData.date.split("-");
            document.getElementById('showDateTime').innerText = `${d[2]}/${d[1]}/${d[0]} เวลา ${bookingData.time} น.`;
        }
    }
}

function handlePayment() {
    // 1. เปลี่ยนสถานะปุ่ม (Effect เดิมของคุณ)
    const statusElement = document.getElementById('status-pending');
    if(statusElement) {
        statusElement.innerText = " *ชำระเงินเสร็จสิ้น";
        statusElement.classList.remove('status-pending');
        statusElement.classList.add('status-success');
    }

    // 2. ⭐ บันทึกข้อมูล (ระบบหลังบ้าน)
    saveToHistory();

    // 3. เปลี่ยนหน้า
    setTimeout(function() {
        window.location.href = "../Queue/q.html"; 
    }, 1500);
}

function saveToHistory() {
    let currentData = JSON.parse(localStorage.getItem('tempBooking'));
    if (!currentData) return;

    // สุ่มเลขคิว (ถ้ายังไม่มี)
    if (!currentData.queueID) {
        currentData.queueID = Math.floor(Math.random() * 20) + 1;
        // อัปเดตกลับลง tempBooking เพื่อให้หน้า q.html ใช้
        localStorage.setItem('tempBooking', JSON.stringify(currentData));
    }

    // บันทึกลงประวัติรวม (bookingHistory)
    let historyList = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    
    // สร้าง ID ไม่ซ้ำ
    currentData.historyID = Date.now();
    
    historyList.push(currentData);
    localStorage.setItem('bookingHistory', JSON.stringify(historyList));
}