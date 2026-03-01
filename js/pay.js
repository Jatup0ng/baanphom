document.addEventListener("DOMContentLoaded", () => {
    // 1. Check Login
    const status = localStorage.getItem("isLoggedIn");
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบ");
        window.location.href = "/index.html";
        return;
    }

    // 2. Load Booking Details
    const stored = localStorage.getItem('tempBooking');
    if (stored) {
        const data = JSON.parse(stored);

        function formatDate(dateStr) {
            if (!dateStr) return '-';
            const d = dateStr.split("-");
            if (d.length !== 3) return dateStr;
            return `${d[2]}/${d[1]}/${d[0]}`;
        }

        document.getElementById('pay-service').innerText = data.service || '-';
        document.getElementById('pay-datetime').innerText = `${formatDate(data.date)} เวลา ${data.time} น.`;
        document.getElementById('pay-duration').innerText = `${data.duration || '-'} นาที`;
        document.getElementById('pay-price').innerText = `${data.price || '-'} บาท`;
    }
});
