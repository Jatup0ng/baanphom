document.addEventListener('DOMContentLoaded', function() {

    // --- 1. จัดการการสลับหน้า (Dashboard <-> Queue) ---
    const btnDashboard = document.getElementById('btn-dashboard');
    const btnQueue = document.getElementById('btn-queue');
    const pageDashboard = document.getElementById('page-dashboard');
    const pageQueue = document.getElementById('page-queue');

    function switchPage(pageName) {
        if (pageName === 'dashboard') {
            // แสดง Dashboard
            pageDashboard.style.display = 'block';
            pageQueue.style.display = 'none';
            // ปรับปุ่ม Active
            btnDashboard.classList.add('active');
            btnQueue.classList.remove('active');
        } else if (pageName === 'queue') {
            // แสดง Queue
            pageQueue.style.display = 'block';
            pageDashboard.style.display = 'none';
            // ปรับปุ่ม Active
            btnQueue.classList.add('active');
            btnDashboard.classList.remove('active');
        }
    }

    // Event Listeners ปุ่มเมนู
    btnDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        switchPage('dashboard');
    });

    btnQueue.addEventListener('click', (e) => {
        e.preventDefault();
        switchPage('queue');
    });

    // --- 2. จัดการ Admin Dropdown ---
    const adminBtn = document.getElementById('admin-btn');
    const adminMenu = document.getElementById('admin-menu');

    adminBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // กันไม่ให้ event ทะลุไปปิดเมนูทันที
        adminMenu.classList.toggle('show');
    });

    // คลิกที่อื่นเพื่อปิด Dropdown
    window.addEventListener('click', (e) => {
        if (!adminBtn.contains(e.target) && !adminMenu.contains(e.target)) {
            adminMenu.classList.remove('show');
        }
    });

});