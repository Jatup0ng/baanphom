document.addEventListener('DOMContentLoaded', function() {
    
    // --- PART 1: จัดการสลับหน้า (Dashboard <-> Queue) ---
    const btnDashboard = document.getElementById('btn-dashboard');
    const btnQueue = document.getElementById('btn-queue');
    const pageDashboard = document.getElementById('page-dashboard');
    const pageQueue = document.getElementById('page-queue');

    // คลิกปุ่ม "แดชบอร์ด"
    btnDashboard.addEventListener('click', function(e) {
        e.preventDefault();
        // เปลี่ยนสีปุ่ม active
        btnDashboard.classList.add('active');
        btnQueue.classList.remove('active');
        // แสดงหน้า Dashboard ซ่อนหน้า Queue
        pageDashboard.style.display = 'block';
        pageQueue.style.display = 'none';
    });

    // คลิกปุ่ม "จัดการคิว"
    btnQueue.addEventListener('click', function(e) {
        e.preventDefault();
        // เปลี่ยนสีปุ่ม active
        btnQueue.classList.add('active');
        btnDashboard.classList.remove('active');
        // แสดงหน้า Queue ซ่อนหน้า Dashboard
        pageQueue.style.display = 'block';
        pageDashboard.style.display = 'none';
    });

    // --- PART 2: จัดการ Dropdown มุมขวาบน ---
    const adminToggleBtn = document.getElementById('admin-toggle-btn');
    const adminDropdownMenu = document.getElementById('admin-dropdown-menu');

    // เมื่อคลิกที่ชื่อ Admin ให้สลับการแสดงเมนู
    adminToggleBtn.addEventListener('click', function(e) {
        // e.stopPropagation() เพื่อป้องกันไม่ให้ไป trig event คลิกที่ window ทันที
        e.stopPropagation(); 
        adminDropdownMenu.classList.toggle('show');
    });

    // เมื่อคลิกที่ส่วนอื่นของหน้าจอ ให้ปิดเมนู
    window.addEventListener('click', function(e) {
        // ตรวจสอบว่าสิ่งที่คลิก "ไม่ใช่" ปุ่ม และ "ไม่ใช่" ตัวเมนูเอง
        if (!adminToggleBtn.contains(e.target) && !adminDropdownMenu.contains(e.target)) {
            adminDropdownMenu.classList.remove('show');
        }
    });

});