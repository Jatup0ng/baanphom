document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const showQNumber = document.getElementById("showQNumber");
    const qService = document.getElementById("q-service");
    const qDatetime = document.getElementById("q-datetime");
    const qDuration = document.getElementById("q-duration");
    const qPrice = document.getElementById("q-price");

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = dateStr.split("-");
        if (d.length !== 3) return dateStr;
        return `${d[2]}/${d[1]}/${d[0]}`;
    }

    const stored = localStorage.getItem('tempBooking');

    if (!stored) {
        bpAlert.error("ไม่พบข้อมูล", "ไม่พบข้อมูลการจอง! กรุณาลองจองใหม่อีกครั้งครับผม").then(() => {
            window.location.href = "/index.html";
        });
        return;
    }

    const data = JSON.parse(stored);

    if (!data.queueID) {
        bpAlert.error("เกิดข้อผิดพลาด", "ระบบไม่สามารถดึงเลขคิวได้ กรุณาติดต่อแอดมินหรือลองใหม่อีกครั้งครับผม");
        return;
    }

    // Populate data
    showQNumber.innerText = "Q-" + data.queueID;
    qService.innerText = data.service || '-';
    qDatetime.innerText = `${formatDate(data.date)} เวลา ${data.time} น.`;
    qDuration.innerText = `${data.duration || '-'} นาที`;
    qPrice.innerText = `${data.price || '-'} บาท`;
});
