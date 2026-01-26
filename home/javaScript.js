    // Login Popup
    function openLogin() {
        document.getElementById("loginModal").style.display = "flex";
    }

    
    function closeLogin() {
        document.getElementById("loginModal").style.display = "none";
    }

    
    window.onclick = function(event) {
        let modal = document.getElementById("loginModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    // Register Popup

    function openRegister() {
        document.getElementById("registerModal").style.display = "flex";
    }

    
    function closeRegister() {
        document.getElementById("registerModal").style.display = "none";
    }

    
    window.onclick = function(event) {
        let modal = document.getElementById("registerModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    


    // --- 1. ทำงานทันทีเมื่อเปิดหน้าเว็บ (ตรวจสอบว่าเคยล็อกอินหรือยัง) ---


function checkLoginStatus() {
    // แอบดูในเครื่องลูกค้าว่ามีตราปั๊ม isLoggedIn ไหม
    let status = localStorage.getItem("isLoggedIn");
    let name = localStorage.getItem("userName");

    if (status === "yes") {
        // ถ้ามี ให้เปลี่ยน Navbar เป็นโหมดสมาชิก
        updateNavToMember(name);
    } else {
        // ถ้าไม่มี ให้เป็นโหมดทั่วไป
        updateNavToGuest();
    }
}

// --- 2. ฟังก์ชันช่วยสลับหน้าตา Navbar (ใช้ภายในไฟล์นี้) ---
function updateNavToMember(name) {
    document.getElementById("guest-nav").style.display = "none";  // ซ่อนปุ่มเข้าสู่ระบบ
    document.getElementById("member-nav").style.display = "inline"; // โชว์ชื่อสมาชิก
    document.getElementById("user-name-display").innerText = "" + name; // แสดงชื่อสมาชิก
    
}

function updateNavToGuest() {
    document.getElementById("guest-nav").style.display = "inline"; // โชว์ปุ่มเข้าสู่ระบบ
    document.getElementById("member-nav").style.display = "none";  // ซ่อนชื่อสมาชิก
}

// --- 3. ฟังก์ชันล็อกอิน (ผูกกับปุ่ม "เข้าสู่ระบบ" ใน Modal) ---
function performLogin() {
    // 1. ตั้งชื่อสมมติ (หรือดึงจากช่อง Input ก็ได้)
    document.getElementById("username-input").value

    // 2. บันทึกลงเครื่อง (ปั๊มตรา)
    localStorage.setItem("isLoggedIn", "yes");
    localStorage.setItem("userName", mockName);

    // 3. เปลี่ยนหน้าจอทันที
    updateNavToMember(mockName);

    // 4. สั่งปิด Modal (เรียกฟังก์ชันเดิมที่คุณมี)
    closeLogin(); 

    
}




// --- ฟังก์ชันเปิด-ปิด Modal เดิมของคุณ (เก็บไว้เหมือนเดิม) ---
function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}
function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function performLogin() {
    console.log("เริ่มทำงานฟังก์ชัน performLogin...");

    // 1. ลองหาช่องกรอกชื่อ
    let inputField = document.getElementById("username-input");

    // 🔴 ถ้าหาไม่เจอ ให้ฟ้องทันที
    if (!inputField) {
        alert("❌ ERROR: หาช่องกรอกชื่อไม่เจอ!\n(คุณน่าจะลืมเติม id='username-input' ในไฟล์ HTML)");
        return; // หยุดทำงาน
    }

    // 2. ถ้าเจอแล้ว ดึงค่าออกมา
    let nameValue = inputField.value;
    console.log("ชื่อที่ได้คือ:", nameValue);

    // ตั้งชื่อสำรองถ้าไม่ได้กรอก
    if (!nameValue || nameValue.trim() === "") {
        nameValue = "คุณลูกค้า";
    }

    // 3. บันทึกและเปลี่ยนหน้า
    try {
        localStorage.setItem("isLoggedIn", "yes");
        localStorage.setItem("userName", nameValue);
        
        updateNavToMember(nameValue);
        closeLogin();
        // alert("✅ เข้าสู่ระบบสำเร็จ! (ชื่อ: " + nameValue + ")");
    } catch (e) {
        alert("❌ ERROR ในการเปลี่ยน Navbar: " + e.message);
    }
}
    
    