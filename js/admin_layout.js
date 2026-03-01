document.addEventListener("DOMContentLoaded", () => {
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
});
