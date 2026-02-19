<template>
  <div>
    <!-- Navbar -->
    <div class="navbar">
        <div class="logo">
            <i class="fas fa-cut"></i>
            <div class="text">
                <span class="en">BAAN PHOM</span>
                <span class="th">บ้านผม บาร์เบอร์</span>
            </div>
        </div>
        <div class="menu-icons" >
            <NuxtLink to="/" class="menu-icon">หน้าแรก</NuxtLink>
            <NuxtLink to="/booking/book" class="menu-icon">จองคิว</NuxtLink>
            <span id="guest-nav">
                <NuxtLink to="#" class="menu-icon" @click="openLogin()">เข้าสู่ระบบ</NuxtLink>
            </span>
            <NuxtLink to="/history/history" class="menu-icon">ประวัติ</NuxtLink>
            <span id="member-nav" style="display: none; position: relative;">
                <NuxtLink to="#" class="menu-icon" @click="toggleDropdown()">
                    <i class="fas fa-user-tie"></i>&nbsp;
                    <span id="user-name-display"></span>
                </NuxtLink>
                <div id="userDropdown" class="dropdown-content">
                    <div class="aboutme">
                        <NuxtLink to="/data-profile/data" >
                            <i class="fas fa-user-tie"></i> ข้อมูลส่วนตัว
                        </NuxtLink>
                    </div>
                    <NuxtLink to="#" @click="logout()" id="logoutword">
                        <i class="fas fa-sign-out-alt"></i> ออกจากระบบ
                    </NuxtLink>
                </div>
            </span>
        </div>
    </div>

    <!-- Main Content Slot -->
    <slot />

    <!-- Modals (Placeholders from index.html) -->
    <!-- Note: Script logic for openLogin/closeLogin needs to be migrated to Vue composition API -->
    <div id="loginModal" class="modal-overlay " style="display: none;">
        <div class="modal-content">
            <span class="close-btn" @click="closeLogin()">x</span>
            <h2 style="color: #5A3E25; margin-bottom: 5px;">ยินดีต้อนรับสู่ BAAN PHOM</h2>
            <h3 style="color: #5A3E25; margin-bottom: 20px;">เข้าสู่ระบบสมาชิก</h3>
            <div class="form-group">
                <label class="form-label">ชื่อผู้ใช้</label>
                <input type="text" id="username-input" class="form-input" placeholder="ชื่อผู้ใช้">
            </div>
            <div class="form-group">
                <label class="form-label">รหัสผ่าน</label>
                <input type="password" id="password-input" class="form-input" placeholder="รหัสผ่าน">
            </div>
            <button class="login-btn" @click="performLogin()">
                <i class="fas fa-sign-in-alt"></i> เข้าสู่ระบบ
            </button>
            <div class="divider"><span>หรือ</span></div>
            <p style="font-size: 14px; margin-top: 10px;">
                <NuxtLink to="#" style="color: #d9534f; text-decoration: none;">ลืมรหัสผ่าน</NuxtLink>
            </p>
            <p style="font-size: 14px; margin-top: 5px;">
                ยังไม่มีบัญชี? <NuxtLink to="#" style="color: #8B5E3C; font-weight: bold; " @click="openRegister();closeLogin()">สมัครสมาชิกใหม่</NuxtLink>
            </p>
        </div>
    </div>

    <div id="registerModal" class="modal-overlay" style="display: none;">
        <div class="registermodal-content">
            <span class="close-btn" @click="closeRegister()">x</span>
            <h2 style=" color: #4c341f; margin-bottom: 5px;">สมัครสมาชิก</h2>
            <div class="form-group" style="display: flex; margin-top: 20px; gap: 20px;" >
                <div style="flex: 1;">
                    <label class="form-label">ชื่อ*</label>
                    <input type="text" class="form-input" placeholder="ชื่อ">
                </div>
                <div style="flex: 1;">
                    <label class="form-label">นามสกุล*</label>
                    <input type="text" class="form-input" placeholder="นามสกุล">
                </div>
            </div>
            <div class="form-group" style="display: flex; gap: 20px;">
                <div style="flex: 1;">
                    <label class="form-label">เบอร์โทร*</label>
                    <input type="text" class="form-input" placeholder="เบอร์โทร">
                </div>
                <div style="flex: 1;">
                    <label class="form-label">อีเมล*</label>
                    <input type="text" class="form-input" placeholder="อีเมล">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">รหัสผ่าน</label>
                <input type="password" class="form-input" placeholder="รหัสผ่าน">
                <p style="font-size: 12px; margin-top: 5px;">รหัสผ่านต้องมี อักขระอย่างน้อย 8 ตัวต้องประกอบด้วยพิมพ์ใหม่หนึ่งตัว</p>
            </div>
            <div class="form-group">
                <label class="form-label">ยืนยันรหัสผ่าน</label>
                <input type="password" class="form-input" placeholder="กรอกรหัสผ่านอีกครั้ง">
            </div>
            <button class="login-btn">
                 สมัครสมาชิก
            </button>
        </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

