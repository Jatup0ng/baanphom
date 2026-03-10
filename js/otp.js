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
        bpAlert.error("อีเมลไม่ถูกต้อง", "กรุณากรอกอีเมลก่อนกด รับรหัส OTP ครับผม");
        return;
    }

    if (otp !== FIXED_OTP) {
        bpAlert.error("รหัสไม่ถูกต้อง", "รหัส OTP ที่คุณกรอกไม่ถูกต้องครับผม (รหัสคือ " + FIXED_OTP + ")");
        return;
    }

    // Check email exists in users
    const users = (typeof getUsers === "function") ? getUsers() : JSON.parse(localStorage.getItem("bp_users") || "[]");
    const user = users.find(u => u.email === email);
    if (!user) {
        bpAlert.error("ไม่พบข้อมูล", "ไม่พบบัญชีที่ใช้อีเมลนี้ในระบบครับผม กรุณาตรวจสอบอีกครั้ง");
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
    if (!email.includes("@")) {
        bpAlert.error("รูปแบบไม่ถูกต้อง", "กรุณากรอกรูปแบบอีเมลให้ถูกต้องด้วยครับผม");
        return;
    }
    bpAlert.success("ส่ง OTP สำเร็จ", "ระบบได้ส่งรหัส OTP ไปที่อีเมล " + email + " เรียบร้อยแล้วครับผม\n(รหัส OTP: " + FIXED_OTP + ")");
}

function handleUpdatePassword() {
    const p1 = document.getElementById("new-password").value;
    const p2 = document.getElementById("confirm-new-password").value;

    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(p1)) {
        bpAlert.error("รหัสผ่านไม่ปลอดภัย", "รหัสผ่านต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้นครับผม");
        return;
    }
    if (p1.length < 8) {
        bpAlert.error("รหัสผ่านสั้นเกินไป", "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรครับผม");
        return;
    }
    if (!/[A-Z]/.test(p1)) {
        bpAlert.error("รหัสผ่านไม่ถูกต้อง", "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัวครับผม");
        return;
    }
    if (p1 !== p2) {
        bpAlert.error("รหัสผ่านไม่ตรงกัน", "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกันครับผม");
        return;
    }

    // Update password in users array
    const users = (typeof getUsers === "function") ? getUsers() : JSON.parse(localStorage.getItem("bp_users") || "[]");
    const idx = users.findIndex(u => u.email === _forgotEmail);
    if (idx === -1) {
        bpAlert.error("ผิดพลาด", "ไม่พบบัญชีนี้ในระบบครับผม");
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

    bpAlert.success("เปลี่ยนรหัสผ่านสำเร็จ", "กรุณาล็อกอินด้วยรหัสผ่านใหม่ได้ทันทีครับผม").then(() => {
        closeResetPassword();
        _forgotEmail = "";
        openLogin();
    });
}

// ---- Global Export ----
window.openForgotPassword = openForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.openResetPassword = openResetPassword;
window.closeResetPassword = closeResetPassword;
window.handleSendOTP = handleSendOTP;
window.handleUpdatePassword = handleUpdatePassword;