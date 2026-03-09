// ==========================================
// BAAN PHOM — OTP & Forgot Password (otp.js)
// ==========================================

const FIXED_OTP = "676869";
let _forgotEmail = ""; // เก็บ email ที่ใช้ reset

// ---- Modal Open/Close ----

function openForgotPassword(e) {
    if (e) e.preventDefault();
    closeLogin();
    document.getElementById("forgotPasswordModal").style.display = "flex";
    // clear fields
    const emailEl = document.getElementById("forgot-email");
    const otpEl = document.getElementById("otp-input");
    if (emailEl) emailEl.value = "";
    if (otpEl) otpEl.value = "";
    _forgotEmail = "";
}

function closeForgotPassword() {
    document.getElementById("forgotPasswordModal").style.display = "none";
}

function openResetPassword() {
    const otp = document.getElementById("otp-input").value.trim();
    const email = document.getElementById("forgot-email").value.trim();

    if (!email.includes("@")) {
        alert("กรุณากรอกอีเมลก่อนกด รับรหัส OTP");
        return;
    }

    if (otp !== FIXED_OTP) {
        alert("รหัส OTP ไม่ถูกต้อง! (รหัสคือ " + FIXED_OTP + ")");
        return;
    }

    // Check email exists in users
    const users = (typeof getUsers === "function") ? getUsers() : JSON.parse(localStorage.getItem("bp_users") || "[]");
    const user = users.find(u => u.email === email);
    if (!user) {
        alert("ไม่พบบัญชีที่ใช้อีเมลนี้ กรุณาตรวจสอบอีกครั้ง");
        return;
    }

    _forgotEmail = email;
    closeForgotPassword();
    document.getElementById("resetPasswordModal").style.display = "flex";
    // clear new password fields
    const np = document.getElementById("new-password");
    const cp = document.getElementById("confirm-new-password");
    if (np) np.value = "";
    if (cp) cp.value = "";
}

function closeResetPassword() {
    document.getElementById("resetPasswordModal").style.display = "none";
}

function handleSendOTP() {
    const email = document.getElementById("forgot-email").value.trim();
    if (!email.includes("@")) {
        alert("กรุณากรอกรูปแบบอีเมลให้ถูกต้อง");
        return;
    }
    alert("ระบบได้ส่งรหัส OTP ไปที่อีเมล " + email + " แล้ว\n(รหัส OTP: " + FIXED_OTP + ")");
}

function handleUpdatePassword() {
    const p1 = document.getElementById("new-password").value;
    const p2 = document.getElementById("confirm-new-password").value;

    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(p1)) {
        alert("รหัสผ่านต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น");
        return;
    }
    if (p1.length < 8) {
        alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
        return;
    }
    if (!/[A-Z]/.test(p1)) {
        alert("รหัสผ่านต้องมีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว");
        return;
    }
    if (p1 !== p2) {
        alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
        return;
    }

    // Update password in users array
    const users = (typeof getUsers === "function") ? getUsers() : JSON.parse(localStorage.getItem("bp_users") || "[]");
    const idx = users.findIndex(u => u.email === _forgotEmail);
    if (idx === -1) {
        alert("ไม่พบบัญชีนี้ในระบบ");
        return;
    }

    users[idx].password = p1;
    const saveUsers = (typeof window.saveUsers === "function") ? window.saveUsers : (arr) => localStorage.setItem("bp_users", JSON.stringify(arr));
    saveUsers(users);

    // If this is the currently logged-in user, update session too
    const currentUserRaw = localStorage.getItem("bp_currentUser");
    if (currentUserRaw) {
        const current = JSON.parse(currentUserRaw);
        if (current.email === _forgotEmail) {
            current.password = p1;
            localStorage.setItem("bp_currentUser", JSON.stringify(current));
        }
    }

    alert("เปลี่ยนรหัสผ่านสำเร็จ! กรุณาล็อกอินด้วยรหัสผ่านใหม่");
    closeResetPassword();
    _forgotEmail = "";
    openLogin();
}

// ---- Global Export ----
window.openForgotPassword = openForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.openResetPassword = openResetPassword;
window.closeResetPassword = closeResetPassword;
window.handleSendOTP = handleSendOTP;
window.handleUpdatePassword = handleUpdatePassword;