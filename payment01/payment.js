 // --- ฟังก์ชันจัดการ Modal ---
    function openPaymentModal() {
        document.getElementById("paymentModal").style.display = "flex";
    }

    function closePaymentModal() {
        document.getElementById("paymentModal").style.display = "";
        // (เสริม) รีเซ็ตค่าเมื่อปิด เพื่อให้พร้อมใช้ครั้งหน้า
        resetUpload(); 
    }

    // --- ฟังก์ชันแสดงรูปตัวอย่าง (Preview) ---
    function previewSlip() {
        const fileInput = document.getElementById('slipInput');
        const preview = document.getElementById('slipPreview');
        const placeholder = document.getElementById('uploadPlaceholder');
        const fileName = document.getElementById('fileName');

        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';      // โชว์รูป
                placeholder.style.display = 'none';   // ซ่อนไอคอนอัปโหลด
                
                fileName.innerText = "ไฟล์: " + file.name;
                fileName.style.display = 'block';
            }

            reader.readAsDataURL(file);
        }
    }

    // --- ฟังก์ชันรีเซ็ต (เผื่อเปลี่ยนใจ) ---
    function resetUpload() {
        document.getElementById('slipInput').value = "";
        document.getElementById('slipPreview').style.display = 'none';
        document.getElementById('uploadPlaceholder').style.display = 'block';
        document.getElementById('fileName').style.display = 'none';
        document.getElementById('confirmBtn').innerText = "ยืนยันการโอนเงิน";
        document.getElementById('confirmBtn').disabled = false;
        document.getElementById('confirmBtn').style.backgroundColor = "#5A3E25";
    }

    // --- ฟังก์ชันจำลองการส่งข้อมูล (Simulate Submit) ---
    function submitSlip() {
        const fileInput = document.getElementById('slipInput');
        
        if (fileInput.files.length === 0) {
            alert("กรุณาเลือกรูปสลิปก่อนครับ");
            return;
        }

        // เปลี่ยนปุ่มเป็นสถานะ "กำลังตรวจสอบ"
        const btn = document.getElementById('confirmBtn');
        btn.innerText = "กำลังตรวจสอบ...";
        btn.style.backgroundColor = "#888"; // เปลี่ยนสีปุ่มให้ดูเหมือนรอ
        btn.disabled = true;

        // จำลองการรอ 2 วินาที (เหมือนส่งไปเช็ค API)
        setTimeout(() => {
            alert("✅ แจ้งโอนเงินเรียบร้อย! ระบบกำลังตรวจสอบ");
            closePaymentModal();
            // ตรงนี้อาจจะสั่งให้เปลี่ยนหน้าเว็บไปหน้าขอบคุณ หรือหน้าประวัติ
             window.location.href = "/Queue/q.html"; 
        }, 2000);
    }