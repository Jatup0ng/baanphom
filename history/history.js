
    // --- ส่วนที่ 1: ยามเฝ้าประตู (Gatekeeper) ---
// ต้องเช็กทันที! ก่อนที่จะทำอย่างอื่น
(function checkAccess() {
    let status = localStorage.getItem("isLoggedIn");

    // ถ้าไม่ได้ล็อกอิน (ค่าไม่ใช่ yes)
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้าประวัติ");
        
        // ดีดกลับไปหน้าแรก (ถอยหลังออกไปหา index.html)
        window.location.href = "../index.html"; 
    }
})();


// --- history.js ---

document.addEventListener("DOMContentLoaded", function() {
    // 1. เช็ค Login
    let status = localStorage.getItem("isLoggedIn");
    if (status !== "yes") { window.location.href = "../index.html"; } // เปิดใช้เมื่อพร้อม

    // 2. โหลดประวัติ
    renderHistoryCards();
});

function renderHistoryCards() {
    // ดึงข้อมูลประวัติ
    let historyList = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    let container = document.getElementById('history-box'); // จุดวางการ์ด

    if (!container) return;

    // เคลียร์ของเก่า
    container.innerHTML = "";

    if (historyList.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#999;'>ยังไม่มีประวัติการจอง</p>";
        return;
    }

    // วนลูปสร้างการ์ด (เรียงจากใหม่ -> เก่า)
    historyList.slice().reverse().forEach(item => {
        // จัดรูปแบบวันที่
        let d = item.date.split("-");
        let showDate = `${d[2]}/${d[1]}/${d[0]}`; // วัน/เดือน/ปี
        let html = `
        <div class="booking-card" style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); ">
            
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div class="info-left">
                    <h3 style="color: #5A3E25; margin: 0 0 10px 0; font-size: 1.2rem;">ID: Q-${item.queueID}</h3>
                    <p style="margin: 5px 0; color: #5A3E25;"><strong>บริการ:</strong> ${item.service}</p>
                    <p style="margin: 5px 0; color: #5A3E25;"><strong>วัน เวลา:</strong> ${showDate} เวลา ${item.time} น.</p>
                </div>
                <button onclick="toggleCard(this)" style="background: #5A3E25; color: white; border: none; border-radius: 5px; width: 35px; height: 35px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
            
            <div class="card-body" style="display: none; margin-top: 15px; border-top: 1px dashed #ddd; padding-top: 15px;">
                <h4 style="color: #5A3E25; margin-bottom: 10px;">รายละเอียดการจอง</h4>
                <p style="margin: 5px 0; color: #555;"><strong>วัน เวลา:</strong> ${showDate} เวลา ${item.time}</p>
                <p style="margin: 5px 0; color: #555;"><strong>ระยะเวลา:</strong> ${item.duration} นาที</p>
                <p style="margin: 5px 0; color: #555;"><strong>ค่าบริการ:</strong> ${item.price} บาท</p>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="removeHistory(${item.id})" style="background: #c00; color: #fff; border: none; padding: 10px 25px; border-radius: 50px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        ยกเลิกการจอง
                    </button>
                    <p style="color: red; font-size: 12px; margin-top: 8px;">***คำเตือน หากยกเลิกการจองจะไม่สามารถขอเงินคืนได้***</p>
                </div>
            </div>

        </div>
        `;
        
        // แปะลงหน้าเว็บ
        container.insertAdjacentHTML('beforeend', html);
    });
}

// ฟังก์ชันยืดหดการ์ด
function toggleCard(btn) {
    // หาการ์ดแม่
    const card = btn.closest('.booking-card');
    const body = card.querySelector('.card-body');
    const icon = btn.querySelector('i');

    // สลับการแสดงผล
    if (body.style.display === "none") {
        body.style.display = "block";
        icon.classList.remove('fa-edit');
        icon.classList.add('fa-times'); // เปลี่ยนเป็นกากบาท
    } else {
        body.style.display = "none";
        icon.classList.remove('fa-times');
        icon.classList.add('fa-edit'); // เปลี่ยนกลับเป็นดินสอ
    }
}

// ฟังก์ชันลบ
function removeHistory(id) {
    if(confirm("ยืนยันการยกเลิกการจอง?")) {
        let list = JSON.parse(localStorage.getItem('bookingHistory')) || [];
        let newList = list.filter(item => item.id !== id); // ลบตัวที่ ID ตรงกันออก
        localStorage.setItem('bookingHistory', JSON.stringify(newList));
        renderHistoryCards(); // วาดใหม่ทันที
    }
}