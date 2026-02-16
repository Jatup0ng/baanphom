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
    
    

// --- 1. ทำงานทันทีเมื่อเปิดหน้าเว็บ (ตรวจสอบสถานะ) ---
document.addEventListener("DOMContentLoaded", function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    let status = localStorage.getItem("isLoggedIn");
    let name = localStorage.getItem("userName");

    if (status === "yes") {
        updateNavToMember(name);
    } else {
        updateNavToGuest();
    }
}

// --- 2. ฟังก์ชันสลับหน้าตา Navbar (แก้ชื่อ ID ให้ตรง HTML แล้ว) ---
function updateNavToMember(name) {
    
    let guestNav = document.getElementById("guest-nav");
    let memberNav = document.getElementById("member-nav");
    let nameDisplay = document.getElementById("user-name-display");

    if (guestNav) guestNav.style.display = "none"; 
    if (memberNav) memberNav.style.display = "inline-block";
    if (nameDisplay) nameDisplay.innerText = name;
}

function updateNavToGuest() {
    let guestNav = document.getElementById("guest-nav");
    let memberNav = document.getElementById("member-nav");

    if (guestNav) guestNav.style.display = "inline";
    if (memberNav) memberNav.style.display = "none";
}

// --- 3. ระบบ Modal (Login / Register) ---
function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function openRegister() {
    document.getElementById("registerModal").style.display = "flex";
}

function closeRegister() {
    document.getElementById("registerModal").style.display = "none";
}

// --- 4. ฟังก์ชันล็อกอิน ---
function performLogin() {
    let inputField = document.getElementById("username-input");
    
    // กันเหนียว: ถ้าหาช่องกรอกไม่เจอ
    if (!inputField) {
        console.error("ไม่พบช่องกรอกชื่อ (id='username-input')");
        return;
    }

    let nameValue = inputField.value;
    if (!nameValue || nameValue.trim() === "") {
        nameValue = "User";
    }

    // บันทึกและเปลี่ยนหน้า
    localStorage.setItem("isLoggedIn", "yes");
    localStorage.setItem("userName", nameValue);
    
    updateNavToMember(nameValue);
    closeLogin();
}

// --- 5. ระบบ Dropdown Menu และ Logout ---
function toggleDropdown() {
    let dropdown = document.getElementById("userDropdown");
    if(dropdown) {
        dropdown.classList.toggle("show");
    }
}

function logout() {
    if(confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");

        // เช็คว่าอยู่หน้าไหน แล้วเด้งกลับให้ถูก
        if (window.location.pathname.includes("history")) {
            // ถ้าอยู่หน้าประวัติ ให้ถอยกลับไป index หน้าบ้าน
            window.location.href = "../index.html"; 
        } else {
            // ถ้าอยู่หน้าแรกอยู่แล้ว ให้รีเฟรช
            location.reload();
        }
    }
}

// --- 6. รวมตัวดักจับการคลิก (Window Click) ไว้ที่เดียว (แก้ปัญหาคำสั่งตีกัน) ---
window.onclick = function(event) {
    let loginModal = document.getElementById("loginModal");
    let registerModal = document.getElementById("registerModal");
    let dropdowns = document.getElementsByClassName("dropdown-content");

    // 1. คลิกพื้นหลังเพื่อปิด Login
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
    
    // 2. คลิกพื้นหลังเพื่อปิด Register
    if (event.target == registerModal) {
        registerModal.style.display = "none";
    }

    // 3. คลิกที่อื่นเพื่อปิด Dropdown เมนู
    if (!event.target.closest('.menu-icon')) {
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
   
