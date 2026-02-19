<template>
    <div id="page-queue">
        <div class="page-header">
            <h1>จัดการคิว</h1>
        </div>

        <div class="queue-management-area">
            <div class="brown-box-container">
                <div class="box-header">กรองข้อมูล</div>
                <div class="box-body filter-body">
                    <div class="filter-row">
                        <div class="filter-item">
                            <label>วันที่</label>
                            <input type="date" class="form-control" v-model="filterDate">
                        </div>
                        <div class="filter-item">
                            <label>สถานะ</label>
                            <select class="form-control" v-model="filterStatus">
                                <option value="ทั้งหมด">ทั้งหมด</option>
                                <option value="รอตัด">รอตัด</option>
                                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="brown-box-container mt-20">
                <div class="box-header">รายการคิว</div>
                <div class="box-body list-body">
                    <div class="white-inner-box" v-if="filteredBookings.length === 0">
                        <i class="fas fa-exclamation-circle"></i> ยังไม่พบข้อมูลการจอง
                    </div>
                    <div v-else style="width: 100%;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background:#f4f4f4; text-align:left;">
                                    <th style="padding:10px;">เวลา</th>
                                    <th style="padding:10px;">ชื่อ</th>
                                    <th style="padding:10px;">บริการ</th>
                                    <th style="padding:10px;">ช่าง</th>
                                    <th style="padding:10px;">สถานะ</th>
                                    <th style="padding:10px;">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="booking in filteredBookings" :key="booking.id" style="border-bottom:1px solid #eee;">
                                    <td style="padding:10px;">{{ booking.date }} {{ booking.time }}</td>
                                    <td style="padding:10px;">{{ booking.name }}</td>
                                    <td style="padding:10px;">{{ booking.service }}</td>
                                    <td style="padding:10px;">{{ booking.barber }}</td>
                                    <td style="padding:10px;">
                                        <span :style="{ color: booking.status === 'เสร็จสิ้น' ? 'green' : 'orange' }">{{ booking.status }}</span>
                                    </td>
                                    <td style="padding:10px;">
                                        <button @click="toggleStatus(booking)" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc;">
                                            เปลี่ยนสถานะ
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
});

import { ref, onMounted, computed } from 'vue';
import { useBooking } from '~/composables/useBooking';
import '~/assets/css/admin/admin.css';

const { getBookings, updateBookingStatus } = useBooking();
const allBookings = ref([]);
const filterDate = ref('');
const filterStatus = ref('ทั้งหมด');

const loadData = () => {
    allBookings.value = getBookings();
};

const filteredBookings = computed(() => {
    return allBookings.value.filter(b => {
        let matchDate = true;
        let matchStatus = true;

        if (filterDate.value) {
            matchDate = b.date === filterDate.value;
        }

        if (filterStatus.value !== 'ทั้งหมด') {
            matchStatus = b.status === filterStatus.value;
        }

        return matchDate && matchStatus;
    });
});

const toggleStatus = (booking) => {
    const newStatus = booking.status === 'รอตัด' ? 'เสร็จสิ้น' : 'รอตัด';
    updateBookingStatus(booking.id, newStatus);
    booking.status = newStatus; // Optimistic update
};

onMounted(() => {
    loadData();
});
</script>

<style scoped>
/* Styles inherited from admin.css */

</style>
