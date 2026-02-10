document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Menu Navigation ---
    const menus = [
        { btn: 'btn-dashboard', page: 'page-dashboard' },
        { btn: 'btn-queue',     page: 'page-queue' },
        { btn: 'btn-services',  page: 'page-services' },
        { btn: 'btn-schedule',  page: 'page-schedule' }
    ];

    menus.forEach(menu => {
        const btnElement = document.getElementById(menu.btn);
        const pageElement = document.getElementById(menu.page);

        if (btnElement) {
            btnElement.addEventListener('click', function(e) {
                e.preventDefault();
                // Reset Active
                menus.forEach(item => {
                    const b = document.getElementById(item.btn);
                    const p = document.getElementById(item.page);
                    if(b) b.classList.remove('active');
                    if(p) p.style.display = 'none';
                });
                // Set Active
                btnElement.classList.add('active');
                if (pageElement) pageElement.style.display = 'block';
            });
        }
    });

    // --- 2. Admin Dropdown ---
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

    // --- 3. LOGIC หน้าจัดตารางเวลา (ส่วนที่เพิ่มใหม่) ---
    const scheduleSelect = document.getElementById('schedule-barber-select');
    const scheduleWorkspace = document.getElementById('schedule-workspace');
    const scheduleHeaderText = document.getElementById('schedule-header-text');

    if (scheduleSelect) {
        scheduleSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            const selectedText = this.options[this.selectedIndex].text;

            if (selectedValue) {
                // ถ้ามีการเลือกช่าง ให้แสดงตาราง
                scheduleWorkspace.style.display = 'block';
                // (Optional) เปลี่ยนหัวข้อตารางตามชื่อช่างที่เลือก
                if(scheduleHeaderText) {
                    scheduleHeaderText.innerText = 'ตารางเวลา (' + selectedText + ')';
                }
            } else {
                scheduleWorkspace.style.display = 'none';
            }
        });
    }

});

// --- 4. Helper Functions ---
function toggleStatus(btn, type = 'service') {
    const isOn = btn.classList.contains('status-on');
    if (isOn) {
        btn.classList.remove('status-on');
        btn.classList.add('status-off');
        btn.innerText = (type === 'barber') ? 'ไม่พร้อม' : 'ปิด';
    } else {
        btn.classList.remove('status-off');
        btn.classList.add('status-on');
        btn.innerText = (type === 'barber') ? 'พร้อม' : 'เปิด';
    }
}