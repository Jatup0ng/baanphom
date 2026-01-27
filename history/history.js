
    function toggleCard(btn) {
        // 1. หาตัวการ์ดแม่ (Parent) ของปุ่มที่ถูกกด
        // .closest() คือการสั่งให้หา Element พ่อที่ใกล้ที่สุดที่มี class นี้
        const card = btn.closest('.booking-card');
        
        // 2. สลับสถานะ (ถ้ามี active เอาออก, ถ้าไม่มี ให้ใส่)
        card.classList.toggle('active');

        // 3. เปลี่ยนไอคอน (ลูกเล่นเสริม)
        const icon = btn.querySelector('i');
        if (card.classList.contains('active')) {
            // ถ้าเปิดอยู่ -> เปลี่ยนเป็นรูปกากบาท (X)
            icon.classList.remove('fa-edit');
            icon.classList.add('fa-times');
        } else {
            // ถ้าปิดอยู่ -> เปลี่ยนกลับเป็นรูปดินสอ/แก้ไข
            icon.classList.remove('fa-times');
            icon.classList.add('fa-edit');
        }
    }


    function checkLoginStatus() {
    // แอบดูในเครื่องลูกค้าว่ามีตราปั๊ม isLoggedIn ไหม
    let status = localStorage.getItem("isLoggedIn");
    let name = localStorage.getItem("userName");

    if (status === "yes") {
        // ถ้ามี ให้เปลี่ยน Navbar เป็นโหมดสมาชิก
        updateNavToMember(name);
    } else {
        // ถ้าไม่มี ให้เป็นโหมดทั่วไป
        updateNavToGuest();
    }
}

// --- 2. ฟังก์ชันช่วยสลับหน้าตา Navbar (ใช้ภายในไฟล์นี้) ---
function updateNavToMember(name) {
    document.getElementById("guest-nav").style.display = "none";  // ซ่อนปุ่มเข้าสู่ระบบ
    document.getElementById("member-nav").style.display = "inline"; // โชว์ชื่อสมาชิก
    document.getElementById("user-name-display").innerText = "" + name; // แสดงชื่อสมาชิก
}