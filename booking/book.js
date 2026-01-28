
    // --- ส่วนที่ 1: ยามเฝ้าประตู (Gatekeeper) ---
// ต้องเช็กทันที! ก่อนที่จะทำอย่างอื่น
(function checkAccess() {
    let status = localStorage.getItem("isLoggedIn");

    // ถ้าไม่ได้ล็อกอิน (ค่าไม่ใช่ yes)
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าจองคิว");
        
        // ดีดกลับไปหน้าแรก (ถอยหลังออกไปหา index.html)
        window.location.href = "../index.html"; 
    }
})();