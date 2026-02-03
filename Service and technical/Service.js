document.addEventListener('DOMContentLoaded', function() {

    // --- 1. จัดการการสลับหน้า (Menu Navigation) ---
    // สร้างรายการจับคู่ ID ของปุ่ม กับ ID ของหน้า
    const menus = [
        { btn: 'btn-dashboard', page: 'page-dashboard' },
        { btn: 'btn-queue',     page: 'page-queue' },
        { btn: 'btn-services',  page: 'page-services' }, // จุดสำคัญ: ต้องมีบรรทัดนี้
        { btn: 'btn-schedule',  page: 'page-schedule' }
    ];

    menus.forEach(menu => {
        const btnElement = document.getElementById(menu.btn);
        const pageElement = document.getElementById(menu.page);

        // ตรวจสอบว่ามีปุ่มจริงไหม ป้องกัน Error
        if (btnElement) {
            btnElement.addEventListener('click', function(e) {
                e.preventDefault(); // ป้องกันหน้าเว็บรีโหลด

                // 1. วนลูปปิดทุกหน้า และเอา class active ออกจากทุกปุ่ม
                menus.forEach(item => {
                    const b = document.getElementById(item.btn);
                    const p = document.getElementById(item.page);
                    if(b) b.classList.remove('active');
                    if(p) p.style.display = 'none';
                });

                // 2. แสดงหน้าเป้าหมาย และใส่ active ให้ปุ่มที่กด
                btnElement.classList.add('active');
                if (pageElement) {
                    pageElement.style.display = 'block';
                }
            });
        }
    });

    // --- 2. จัดการ Admin Dropdown ---
    const adminBtn = document.getElementById('admin-btn');
    const adminMenu = document.getElementById('admin-menu');

    if(adminBtn && adminMenu) {
        adminBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            adminMenu.classList.toggle('show');
        });

        window.addEventListener('click', (e) => {
            if (!adminBtn.contains(e.target) && !adminMenu.contains(e.target)) {
                adminMenu.classList.remove('show');
            }
        });
    }
});

// --- 3. ฟังก์ชัน Toggle สถานะ (เรียกใช้ผ่าน onclick ใน HTML) ---
function toggleStatus(btn, type = 'service') {
    const isOn = btn.classList.contains('status-on');

    if (isOn) {
        // เปลี่ยนเป็น ปิด
        btn.classList.remove('status-on');
        btn.classList.add('status-off');
        btn.innerText = (type === 'barber') ? 'ไม่พร้อม' : 'ปิด';
    } else {
        // เปลี่ยนเป็น เปิด
        btn.classList.remove('status-off');
        btn.classList.add('status-on');
        btn.innerText = (type === 'barber') ? 'พร้อม' : 'เปิด';
    }
}