document.addEventListener("DOMContentLoaded", () => {
    // ==== Profile Switcher (TEST TOOL) ====
    // function initProfileSwitcher() {
    //     if (document.getElementById('admin-test-profile-switcher')) return;

    //     const switcher = document.createElement('div');
    //     switcher.id = 'admin-test-profile-switcher';
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

    //     function getUsers() {
    //         return JSON.parse(localStorage.getItem("bp_users") || "[]");
    //     }
    //     function saveUsers(users) {
    //         localStorage.setItem("bp_users", JSON.stringify(users));
    //     }

    //     document.getElementById('btn-switch-a').onclick = () => {
    //         const u = { firstName: 'User', lastName: 'A', phone: '0811111111', email: 'a@mail.com', password: 'Password1' };
    //         let users = getUsers();
    //         if (!users.find(x => x.email === u.email)) { users.push(u); saveUsers(users); }
    //         localStorage.removeItem('isAdminAuthenticated');
    //         localStorage.setItem("bp_currentUser", JSON.stringify(u));
    //         localStorage.setItem("isLoggedIn", "yes");
    //         localStorage.setItem("userName", u.firstName);
    //         window.location.href = '/index.html';
    //     };

    //     document.getElementById('btn-switch-b').onclick = () => {
    //         const u = { firstName: 'User', lastName: 'B', phone: '0822222222', email: 'b@mail.com', password: 'Password1' };
    //         let users = getUsers();
    //         if (!users.find(x => x.email === u.email)) { users.push(u); saveUsers(users); }
    //         localStorage.removeItem('isAdminAuthenticated');
    //         localStorage.setItem("bp_currentUser", JSON.stringify(u));
    //         localStorage.setItem("isLoggedIn", "yes");
    //         localStorage.setItem("userName", u.firstName);
    //         window.location.href = '/index.html';
    //     };

    //     document.getElementById('btn-switch-admin').onclick = () => {
    //         localStorage.removeItem("bp_currentUser");
    //         localStorage.removeItem("isLoggedIn");
    //         localStorage.removeItem("userName");
    //         localStorage.setItem("isAdminAuthenticated", "true");
    //         location.reload();
    //     };
    // }

    // initProfileSwitcher();

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // 1. Check Admin Auth
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
        window.location.href = '/index.html'; // Or admin login page if separated
        return;
    }

    // 2. Set Admin Name
    const name = localStorage.getItem('adminName') || 'AdminPhontud';
    const adminNameDisplay = document.getElementById('admin-name-display');
    if (adminNameDisplay) {
        adminNameDisplay.innerText = name;
    }

    // 3. Dropdown Logic
    const dropdownTrigger = document.getElementById('admin-dropdown-trigger');
    const dropdownMenu = document.getElementById('admin-dropdown-menu');

    if (dropdownTrigger && dropdownMenu) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (!dropdownTrigger.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // 4. Logout Logic
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("ต้องการออกจากระบบแอดมินใช่หรือไม่?")) {
                localStorage.removeItem('isAdminAuthenticated');
                window.location.href = '/index.html';
            }
        });
    }

    // 5. Active Link Highlight
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.admin-navbar .menu-icon');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // 6. Mobile Hamburger Menu for Admin
    const adminNavbar = document.querySelector('.admin-navbar');
    const adminMenuIcons = adminNavbar ? adminNavbar.querySelector('.menu-icons') : null;

    if (adminNavbar && adminMenuIcons && !adminNavbar.querySelector('.admin-mobile-right')) {
        const rightWrap = document.createElement('div');
        rightWrap.className = 'admin-mobile-right';

        // Hamburger button
        const hamburgerBtn = document.createElement('div');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
        rightWrap.appendChild(hamburgerBtn);

        adminNavbar.appendChild(rightWrap);

        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            adminMenuIcons.classList.toggle('active-mobile');
        });

        document.addEventListener('click', (event) => {
            const isHamburger = event.target.closest('.hamburger-btn');
            const isMenu = event.target.closest('.admin-navbar .menu-icons');

            // Close if clicking outside
            if (!isHamburger && !isMenu) {
                adminMenuIcons.classList.remove('active-mobile');
            }

            // Also close if clicking an actual link inside the menu (but not the dropdown toggle)
            if (isMenu && event.target.closest('.menu-icon') && !event.target.closest('#admin-dropdown-trigger')) {
                adminMenuIcons.classList.remove('active-mobile');
            }
        });
    }
});
