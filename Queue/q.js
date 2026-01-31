
// --- q.js ---

document.addEventListener('DOMContentLoaded', function() {
    let bookingData = JSON.parse(localStorage.getItem('tempBooking'));

    if (bookingData) {
        // 1. ดึงเลขคิว
        let qElement = document.getElementById('showQNumber');
        if (qElement) {
            // ถ้ามีเลขคิว ให้แสดง ถ้าไม่มีขีดแดช
            qElement.innerText = bookingData.queueID ? "Q-" + bookingData.queueID : "-";
        }

        // 2. ข้อมูลอื่น
        if(document.getElementById('showService')) document.getElementById('showService').innerText = bookingData.service;
        if(document.getElementById('showPrice')) document.getElementById('showPrice').innerText = bookingData.price + " บาท";
        if(document.getElementById('showDuration')) document.getElementById('showDuration').innerText = bookingData.duration + " นาที";
        if(document.getElementById('showDateTime')) {
            let d = bookingData.date.split("-");
            document.getElementById('showDateTime').innerText = `${d[2]}/${d[1]}/${d[0]} เวลา ${bookingData.time} น.`;
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // 1. เช็คของในกล่อง
    let bookingData = JSON.parse(localStorage.getItem('tempBooking'));

    if (!bookingData) {
        alert("❌ ไม่พบข้อมูลการจอง! (คุณอาจจะกดรีเฟรชหน้าคิวเล่นๆ ให้กลับไปจองใหม่)");
        return;
    }

    if (!bookingData.queueID) {
        alert("❌ ข้อมูลมาแล้ว แต่ไม่มีเลขคิว! (โค้ดหน้า Pay อาจจะยังไม่บันทึก)");
        return;
    }

    // 2. เช็คคนรับของ (สำคัญมาก!)
    let qElement = document.getElementById('showQNumber');
    
    if (!qElement) {
        alert("❌ หาที่วางเลขไม่เจอ! \nในไฟล์ q.html คุณลืมใส่ id='showQNumber' หรือเปล่า?");
    } else {
        // ถ้าเจอทุกอย่างครบ ใส่เลขเลย
        qElement.innerText = "Q-" + bookingData.queueID;
        // alert("✅ สำเร็จ! ใส่เลขคิวเรียบร้อย"); // (ถ้าขึ้นอันนี้แสดงว่าปกติ)
    }

    // 3. ใส่ข้อมูลอื่นๆ
    if(document.getElementById('showService')) document.getElementById('showService').innerText = bookingData.service;
    if(document.getElementById('showPrice')) document.getElementById('showPrice').innerText = bookingData.price + " บาท";
    if(document.getElementById('showDuration')) document.getElementById('showDuration').innerText = bookingData.duration + " นาที";
    if(document.getElementById('showDateTime')) {
        let d = bookingData.date.split("-");
        document.getElementById('showDateTime').innerText = `${d[2]}/${d[1]}/${d[0]} เวลา ${bookingData.time} น.`;
    }
});