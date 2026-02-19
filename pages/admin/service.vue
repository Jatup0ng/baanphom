<template>
    <div id="page-services">
        <div class="page-header"><h1>จัดการบริการและช่าง</h1></div>

        <div class="table-card">
            <div class="table-header-row">
                <div class="table-title">บริการทั้งหมด</div>
                <div class="search-box">ค้นหา: <input type="text" class="search-input"></div>
            </div>
            <div class="table-content">
                <div class="rows-selector">แสดง 10 <i class="fas fa-caret-down"></i> แถว</div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th width="100">รูปภาพ</th>
                            <th>ชื่อบริการ</th>
                            <th>ระยะเวลา</th>
                            <th>ราคา</th>
                            <th>สถานะ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(service, index) in services" :key="index">
                            <td><img :src="service.image" class="img-thumb"></td>
                            <td><div class="item-name">{{ service.name }}</div><div class="item-desc">{{ service.desc }}</div></td>
                            <td>{{ service.duration }}</td>
                            <td>{{ service.price }}</td>
                            <td>
                                <button class="status-pill" 
                                    :class="service.active ? 'status-on' : 'status-off'" 
                                    @click="toggleServiceStatus(index)">
                                    {{ service.active ? 'เปิด' : 'ปิด' }}
                                </button>
                            </td>
                            <td><button class="btn-edit"><i class="fas fa-edit"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-footer-btn"><button><i class="fas fa-plus-circle"></i> เพิ่มบริการ</button></div>
        </div>

        <div class="table-card mt-20">
            <div class="table-header-row">
                <div class="table-title">ช่างทั้งหมด</div>
                <div class="search-box">ค้นหา: <input type="text" class="search-input"></div>
            </div>
            <div class="table-content">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th width="100">รูปภาพ</th>
                            <th>ชื่อช่าง</th>
                            <th>บริการ</th>
                            <th>ค่าบริการเพิ่ม</th>
                            <th>สถานะ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(barber, index) in barbers" :key="index">
                            <td><img :src="barber.image" class="img-thumb"></td>
                            <td><div class="item-name">{{ barber.name }}</div><div class="item-desc">{{ barber.desc }}</div></td>
                            <td>{{ barber.services }}</td>
                            <td>{{ barber.extraPrice }}</td>
                            <td>
                                <button class="status-pill" 
                                    :class="barber.active ? 'status-on' : 'status-off'" 
                                    @click="toggleBarberStatus(index)">
                                    {{ barber.active ? 'พร้อม' : 'ไม่พร้อม' }}
                                </button>
                            </td>
                            <td><button class="btn-edit"><i class="fas fa-edit"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-footer-btn"><button><i class="fas fa-plus-circle"></i> เพิ่มช่าง</button></div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
});
import '~/assets/css/admin/admin.css';

import { ref } from 'vue';

const services = ref([
    {
        image: 'https://via.placeholder.com/60',
        name: 'ตัดผมชาย',
        desc: 'ตัด สระ ไดร์',
        duration: '60 นาที',
        price: '150 บาท',
        active: true
    }
]);

const barbers = ref([
    {
        image: 'https://via.placeholder.com/60',
        name: 'ช่าง A',
        desc: 'ช่างประจำร้าน',
        services: 'ตัดผม',
        extraPrice: '0 บาท',
        active: true
    }
]);

const toggleServiceStatus = (index) => {
    services.value[index].active = !services.value[index].active;
}

const toggleBarberStatus = (index) => {
    barbers.value[index].active = !barbers.value[index].active;
}
</script>

<style scoped>
/* Inherits from admin.css */
/* Minimal overrides if needed */
.status-pill {
    padding: 5px 15px; border-radius: 20px; border: none; cursor: pointer; color: white; font-size: 12px;
}
.status-on { background-color: #4CAF50; }
.status-off { background-color: #F44336; }
</style>
