document.addEventListener("DOMContentLoaded", () => {
    // 1. ตรวจสอบการเข้าสู่ระบบ
    const status = localStorage.getItem("isLoggedIn");
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้าการแจ้งเตือน");
        window.location.href = "/index.html";
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('bp_currentUser') || 'null');
    if (!currentUser) {
        window.location.href = "/index.html";
        return;
    }

    const listContainer = document.getElementById("notification-list");

    // ฟังก์ชันตรวจสอบว่าการแจ้งเตือนเป็นของผู้ใช้คนนี้หรือไม่
    function isMyNotification(notif) {
        // 1) เทียบด้วย email (วิธีที่แม่นยำที่สุด)
        if (currentUser.email && notif.targetEmail) {
            return notif.targetEmail.toLowerCase() === currentUser.email.toLowerCase();
        }
        // 2) fallback: เทียบด้วยชื่อเต็ม
        const userName = (currentUser.firstName + " " + currentUser.lastName).toLowerCase().trim();
        const target = (notif.targetUser || "").toLowerCase().trim();
        if (!target) return false;
        return target === userName || userName.includes(target) || target.includes(currentUser.firstName.toLowerCase().trim());
    }

    function loadNotifications() {
        const allNotifs = JSON.parse(localStorage.getItem('bp_notifications') || '[]');
        let userNotifs = allNotifs.filter(n => isMyNotification(n));

        // เรียงจากใหม่ไปเก่า
        userNotifs.sort((a, b) => b.timestamp - a.timestamp);

        renderNotifications(userNotifs);

        // อ่านแล้ว: mark as read หลังจาก 1 วินาที
        setTimeout(() => markAllAsRead(allNotifs), 1000);
    }

    function formatTime(timestamp) {
        const d = new Date(timestamp);
        const today = new Date();
        const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
        const pad = n => n.toString().padStart(2, '0');
        const timeStr = `${pad(d.getHours())}.${pad(d.getMinutes())} น.`;
        return isToday ? `วันนี้ ${timeStr}` : `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${timeStr}`;
    }

    function renderNotifications(notifs) {
        if (!listContainer) return;
        listContainer.innerHTML = '';

        if (notifs.length === 0) {
            listContainer.innerHTML = `<div class="notif-empty">ไม่มีข้อความแจ้งเตือน</div>`;
            return;
        }

        notifs.forEach(notif => {
            const item = document.createElement("div");
            item.className = `notif-item ${notif.read ? 'read' : 'unread'}`;
            const iconClass = notif.read ? 'fas fa-check-circle' : 'fas fa-bell';

            item.innerHTML = `
                <div class="notif-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="notif-content">
                    <div class="notif-title">${notif.title || 'การแจ้งเตือน'}</div>
                    <div class="notif-message">${(notif.message || '').replace(/\n/g, '<br>')}</div>
                </div>
                <div class="notif-time">${formatTime(notif.timestamp)}</div>
            `;
            listContainer.appendChild(item);
        });
    }

    function markAllAsRead(allNotifs) {
        let changed = false;
        allNotifs.forEach(n => {
            if (isMyNotification(n) && !n.read) {
                n.read = true;
                changed = true;
            }
        });
        if (changed) {
            localStorage.setItem('bp_notifications', JSON.stringify(allNotifs));
            window.dispatchEvent(new Event('notificationsUpdated'));
        }
    }

    loadNotifications();
});
