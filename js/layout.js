// ==========================================
// BAAN PHOM — Auth & Navbar Logic (layout.js)
// ==========================================

// ---- Helpers ----

function getUsers() {
    return JSON.parse(localStorage.getItem("bp_users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("bp_users", JSON.stringify(users));
}

function getCurrentUser() {
    const raw = localStorage.getItem("bp_currentUser");
    return raw ? JSON.parse(raw) : null;
}

function saveCurrentUser(user) {
    localStorage.setItem("bp_currentUser", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "yes");
    localStorage.setItem("userName", user.firstName + " " + user.lastName);
}

function clearSession() {
    localStorage.removeItem("bp_currentUser");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
}

// ---- Modal Open/Close ----

function openLogin(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById("loginModal");
    if (modal) {
        modal.style.display = "flex";
        // Clear previous inputs
        const u = document.getElementById("username-input");
        const p = document.getElementById("password-input");
        if (u) u.value = "";
        if (p) p.value = "";
    }
}

function closeLogin(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
}

function openRegister(e) {
    if (e) e.preventDefault();
    closeLogin();
    const modal = document.getElementById("registerModal");
    if (modal) modal.style.display = "flex";
}

function closeRegister(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById("registerModal");
    if (modal) modal.style.display = "none";
}

// ---- Navbar Update ----

function updateNavToMember(name) {
    const guestNav = document.getElementById("guest-nav");
    const memberNav = document.getElementById("member-nav");
    const nameDisplay = document.getElementById("user-name-display");

    if (guestNav) guestNav.style.display = "none";
    if (memberNav) memberNav.style.display = "inline-block";
    if (nameDisplay) nameDisplay.innerText = name;
}

function updateNavToGuest() {
    const guestNav = document.getElementById("guest-nav");
    const memberNav = document.getElementById("member-nav");

    if (guestNav) guestNav.style.display = "inline";
    if (memberNav) memberNav.style.display = "none";
}

function checkLoginStatus() {
    const user = getCurrentUser();

    // Check notifications regardless of login status first to define the function scope, 
    // but only actually show it if logged in.
    updateNotificationBadge();

    if (user) {
        updateNavToMember(user.firstName + " " + user.lastName);
        const notifNav = document.getElementById("notification-nav");
        if (notifNav) notifNav.style.display = "inline-block";
    } else {
        updateNavToGuest();
        const notifNav = document.getElementById("notification-nav");
        if (notifNav) notifNav.style.display = "none";
    }
}

function updateNotificationBadge() {
    const badge = document.getElementById("notif-badge");
    if (!badge) return;

    const user = getCurrentUser();
    if (!user) {
        badge.style.display = "none";
        return;
    }

    const allNotifs = JSON.parse(localStorage.getItem('bp_notifications') || '[]');
    const userName = (user.firstName + " " + user.lastName).toLowerCase().trim();

    const hasUnread = allNotifs.some(n => {
        if (n.read) return false;
        // 1) Match by email (most reliable)
        if (user.email && n.targetEmail) {
            return n.targetEmail.toLowerCase() === user.email.toLowerCase();
        }
        // 2) Fallback: match by name
        const target = (n.targetUser || '').toLowerCase().trim();
        if (!target) return false;
        return target === userName || userName.includes(target) || target.includes(user.firstName.toLowerCase().trim());
    });

    if (hasUnread) {
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
}

// Listen for updates from other scripts
window.addEventListener('notificationsUpdated', updateNotificationBadge);

// ---- Register ----

function performRegister() {
    const firstNameEl = document.getElementById("reg-firstname");
    const lastNameEl = document.getElementById("reg-lastname");
    const phoneEl = document.getElementById("reg-phone");
    const emailEl = document.getElementById("reg-email");
    const passwordEl = document.getElementById("reg-password");
    const confirmEl = document.getElementById("reg-confirm-password");

    if (!firstNameEl) return;

    const firstName = firstNameEl.value.trim();
    const lastName = lastNameEl.value.trim();
    const phone = phoneEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value;
    const confirm = confirmEl.value;

    // Validation
    if (!firstName || !lastName || !phone || !email || !password || !confirm) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
    }
    if (!email.includes("@")) {
        alert("กรุณากรอกอีเมลให้ถูกต้อง");
        return;
    }
    if (password.length < 8) {
        alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
        return;
    }
    if (password !== confirm) {
        alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
        return;
    }

    const users = getUsers();
    const duplicate = users.find(u => u.email === email || u.phone === phone);
    if (duplicate) {
        alert("อีเมลหรือเบอร์โทรนี้ถูกใช้งานแล้ว กรุณาตรวจสอบ");
        return;
    }

    const newUser = { firstName, lastName, phone, email, password };
    users.push(newUser);
    saveUsers(users);

    // Auto login after register
    saveCurrentUser(newUser);
    closeRegister();
    updateNavToMember(firstName + " " + lastName);
    alert("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ " + firstName + " 🎉");
}

// ---- Login ----

function performLogin() {
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");

    if (!usernameInput) return;

    const inputUsername = usernameInput.value.trim();
    const inputPassword = passwordInput.value;

    // Admin Login
    if (inputUsername === "admin" && inputPassword === "12345678") {
        localStorage.setItem("isAdminAuthenticated", "true");
        window.location.href = "/admin/adminhome.html";
        return;
    }

    if (!inputUsername || !inputPassword) {
        alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
        return;
    }

    const users = getUsers();
    // Match by email OR firstName (flexible search)
    const user = users.find(u =>
        (u.email === inputUsername || u.firstName === inputUsername || (u.firstName + " " + u.lastName) === inputUsername)
        && u.password === inputPassword
    );

    if (!user) {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        return;
    }

    saveCurrentUser(user);
    closeLogin();
    updateNavToMember(user.firstName + " " + user.lastName);
}

// ---- Dropdown ----

function toggleDropdown(e) {
    if (e) e.preventDefault();
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) dropdown.classList.toggle("show");
}

// ---- Logout ----

function logout(e) {
    if (e) e.preventDefault();
    if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
        clearSession();
        window.location.href = "/index.html";
    }
}

