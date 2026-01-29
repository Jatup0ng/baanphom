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
// รันฟังก์ชันนี้ทันทีที่เปิดหน้านี้ขึ้นมา
document.addEventListener('DOMContentLoaded', function() {
    loadBookingDetails();
});

function loadBookingDetails() {
    // 1. ดึงข้อมูลที่ลูกค้าเลือกมาจากหน้าก่อนหน้า (localStorage)
    // สมมติว่าหน้าก่อนหน้าบันทึกไว้ชื่อ 'tempBooking'
    let bookingData = JSON.parse(localStorage.getItem('tempBooking'));

    if (bookingData) {
        // 2. เอาข้อมูลไปหยอดใส่ HTML ตาม ID ที่เราสร้างไว้
        document.getElementById('showService').innerText = bookingData.service;
        
        // จัดรูปแบบวันเวลาให้สวยงาม
        let dateParts = bookingData.date.split("-");
        let thDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        document.getElementById('showDateTime').innerText = `${thDate} เวลา ${bookingData.time} น.`;
        
        // ใส่ระยะเวลาและราคา
        document.getElementById('showDuration').innerText = bookingData.duration + " นาที";
        document.getElementById('showPrice').innerText = bookingData.price + " บาท";
    } else {
        // กรณีไม่มีข้อมูล (เช่น เปิดหน้านี้ขึ้นมาลอยๆ)
        alert("ไม่พบข้อมูลการจอง กรุณาเลือกบริการก่อน");
        window.location.href = "../booking/book.html"; // ดีดกลับไปหน้าจอง
    }
}

// ฟังก์ชันสำหรับปุ่มดินสอ (ย้อนกลับไปแก้ไข)
function goBackToEdit() {
    window.location.href = "../booking/book.html"; // หรือหน้าก่อนหน้านี้
}