// Functions adapted from javaScript.js

const openLogin = () => {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "flex";
}

const closeLogin = () => {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
}

const openRegister = () => {
    const modal = document.getElementById("registerModal");
    if (modal) modal.style.display = "flex";
}

const closeRegister = () => {
    const modal = document.getElementById("registerModal");
    if (modal) modal.style.display = "none";
}

const updateNavToMember = (name) => {
    let guestNav = document.getElementById("guest-nav");
    let memberNav = document.getElementById("member-nav");
    let nameDisplay = document.getElementById("user-name-display");

    if (guestNav) guestNav.style.display = "none"; 
    if (memberNav) memberNav.style.display = "inline-block";
    if (nameDisplay) nameDisplay.innerText = name;
}

const updateNavToGuest = () => {
    let guestNav = document.getElementById("guest-nav");
    let memberNav = document.getElementById("member-nav");

    if (guestNav) guestNav.style.display = "inline";
    if (memberNav) memberNav.style.display = "none";
}

const checkLoginStatus = () => {
    let status = localStorage.getItem("isLoggedIn");
    let name = localStorage.getItem("userName");

    if (status === "yes") {
        updateNavToMember(name);
    } else {
        updateNavToGuest();
    }
}

const performLogin = () => {
    let inputField = document.getElementById("username-input");
    
    // Safety check
    if (!inputField) {
        console.error("No username input found");
        return;
    }

    let nameValue = inputField.value;
    let passwordValue = document.getElementById("password-input").value;

    if (!nameValue || nameValue.trim() === "") {
        // If empty name, default to User, unless attempting admin login (which requires 'admin')
        nameValue = "User";
    }

    // Admin Login Check
    if (nameValue === 'admin' && passwordValue === '12345678') {
        localStorage.setItem("isAdminAuthenticated", "true");
        window.location.href = "/admin/adminhome";
        return;
    }

    // Normal User Login
    localStorage.setItem("isLoggedIn", "yes");
    localStorage.setItem("userName", nameValue);
    
    updateNavToMember(nameValue);
    closeLogin();
}

const toggleDropdown = () => {
    let dropdown = document.getElementById("userDropdown");
    if(dropdown) {
        dropdown.classList.toggle("show");
    }
}

const logout = () => {
    if(confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");

        // Redirect logic
        window.location.href = "/"; 
    }
}

onMounted(() => {
    // 1. Check status on load
    checkLoginStatus();

    // 2. Window click listener for closing modals/dropdowns
    window.onclick = function(event) {
        let loginModal = document.getElementById("loginModal");
        let registerModal = document.getElementById("registerModal");
        let dropdowns = document.getElementsByClassName("dropdown-content");

        // 1. Click background to close Login
        if (loginModal && event.target == loginModal) {
            loginModal.style.display = "none";
        }
        
        // 2. Click background to close Register
        if (registerModal && event.target == registerModal) {
            registerModal.style.display = "none";
        }

        // 3. Click outside to close Dropdown
        if (!event.target.closest('.menu-icon')) {
            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
})
</script>

<style scoped>
/* Scoped styles can go here, but main styles are global in assets/css */
/* --- ตั้งค่าตัวแปรสี --- */
        :root {
            --primary-brown: #8B5E3C; /* สีน้ำตาลเข้มของกรอบบริการ */
            --bg-cream: #FAF7F2;      /* สีพื้นหลังครีม */
            --text-gold: #E8DCC4;     /* สีตัวหนังสือทอง */
            --text-dark: #333333;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Sarabun', sans-serif;
            background-color: var(--bg-cream);
            color: var(--text-dark);
        }

        /* --- 1. Navbar --- */
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: #ffffff;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            height: 90px;
        }

        .logo {
            
             
            font-family: "Rye", serif;
            font-weight: 400;
            font-style: normal;
            font-size: 45px;
            font-weight: bold;
            color: #5A3E25;
            display: flex;
            align-items: center;
            gap: 5px;
            margin-top: -15px;
        }

        .logo .en {
            font-size: 24px;
            font-weight: bold;
        }

        .logo .th {
            display: block;      
            font-size: 16px;
            margin-left: 10px;
            margin-top: -5px;    
        }


        .menu-icons {
            /* border:solid 1px;  */
            font-size: 14px;
            color: #5A3E25;
            cursor: pointer;
            margin-left: 25px;
            text-decoration: none;
            
        }
        
        .menu-icon {
            text-decoration: none;     /* เอาขีดเส้นใต้ออก */
            color: #442f1c;               /* สีดำเทาๆ (แก้ตามใจชอบ) */
            font-size: 16px;
            padding: 10px 15px;        /* เว้นระยะห่างรอบๆ ให้คลิกง่าย */
            transition: all 0.3s ease; /* หัวใจสำคัญ! สั่งให้ทุกการเปลี่ยนแปลงใช้เวลา 0.3 วิ */
            /* แก้ปัญหาตัวอักษรขยับ (optional) */
            display: inline-block; 
        }

        
        .menu-icon:hover {
            /* เทคนิค: ใช้เงาซ้อนกันเบาๆ ให้ดูเหมือนตัวหนา */
            text-shadow: 0 0 1px #442f1c, 0 0 1px #442f1c; 
            transform: translateY(-1px); 
        }

        /* กล่องเมนูย่อย (ปกติจะซ่อนไว้) */
.dropdown-content {
    display: none;           /* ซ่อนไว้ก่อน */
    position: absolute;      /* ลอยอยู่เหนือเนื้อหาอื่น */
    right: 0;                /* ชิดขวาให้ตรงกับชื่อ */
    top: 40px;               /* เว้นระยะลงมาจากชื่อนิดหน่อย */
    background-color: #fff;  /* พื้นหลังสีขาว */
    min-width: 150px;        /* ความกว้างขั้นต่ำ */
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); /* เงาให้ดูมีมิติ */
    z-index: 100;            /* ให้ลอยทับทุกอย่าง */
    border-radius: 5px;      /* มุมมน */
    overflow: hidden;
}

