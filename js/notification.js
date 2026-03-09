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

    const ADMIN_SVG_ICON = `<svg width="26" height="26" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M48.125 2.91667H4.375C3.98823 2.91667 3.61729 3.07031 3.3438 3.3438C3.07031 3.61729 2.91667 3.98823 2.91667 4.375V48.125C2.91667 48.5118 3.07031 48.8827 3.3438 49.1562C3.61729 49.4297 3.98823 49.5833 4.375 49.5833H48.125C48.5118 49.5833 48.8827 49.4297 49.1562 49.1562C49.4297 48.8827 49.5833 48.5118 49.5833 48.125V4.375C49.5833 3.98823 49.4297 3.61729 49.1562 3.3438C48.8827 3.07031 48.5118 2.91667 48.125 2.91667ZM4.375 0C3.21468 0 2.10188 0.460936 1.28141 1.28141C0.460936 2.10188 0 3.21468 0 4.375V48.125C0 49.2853 0.460936 50.3981 1.28141 51.2186C2.10188 52.0391 3.21468 52.5 4.375 52.5H48.125C49.2853 52.5 50.3981 52.0391 51.2186 51.2186C52.0391 50.3981 52.5 49.2853 52.5 48.125V4.375C52.5 3.21468 52.0391 2.10188 51.2186 1.28141C50.3981 0.460936 49.2853 0 48.125 0H4.375Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.1298 15.0646C18.7338 15.4788 16.9881 17.5088 16.7023 19.9238L14.5833 37.9167H37.9167L35.7933 19.899C35.5104 17.4957 33.7808 15.47 31.3979 15.053C27.825 14.4273 24.8471 14.4215 21.1298 15.0646ZM22.9396 21.3617C22.9779 20.9828 22.8664 20.604 22.6291 20.3062C22.3918 20.0084 22.0474 19.8153 21.6695 19.768C21.2917 19.7208 20.9103 19.8233 20.607 20.0535C20.3037 20.2837 20.1024 20.6234 20.0463 21L18.7265 31.5555C18.6978 31.7477 18.7079 31.9438 18.7561 32.1322C18.8043 32.3205 18.8897 32.4973 19.0072 32.6522C19.1247 32.807 19.2721 32.9368 19.4405 33.0339C19.6089 33.1311 19.7951 33.1935 19.988 33.2176C20.1809 33.2417 20.3767 33.227 20.5638 33.1744C20.751 33.1217 20.9257 33.0322 21.0777 32.911C21.2298 32.7898 21.3561 32.6395 21.4491 32.4688C21.5422 32.2981 21.6003 32.1106 21.6198 31.9171L22.9396 21.3617Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.0246 17.6123C24.6694 18.0702 25.1781 18.6942 25.4965 19.4181C25.8149 20.142 25.9312 20.9387 25.8329 21.7234L24.5146 32.2788C24.3775 33.3725 23.8496 34.3205 23.0854 35H34.6354L32.8971 20.2402C32.7483 18.9715 31.8704 18.0965 30.8963 17.9259C28.4594 17.5 26.3608 17.3907 24.0246 17.6123ZM35.7933 19.899C35.5104 17.4957 33.7808 15.47 31.3979 15.053C27.825 14.4273 24.8471 14.4215 21.1298 15.0646C18.7338 15.4788 16.9881 17.5088 16.7023 19.9238L14.5833 37.9167H37.9167L35.7933 19.899ZM22.9396 21.3617L21.6198 31.9171C21.6003 32.1106 21.5422 32.2981 21.4491 32.4688C21.3561 32.6395 21.2298 32.7898 21.0777 32.911C20.9257 33.0322 20.751 33.1217 20.5638 33.1744C20.3767 33.227 20.1809 33.2417 19.988 33.2176C19.795 33.1935 19.6089 33.1311 19.4405 33.0339C19.272 32.9368 19.1247 32.807 19.0072 32.6522C18.8897 32.4973 18.8043 32.3205 18.7561 32.1322C18.7079 31.9438 18.6978 31.7477 18.7265 31.5555L20.0463 21C20.0658 20.8066 20.1238 20.619 20.2169 20.4484C20.31 20.2777 20.4363 20.1273 20.5883 20.0062C20.7403 19.885 20.9151 19.7955 21.1022 19.7428C21.2894 19.6901 21.4852 19.6754 21.6781 19.6996C21.871 19.7237 22.0571 19.7861 22.2256 19.8832C22.394 19.9803 22.5413 20.1101 22.6588 20.265C22.7764 20.4198 22.8618 20.5967 22.91 20.785C22.9582 20.9733 22.9683 21.1694 22.9396 21.3617ZM39.375 43.75H13.125V40.8334H39.375V43.75Z" fill="white"/>
<path d="M10.2083 26.25C10.2083 26.741 10.2302 27.2271 10.274 27.7084H5.83334V24.7917H10.274C10.2302 25.273 10.2083 25.7591 10.2083 26.25ZM13.1425 16.9984C12.5802 17.7942 12.0916 18.6397 11.6827 19.5242L7.84001 17.3046L9.29834 14.7788L13.1425 16.9984ZM19.5242 11.6813C18.6336 12.0955 17.7917 12.5825 16.9983 13.1425L14.7788 9.29837L17.3046 7.84004L19.5242 11.6813ZM26.25 10.2084C25.759 10.2084 25.2729 10.2302 24.7917 10.274V5.83337H27.7083V10.274C27.2235 10.23 26.7369 10.2081 26.25 10.2084ZM35.5017 13.1425C34.7058 12.5802 33.8604 12.0916 32.9758 11.6827L35.1954 7.84004L37.7213 9.29837L35.5017 13.1425ZM40.8188 19.5242C40.4094 18.6396 39.9203 17.7942 39.3575 16.9984L43.2017 14.7788L44.66 17.3046L40.8188 19.5242ZM42.2917 26.25C42.2917 25.7591 42.2698 25.273 42.2261 24.7917H46.6667V27.7084H42.2261C42.2698 27.2271 42.2917 26.741 42.2917 26.25Z" fill="white"/>
</svg>`;

    function renderNotifications() {
        const allNotifs = JSON.parse(localStorage.getItem('bp_notifications') || '[]');

        // Filter for current user by email (most reliable) or fallback to name
        const myNotifs = allNotifs.filter(n => {
            let isMine = false;
            if (n.targetEmail && currentUser.email) {
                isMine = (n.targetEmail.toLowerCase() === currentUser.email.toLowerCase());
            } else if (n.targetUser && currentUser.firstName) {
                isMine = n.targetUser.toLowerCase().includes(currentUser.firstName.toLowerCase());
            }
            return isMine;
        });

        // Sort newest first
        myNotifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        notifList.innerHTML = '';

        if (myNotifs.length === 0) {
            notifList.innerHTML = `<div class="notif-empty"> --- ไม่มีข้อความแจ้งเตือน ---</div>`;
            return;
        }

        myNotifs.forEach(n => {
            const isUnread = !n.read;
            const isAdmin = n.type === 'admin';
            const stateClass = isUnread ? 'unread' : 'read';
            const adminClass = isAdmin ? 'admin-notif' : '';

            // Icon
            let iconHtml;
            if (isAdmin) {
                iconHtml = ADMIN_SVG_ICON;
            } else {
                iconHtml = isUnread ? '<i class="far fa-clock"></i>' : '<i class="fas fa-check"></i>';
            }

            const item = document.createElement('div');
            item.className = `notif-item ${stateClass} ${adminClass}`.trim();

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
