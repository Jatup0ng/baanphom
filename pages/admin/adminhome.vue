<template>
    <div id="page-dashboard">
        <div class="page-header">
            <h1>แดชบอร์ด</h1>
            <p class="date">{{ currentDate }}</p>
        </div>

        <div class="dashboard-layout">
            <div class="left-panel">
                <div class="stat-card card-light-brown">
                    <h3>คิววันนี้</h3>
                    <div class="number">{{ todayQueueCount }} คิว</div>
                </div>
                <div class="stat-card card-dark-brown">
                    <h3>การจองในเดือนนี้</h3>
                    <div class="number">{{ monthQueueCount }} คิว</div>
                </div>
                <div class="stat-card card-red">
                    <h3>ยกเลิกการจอง</h3>
                    <div class="number">{{ cancelQueueCount }} คิว</div>
                </div>
            </div>

            <div class="right-panel">
                <h3 class="panel-heading">คิวถัดไป</h3>
                <div class="queue-card">
                    <div class="user-icon">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="queue-info">
                        <div class="info-row" v-if="!nextQueue">ไม่มีคิวเร็วๆ นี้</div>
                        <div v-else>
                            <div class="info-row"><strong>เวลา:</strong> <span>{{ nextQueue.time }}</span></div>
                            <div class="info-row"><strong>ชื่อลูกค้า:</strong> <span>{{ nextQueue.name }}</span></div>
                            <div class="info-row"><strong>บริการ:</strong> <span>{{ nextQueue.service }}</span></div>
                        </div>
                    </div>
                    <button class="btn-call" v-if="nextQueue" @click="callCustomer">
                        <i class="fas fa-phone-alt"></i> โทร
                    </button>
                </div>

                <h3 class="panel-heading mt-20">ตารางเวลา</h3>
                <div class="schedule-container">
                    <div class="time-list">
                        <div class="time-row" v-for="slot in timeSlots" :key="slot">
                            <span class="time-text">{{ slot }} น.</span>
                            <div class="slot-box">ว่าง <i class="fas fa-plus-circle"></i></div>
                        </div>
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

const currentDate = ref('');
const nextQueue = ref(null);
const todayQueueCount = ref(0);
const monthQueueCount = ref(0);
const cancelQueueCount = ref(0); // This logic might need more work if we implement cancellation

const timeSlots = [
    '11.00', '12.00', '13.00', '14.00', '15.00', 
    '16.00', '17.00', '18.00', '19.00', '20.00', '21.00'
];

const { getBookings, getTodayBookings } = useBooking();

const loadDashboardData = () => {
    // Date
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    currentDate.value = new Date().toLocaleDateString('th-TH', options);

    // Stats
    const allBookings = getBookings();
    const todayBookings = getTodayBookings();
    
    todayQueueCount.value = todayBookings.length;
    monthQueueCount.value = allBookings.length; // Simplified for now, should filter by month

    // Next Queue logic: Find the first booking today that is 'รอตัด' and sort by time
    const pendingToday = todayBookings.filter(b => b.status === 'รอตัด').sort((a, b) => {
        return a.time.localeCompare(b.time);
    });

    if (pendingToday.length > 0) {
        nextQueue.value = pendingToday[0];
    } else {
        nextQueue.value = null;
    }
};

const callCustomer = () => {
    if (nextQueue.value) {
        alert(`กำลังเรียกคุณ ${nextQueue.value.name} คิวที่ Q-${nextQueue.value.queueID}`);
    }
}

onMounted(() => {
    loadDashboardData();
});
</script>

<style scoped>
/* Styles are in admin.css */

</style>
