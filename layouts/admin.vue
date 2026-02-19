<template>
  <div class="admin-layout">
    <!-- Navbar -->
    <div class="navbar">
        <div class="logo">
            <i class="fas fa-cut"></i>
            <div class="text">
                <span class="en">BAAN PHOM</span>
                <span class="th">บ้านผม บาร์เบอร์</span>
            </div>
        </div>
        <div class="menu-icons">
            <NuxtLink to="/admin/adminhome" class="menu-icon" active-class="active">แดชบอร์ด</NuxtLink>
            <NuxtLink to="/admin/queue" class="menu-icon" active-class="active">จัดการคิว</NuxtLink>
            <NuxtLink to="/admin/service" class="menu-icon" active-class="active">จัดบริการและช่าง</NuxtLink>
            <NuxtLink to="/admin/time" class="menu-icon" active-class="active">จัดตารางเวลา</NuxtLink>
            
            <span id="admin-nav" style="position: relative;">
                <NuxtLink to="#" class="menu-icon" @click.prevent="toggleDropdown" ref="dropdownTrigger">
                    <i class="fas fa-user-shield"></i>&nbsp;
                    <span>AdminPhontud</span>
                </NuxtLink>
                <div class="dropdown-content" :class="{ 'show': isDropdownOpen }" ref="dropdownMenu">
                    <div class="aboutme">
                        <NuxtLink to="#">
                            <i class="fas fa-user-tie"></i> บัญชีแอดมิน
                        </NuxtLink>
                    </div>
                    <NuxtLink to="#" @click.prevent="logout">
                        <i class="fas fa-sign-out-alt"></i> ออกจากระบบ
                    </NuxtLink>
                </div>
            </span>
        </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// Remove admin.css import to use global styles + scoped styles below
// import '~/assets/css/admin/admin.css';

const router = useRouter();
const isDropdownOpen = ref(false);
const dropdownTrigger = ref(null);
const dropdownMenu = ref(null);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
}

const closeDropdown = (event) => {
    if (
        dropdownTrigger.value && 
        !dropdownTrigger.value.$el.contains(event.target) && 
        dropdownMenu.value && 
        !dropdownMenu.value.contains(event.target)
    ) {
        isDropdownOpen.value = false;
    }
}

const logout = () => {
    if (confirm("ต้องการออกจากระบบแอดมินใช่หรือไม่?")) {
        if (process.client) {
            localStorage.removeItem('isAdminAuthenticated');
        }
        router.push('/');
    }
}

onMounted(() => {
    document.addEventListener('click', closeDropdown);
    if (process.client) {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        if (!isAuthenticated) {
            router.push('/admin/login');
        }
    }
});

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
/* Copied and adapted from default.vue to match theme */

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
    font-size: 14px;
    color: #5A3E25;
    cursor: pointer;
    margin-left: 25px;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.menu-icon {
    text-decoration: none;
    color: #442f1c;
    font-size: 16px;
    padding: 10px 15px;
    transition: all 0.3s ease;
    display: inline-block; 
}

.menu-icon:hover, .menu-icon.active {
    text-shadow: 0 0 1px #442f1c, 0 0 1px #442f1c; 
    transform: translateY(-1px); 
    color: #8B5E3C; /* Add a highlight color for active state if desired */
}

/* กล่องเมนูย่อย */
.dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    top: 40px;
    background-color: #fff;
    min-width: 180px; /* Slightly wider for admin options */
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 100;
    border-radius: 5px;
    overflow: hidden;
}

.dropdown-content.show {
    display: block;
}

/* ลิงก์ข้างในเมนู */
.dropdown-content a {
    color: #333 !important;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
    font-size: 14px;
}

/* เอฟเฟกต์ตอนเอาเมาส์ชี้ */
.dropdown-content a:hover {
    background-color: #f1f1f1;
    color: rgb(255, 0, 0) !important;
}

.aboutme a:hover {
    background-color: #f1f1f1;
    color: #333 !important;  
}

.container {
    padding: 20px;
    /* Optional: Add max-width if you want to constrain the content width like typical layouts */
    /* max-width: 1200px; */
    /* margin: 0 auto; */
}
</style>