/* ลิงก์ข้างในเมนู */
.dropdown-content a {
    color: #333 !important;  /* สีตัวหนังสือ */
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
    font-size: 14px;
}

/* เอฟเฟกต์ตอนเอาเมาส์ชี้ */
.dropdown-content a:hover {
    background-color: #f1f1f1;
    color: rgb(255, 0, 0) !important;   /* ชี้แล้วเปลี่ยนเป็นสีแดง */
}
.aboutme a:hover {
    background-color: #f1f1f1;
    color:  #333 !important;  
}




/* คลาสสำหรับสั่งให้โชว์ (จะใช้ JS เติมคลาสนี้) */
.show {
    display: block;
}
/* 1. ฉากหลังสีดำจางๆ (Overlay) */
.modal-overlay {
    display: none; /* ซ่อนไว้ก่อน (สำคัญมาก) */
    position: fixed; /* ล็อคติดหน้าจอ ไม่เลื่อนตาม */
    z-index: 999; /* อยู่ชั้นบนสุด ทับทุกอย่าง */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* สีดำโปร่งแสง 60% */
    justify-content: center; /* จัดกึ่งกลางแนวนอน */
    align-items: center; /* จัดกึ่งกลางแนวตั้ง */
}

/* 2. กล่องล็อกอิน (ตัว Popup) */
.modal-content {
    background-color: #FAF7F2; /* สีครีมตามรูป */
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    
    max-width: 400px; /* กว้างไม่เกิน 400px */
    text-align: center;
    position: relative;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    animation: fadeIn 0.3s; /* ใส่เอฟเฟกต์ตอนโผล่ */
}

.registermodal-content {
    background-color: #FAF7F2; /* สีครีมตามรูป */
    padding: 50px;
    border-radius: 15px;
    width: 90%;
    max-width: 800px; /* กว้างไม่เกิน 400px */
    text-align: center;
    position: relative;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    animation: fadeIn 0.3s; /* ใส่เอฟเฟกต์ตอนโผล่ */
}

/* ปุ่มปิด (X) มุมขวา */
.close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #c71e1e;
    cursor: pointer;
}

/* จัดสไตล์ฟอร์มให้เหมือนรูป */
.form-group {
    margin-bottom: 15px;
    text-align: left;
}

.form-label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #5A3E25;
}

.form-input {
    font-family: 'Sarabun', sans-serif;
    width: 100%;
    padding: 10px;
    border: 1px solid #8B5E3C;
    border-radius: 8px;
    font-size: 14px;
    background: white;
}

.login-btn {
    width: 100%;
    padding: 12px;
    background-color: #5A3E25; /* สีน้ำตาลเข้ม */
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
}

/* เส้นขีด --- หรือ --- */
.divider {
    margin: 20px 0;
    border-top: 1px solid #ccc;
    position: relative;
}
.divider span {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: #FAF7F2;
    padding: 0 10px;
    color: #888;
    font-size: 12px;
}

/* เอฟเฟกต์เลือนขึ้นมา */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
