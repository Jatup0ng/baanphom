document.addEventListener("DOMContentLoaded", () => {
    // Check login
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "yes";
    const currentUser = JSON.parse(localStorage.getItem("bp_currentUser"));

    if (!isLoggedIn || !currentUser) {
        alert("กรุณาเข้าสู่ระบบก่อนดูการแจ้งเตือน");
        window.location.href = '/index.html';
        return;
    }

    const notifList = document.getElementById('notif-list');

    function formatTime(isoString) {
        const date = new Date(isoString);
        // Format to "วันนี้ HH.MM น." if it's today, otherwise "DD/MM/YYYY HH.MM น."
        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}.${minutes} น.`;

        if (isToday) {
            return `วันนี้ ${timeStr}`;
        } else {
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${timeStr}`;
        }
    }

    function renderNotifications() {
        const allNotifs = JSON.parse(localStorage.getItem('bp_notifications') || '[]');

        // Filter for current user by email (most reliable) or fallback to name
        const myNotifs = allNotifs.filter(n => {
            if (n.targetEmail && currentUser.email) {
                return n.targetEmail.toLowerCase() === currentUser.email.toLowerCase();
            }
            // Fallback to name match
            return n.targetUser && currentUser.firstName &&
                n.targetUser.toLowerCase().includes(currentUser.firstName.toLowerCase());
        });

        // Sort newest first
        myNotifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        notifList.innerHTML = '';

        if (myNotifs.length === 0) {
            notifList.innerHTML = `<div class="notif-empty">ไม่มีข้อความแจ้งเตือน</div>`;
            return;
        }

        myNotifs.forEach(n => {
            const isUnread = !n.read;
            const stateClass = isUnread ? 'unread' : 'read';
            const iconHtml = isUnread ? '<i class="far fa-clock"></i>' : '<i class="fas fa-check"></i>';

            const item = document.createElement('div');
            item.className = `notif-item ${stateClass}`;

            // Delete button for read notifications
            const deleteBtnHtml = n.read ? `<button class="notif-delete-btn" data-id="${n.id}"><i class="fas fa-trash"></i> ลบ</button>` : '';

            item.innerHTML = `
                <div class="notif-icon">${iconHtml}</div>
                <div class="notif-content">
                    <div class="notif-header">${n.title || 'การแจ้งเตือน'}</div>
                    <div class="notif-msg">${n.message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="notif-time">${formatTime(n.timestamp)}</div>
                ${deleteBtnHtml}
            `;

            // Click to mark as read
            if (isUnread) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    const updatedAll = allNotifs.map(notif => {
                        if (notif.id === n.id) {
                            notif.read = true;
                        }
                        return notif;
                    });
                    localStorage.setItem('bp_notifications', JSON.stringify(updatedAll));
                    window.dispatchEvent(new Event('notificationsUpdated'));
                    renderNotifications();
                });
            }

            notifList.appendChild(item);
        });

        // Bind delete buttons
        document.querySelectorAll('.notif-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent triggering other clicks
                const idToDelete = e.currentTarget.getAttribute('data-id');
                const updatedAll = allNotifs.filter(notif => notif.id !== idToDelete);
                localStorage.setItem('bp_notifications', JSON.stringify(updatedAll));
                window.dispatchEvent(new Event('notificationsUpdated'));
                renderNotifications();
            });
        });
    }

    renderNotifications();
});
