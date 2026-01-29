
    // --- ส่วนที่ 1: ยามเฝ้าประตู (Gatekeeper) ---
// ต้องเช็กทันที! ก่อนที่จะทำอย่างอื่น
(function checkAccess() {
    let status = localStorage.getItem("isLoggedIn");

    // ถ้าไม่ได้ล็อกอิน (ค่าไม่ใช่ yes)
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าจองคิว");
        
        // ดีดกลับไปหน้าแรก (ถอยหลังออกไปหา index.html)
        window.location.href = "../index.html"; 
    }
})();
function saveAndGoNext() {
    // 1. ดึงค่าจากช่องที่ลูกค้ากรอก (เช็คชื่อ id ให้ตรงกับข้อ 1)
    let service = document.getElementById("inputService").value;
    let date = document.getElementById("inputDate").value;
    let time = document.getElementById("inputTime").value;

    // 2. ดักทาง: ถ้าลูกค้าลืมกรอก ห้ามให้ไปต่อ
    if(date === "" || time === "" ) {
        alert("กรุณาเลือกวันและเวลาให้ครบถ้วน");
        return; // หยุดทำงาน ไม่ไปบรรทัดต่อ
    }

    // 3. (เสริม) คำนวณราคาอัตโนมัติ (Mock up logic)
    // ตรงนี้เราเขียนหลอกๆ ไปก่อน เพื่อให้หน้าสรุปมีเลขโชว์
    let price = "150"; 
    let duration = "60"; 

    if(service.includes("ตัด สระ ไดร์")) {
        price = "150"; // ถ้าเลือกสระ ให้แพงขึ้น
        duration = "60";
    }

    // 4. แพ็คของใส่กล่อง
    let bookingData = {
        service: service,
        date: date,
        time: time,
        price: price,
        duration: duration
    };

    // 5. บันทึกลง localStorage (ชื่อกุญแจต้องตรงกับหน้าสรุปนะ!)
    localStorage.setItem("tempBooking", JSON.stringify(bookingData));

    // 6. เปลี่ยนหน้าไปหน้าสรุป (แก้ชื่อไฟล์ให้ตรงกับของคุณ)
    window.location.href = "../payment/pay.html"; 
}

function updatePrice() {
    // 1. ดึงค่าจากช่องเลือกบริการ
    let service = document.getElementById("inputService").value;
    
    // 2. เตรียมช่องแสดงราคา
    let priceField = document.getElementById("priceInput");

    // 3. เช็คว่าเลือกบริการอะไร แล้วกำหนดราคา
    if (service === "ตัด สระ ไดร์") {
        priceField.value = "150 บาท";
    } else if (service === "ตัดผมชาย") {
        priceField.value = "100 บาท";
    } else {
        // กรณีเลือกกลับไปเป็น "เลือกบริการ" (ค่าว่าง)
        priceField.value = ""; 
    }
}