// ---- Global Export ----
window.openLogin = openLogin;
window.closeLogin = closeLogin;
window.openRegister = openRegister;
window.closeRegister = closeRegister;
window.performLogin = performLogin;
window.performRegister = performRegister;
window.toggleDropdown = toggleDropdown;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getUsers = getUsers;
window.saveUsers = saveUsers;
window.saveCurrentUser = saveCurrentUser;
window.updateNotificationBadge = updateNotificationBadge;
window.triggerNotification = function (targetUser, title, message) {
    const allNotifs = JSON.parse(localStorage.getItem('bp_notifications') || '[]');
    allNotifs.push({
        id: Date.now().toString(),
        targetUser: targetUser,
        title: title,
        message: message,
        timestamp: Date.now(),
        read: false
    });
    localStorage.setItem('bp_notifications', JSON.stringify(allNotifs));
    window.dispatchEvent(new Event('notificationsUpdated'));
};

// ---- DOM Ready ----
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();

    window.onclick = function (event) {
        const loginModal = document.getElementById("loginModal");
        const registerModal = document.getElementById("registerModal");
        const forgotModal = document.getElementById("forgotPasswordModal");
        const resetModal = document.getElementById("resetPasswordModal");
        const dropdowns = document.getElementsByClassName("dropdown-content");

        if (loginModal && event.target === loginModal) loginModal.style.display = "none";
        if (registerModal && event.target === registerModal) registerModal.style.display = "none";
        if (forgotModal && event.target === forgotModal) forgotModal.style.display = "none";
        if (resetModal && event.target === resetModal) resetModal.style.display = "none";

        if (!event.target.closest('.menu-icon')) {
            for (let i = 0; i < dropdowns.length; i++) {
                if (dropdowns[i].classList.contains('show')) {
                    dropdowns[i].classList.remove('show');
                }
            }
        }
    };
});
