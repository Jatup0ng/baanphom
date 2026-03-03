// --- 7. ระบบลืมรหัสผ่าน (Forgot Password) ---

function openForgotPassword() {
    document.getElementById("forgotPasswordModal").style.display = "flex";
}

function closeForgotPassword() {
    document.getElementById("forgotPasswordModal").style.display = "none";
}

function openResetPassword() {
    let otp = document.getElementById("otp-input").value;
    if(otp.length === 6) { // ตรวจสอบเบื้องต้นว่ากรอกครบ 6 หลัก
        closeForgotPassword();
        document.getElementById("resetPasswordModal").style.display = "flex";
    } else {
        alert("กรุณากรอกรหัส OTP 6 หลักให้ถูกต้อง");
    }
}

function closeResetPassword() {
    document.getElementById("resetPasswordModal").style.display = "none";
}

function handleSendOTP() {
    let email = document.getElementById("forgot-email").value;
    if(email.includes("@")) {
        alert("ระบบได้ส่งรหัส OTP ไปที่อีเมล " + email + " แล้ว");
    } else {
        alert("กรุณากรอกรูปแบบอีเมลให้ถูกต้อง");
    }
}

function handleUpdatePassword() {
    let p1 = document.getElementById("new-password").value;
    let p2 = document.getElementById("confirm-new-password").value;

    if(p1 === p2 && p1.length >= 8) {
        alert("เปลี่ยนรหัสผ่านสำเร็จ! กรุณาล็อกอินด้วยรหัสผ่านใหม่");
        closeResetPassword();
        openLogin();
    } else {
        alert("รหัสผ่านไม่ตรงกัน หรือสั้นกว่า 8 ตัวอักษร");
    }
}
// --- 5. ระบบ Forgot Password & OTP (กำหนดรหัสฟิก 123456) ---
const FIXED_OTP = "676869"; 

function handleSendOTP() {
    let email = document.getElementById("forgot-email").value;
    if(email.includes("@")) {
        alert("ระบบได้ส่งรหัส OTP ไปที่อีเมล " + email + " แล้ว\n(รหัสOTP: " + FIXED_OTP + ")");
    } else {
        alert("กรุณากรอกรูปแบบอีเมลให้ถูกต้อง");
    }
}

function openResetPassword() {
    let otp = document.getElementById("otp-input").value;
    if(otp === FIXED_OTP) { // ตรวจสอบกับรหัสที่ฟิกไว้
        closeForgotPassword();
        document.getElementById("resetPasswordModal").style.display = "flex";
    } else {
        alert("รหัส OTP ไม่ถูกต้อง! (รหัสคือ " + FIXED_OTP + ")");
    }
}

function handleUpdatePassword() {
    let p1 = document.getElementById("new-password").value;
    let p2 = document.getElementById("confirm-new-password").value;

    if(p1 === p2 && p1.length >= 8) {
        alert("เปลี่ยนรหัสผ่านสำเร็จ! กรุณาล็อกอินด้วยรหัสผ่านใหม่");
        closeResetPassword();
        openLogin();
    } else {
        alert("รหัสผ่านไม่ตรงกัน หรือสั้นกว่า 8 ตัวอักษร");
    }
}


// --- 6. รวมตัวดักจับการคลิก (Window Click) ไว้ที่เดียว (แก้ปัญหาคำสั่งตีกัน) ---
window.onclick = function(event) {
    let loginModal = document.getElementById("loginModal");
    let registerModal = document.getElementById("registerModal");
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let forgotModal = document.getElementById("forgotPasswordModal");

    // 1. คลิกพื้นหลังเพื่อปิด Login
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
    
    // 2. คลิกพื้นหลังเพื่อปิด Register
    if (event.target == registerModal) {
        registerModal.style.display = "none";
    }

    // 3. คลิกที่อื่นเพื่อปิด Dropdown เมนู
    if (!event.target.closest('.menu-icon')) {
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }

}