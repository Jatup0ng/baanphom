<template>
    <div class="container">
        <h1 class="page-title">บัญชีของฉัน</h1>
        <h2 class="sub-title">ข้อมูลส่วนตัว</h2>

        <div class="profile-card">
            <div class="form-group">
                <label>ชื่อ*</label>
                <div class="input-wrapper">
                    <input type="text" id="profile-name" class="form-control" v-model="profileName" :readonly="!isEditingName" :style="nameInputStyle">
                    <a href="javascript:void(0)" id="btn-edit-name" class="edit-action" @click="toggleEditName" :style="editBtnStyle">
                        <i :class="isEditingName ? 'fas fa-save' : 'fas fa-edit'"></i> {{ isEditingName ? 'บันทึก' : 'แก้ไข' }}
                    </a>
                </div>
            </div>

            <div class="form-group">
                <label>เบอร์โทร*</label>
                <div class="input-wrapper">
                    <input type="text" id="profile-phone" class="form-control" value="064-191-1122" readonly>
                </div>
            </div>

            <div class="form-group">
                <label>อีเมล</label>
                <div class="input-wrapper">
                    <input type="email" id="profile-email" class="form-control" value="phomtud@gmail.com" readonly>
                </div>
            </div>

            <div class="form-group">
                <label>รหัสผ่าน</label>
                <div class="input-wrapper">
                    <input :type="isEditingPass ? 'text' : 'password'" id="profile-pass" class="form-control" v-model="profilePass" :readonly="!isEditingPass" :style="passInputStyle">
                    <a href="javascript:void(0)" id="btn-edit-pass" class="edit-action" @click="toggleEditPass" :style="editPassBtnStyle">
                        <i :class="isEditingPass ? 'fas fa-save' : 'fas fa-edit'"></i> {{ isEditingPass ? 'บันทึก' : 'แก้ไข' }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const profileName = ref('');
const profilePass = ref('12345678');
const isEditingName = ref(false);
const isEditingPass = ref(false);

const nameInputStyle = computed(() => ({
    borderColor: isEditingName.value ? '#007bff' : '#8B5E3C'
}));

const editBtnStyle = computed(() => ({
    color: isEditingName.value ? '#28a745' : '#5D3A1A'
}));

const passInputStyle = computed(() => ({
    borderColor: isEditingPass.value ? '#007bff' : '#8B5E3C'
}));

const editPassBtnStyle = computed(() => ({
    color: isEditingPass.value ? '#28a745' : '#5D3A1A'
}));

onMounted(() => {
    const currentName = localStorage.getItem("userName");
    profileName.value = currentName || "Guest";
});

const toggleEditName = () => {
    if (!isEditingName.value) {
        // Start Editing
        isEditingName.value = true;
    } else {
        // Save
        if (profileName.value.trim() === "") {
            alert("กรุณากรอกชื่อ");
            return;
        }

        // 1. Save to LocalStorage
        localStorage.setItem("userName", profileName.value);

        // 2. Update Global State (Direct DOM manipulation as per legacy approach fallback, or rely on reload)
        // Since Navbar is in Layout, we can try to update it if it is mounted.
        const navName = document.getElementById("user-name-display");
        if(navName) navName.innerText = profileName.value;

        isEditingName.value = false;
        alert("บันทึกชื่อเรียบร้อยแล้ว!");
    }
}

const toggleEditPass = () => {
    if (!isEditingPass.value) {
        isEditingPass.value = true;
    } else {
        isEditingPass.value = false;
        alert("บันทึกรหัสผ่านเรียบร้อยแล้ว!");
    }
}

</script>

<style scoped>
/* Embedded styles from data.html */
.container {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
}

h1.page-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #4A2E16;
}

h2.sub-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #aa7a50;
}

.profile-card {
    background-color: #ffffff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 16px;
}

.input-wrapper {
    position: relative;
}

.form-control {
    width: 100%;
    padding: 12px 15px;
    font-size: 16px;
    border: 1px solid #8B5E3C;
    border-radius: 10px;
    box-sizing: border-box;
    color: #333;
    outline: none;
    font-family: 'Sarabun', sans-serif;
}

.edit-action {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    text-decoration: none;
    color: #5D3A1A;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
}

.edit-action i {
    margin-right: 5px;
}
</style>
