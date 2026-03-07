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
    localStorage.setItem("userName", user.firstName);
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

// ---- Notifications ----
function updateNotificationBadge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;

    const user = getCurrentUser();
    if (!user) {
        badge.style.display = 'none';
        return;
    }

    const allNotifs = JSON.parse(localStorage.getItem('bp_notifications') || '[]');
    const unreadCount = allNotifs.filter(n => {
        const isMine = n.targetEmail
            ? (user.email && n.targetEmail.toLowerCase() === user.email.toLowerCase())
            : (n.targetUser && user.firstName && n.targetUser.toLowerCase().includes(user.firstName.toLowerCase()));
        return isMine && !n.read;
    }).length;

    if (unreadCount > 0) {
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// Ensure badge updates across tabs/events
window.addEventListener('storage', (e) => {
    if (e.key === 'bp_notifications') updateNotificationBadge();
});
window.addEventListener('notificationsUpdated', updateNotificationBadge);

function triggerNotification(targetEmail, targetUser, title, message) {
    const allNotifs = JSON.parse(localStorage.getItem('bp_notifications') || '[]');
    allNotifs.push({
        id: Date.now().toString(),
        targetEmail: targetEmail,
        targetUser: targetUser, // fallback
        title: title,
        message: message,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('bp_notifications', JSON.stringify(allNotifs));
    window.dispatchEvent(new Event('notificationsUpdated'));
}

function checkLoginStatus() {
    const user = getCurrentUser();

    // Notification Icon visibility
    const notifContainer = document.querySelector('.notif-icon-container');
    if (notifContainer) {
        notifContainer.style.display = user ? 'inline-block' : 'none';
    }

    if (user) {
        updateNavToMember(user.firstName);
        updateNotificationBadge();
    } else {
        updateNavToGuest();
    }
}

// // // ==== Profile Switcher (TEST TOOL) ====
// function initProfileSwitcher() {
//     // Only show if we aren't already admin/don't want to clutter prod, 
//     // but since it's a test tool requested by user, we inject it.
//     const switcher = document.createElement('div');
//     switcher.style.cssText = `
//         position: fixed;
//         bottom: 20px;
//         left: 20px;
//         background: rgba(0,0,0,0.8);
//         color: white;
//         padding: 10px;
//         border-radius: 8px;
//         z-index: 9999;
//         font-family: Arial, sans-serif;
//         font-size: 12px;
//         display: flex;
//         flex-direction: column;
//         gap: 5px;
//         box-shadow: 0 4px 6px rgba(0,0,0,0.3);
//     `;

//     switcher.innerHTML = `
//         <strong style="margin-bottom: 5px;">Profile Switcher</strong>
//         <button id="btn-switch-a" style="cursor:pointer; padding:5px; background:#4CAF50; color:white; border:none; border-radius:3px;">User A</button>
//         <button id="btn-switch-b" style="cursor:pointer; padding:5px; background:#2196F3; color:white; border:none; border-radius:3px;">User B</button>
//         <button id="btn-switch-admin" style="cursor:pointer; padding:5px; background:#E91E63; color:white; border:none; border-radius:3px;">Admin</button>
//     `;

//     document.body.appendChild(switcher);

//     document.getElementById('btn-switch-a').onclick = () => {
//         const u = { firstName: 'User', lastName: 'A', phone: '0811111111', email: 'a@mail.com', password: 'Password1' };
//         let users = getUsers();
//         if (!users.find(x => x.email === u.email)) { users.push(u); saveUsers(users); }
//         localStorage.removeItem('isAdminAuthenticated');
//         saveCurrentUser(u);
//         location.reload();
//     };

//     document.getElementById('btn-switch-b').onclick = () => {
//         const u = { firstName: 'User', lastName: 'B', phone: '0822222222', email: 'b@mail.com', password: 'Password1' };
//         let users = getUsers();
//         if (!users.find(x => x.email === u.email)) { users.push(u); saveUsers(users); }
//         localStorage.removeItem('isAdminAuthenticated');
//         saveCurrentUser(u);
//         location.reload();
//     };

//     document.getElementById('btn-switch-admin').onclick = () => {
//         clearSession();
//         localStorage.setItem("isAdminAuthenticated", "true");
//         window.location.href = "/admin/adminhome.html";
//     };
// }

//----------------------------------------------------------------------------------------------------------------------

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
    if (!firstName || !phone || !email || !password || !confirm) {
        alert("กรุณากรอกข้อมูลให้ครบ (ชื่อ, เบอร์โทร, อีเมล, รหัสผ่าน)");
        return;
    }
    if (!email.includes("@")) {
        alert("กรุณากรอกอีเมลให้ถูกต้อง");
        return;
    }
    // Password: English only, min 8 chars, at least 1 uppercase
    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password)) {
        alert("รหัสผ่านต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น");
        return;
    }
    if (password.length < 8) {
        alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
        return;
    }
    if (!/[A-Z]/.test(password)) {
        alert("รหัสผ่านต้องมีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว");
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
    updateNavToMember(firstName);
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
    updateNavToMember(user.firstName);
    checkLoginStatus(); // Update the bell icon and badge immediately
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
window.triggerNotification = triggerNotification;
window.updateNotificationBadge = updateNotificationBadge;

// ---- DOM Ready ----
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();

    // --- Setup Mobile Navbar Dynamically ---
    const navbar = document.querySelector('.navbar');
    const menuIcons = document.querySelector('.menu-icons');
    let notifIcon = document.querySelector('.notif-icon-container');

    if (navbar && menuIcons && !document.querySelector('.mobile-nav-right')) {
        const rightWrap = document.createElement('div');
        rightWrap.className = 'mobile-nav-right';

        // Move the existing notification bell to the rightWrap
        if (notifIcon) {
            rightWrap.appendChild(notifIcon);
        }

        // Create the Hamburger Button
        const hamburgerBtn = document.createElement('div');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';

        rightWrap.appendChild(hamburgerBtn);

        // Append at the END of navbar (right side)
        navbar.appendChild(rightWrap);

        // Event Listeners for hamburger toggle
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuIcons.classList.toggle('active-mobile');
        });
    }

    initProfileSwitcher();

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

        // Close mobile dropdown if clicking outside
        const mobileMenuIcons = document.querySelector('.menu-icons');
        const isHamburger = event.target.closest('.hamburger-btn');
        const isMenuIcons = event.target.closest('.menu-icons');
        if (mobileMenuIcons && mobileMenuIcons.classList.contains('active-mobile') && !isHamburger && !isMenuIcons) {
            mobileMenuIcons.classList.remove('active-mobile');
            const overlay = document.querySelector('.mobile-nav-overlay');
            if (overlay) overlay.classList.remove('active');
        }
    };
});
