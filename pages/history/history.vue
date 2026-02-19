<template>
    <div>
        <br>
        <h2 style="margin-left: 80px;color: #5A3E25; font-size: 30px; font-weight: bold;">ประวัติการจอง</h2><br>
        <h3 style=" margin-left: 80px; font-size: 20px; font-weight: bold ; color: #aa7a50;">-วันนี้</h3><br>
        <div class="container" id="history-list" style="padding-left: 0px; max-width: 600px; margin-left: 5%;">
            
            <div v-if="historyList.length === 0">
                <p style='text-align:center; color:#999;'>ยังไม่มีประวัติการจอง</p>
            </div>

            <div v-else v-for="item in historyList" :key="item.id" class="booking-card" :class="{ 'active': item.expanded }">
                
                <div class="card-header">
                    <div class="header-info">
                        <h3 style="color: #5A3E25; margin-bottom: 10px; font-size: 20px; font-weight: bold;">ID: Q-{{ item.queueID }}</h3>
                        <p><strong>บริการ:</strong> {{ item.service }}</p>
                        <p><strong>วัน เวลา:</strong> {{ formatDate(item.date) }} เวลา {{ item.time }} น.</p>
                    </div>
                    <button class="toggle-btn" @click="toggleCard(item)">
                        <i :class="item.expanded ? 'fas fa-angle-down' : 'fas fa-angle-down'"></i>
                    </button>
                    <!-- Note: history.css rotates the button when active, so we keep the same icon or let CSS handle rotation. 
                         The CSS says: .booking-card.active .toggle-btn { transform: rotate(180deg); } 
                         So we just need the icon. Original used arrow or similar. 
                         I will use fa-angle-down as it acts like a toggle.
                    -->
                </div>
                
                <div class="card-body mt-3">
                    <h4 style="color: #5A3E25; margin-bottom: 10px; font-size: 20px; font-weight: bold;">รายละเอียดการจอง</h4>
                    <div class="detail-row">
                        <p><strong>วัน เวลา:</strong> {{ formatDate(item.date) }} เวลา {{ item.time }}</p>
                    </div>
                    <div class="detail-row">
                        <p><strong>ระยะเวลา:</strong> {{ item.duration }} นาที</p>
                    </div>
                    <div class="detail-row">
                        <p><strong>ค่าบริการ:</strong> {{ item.price }} บาท</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button class="cancel-btn" @click="removeHistory(item.id)">
                            ยกเลิกการจอง
                        </button>
                        <p style="color: red; font-size: 12px; margin-top: 8px;">***คำเตือน หากยกเลิกการจองจะไม่สามารถขอเงินคืนได้***</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const historyList = ref([]);

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = dateStr.split("-");
    if (d.length !== 3) return dateStr;
    return `${d[2]}/${d[1]}/${d[0]}`;
}

const toggleCard = (item) => {
    item.expanded = !item.expanded;
}

const removeHistory = (id) => {
    if(confirm("ยืนยันการยกเลิกการจอง?")) {
        historyList.value = historyList.value.filter(item => item.id !== id);
        localStorage.setItem('bookingHistory', JSON.stringify(historyList.value));
    }
}

const loadHistory = () => {
    const stored = localStorage.getItem('bookingHistory');
    if (stored) {
        historyList.value = JSON.parse(stored).map(item => ({
            ...item,
            expanded: false
        }));
        historyList.value.reverse();
    }
}

onMounted(() => {
    const status = localStorage.getItem("isLoggedIn");
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้าประวัติ");
        router.push('/');
        return;
    }
    loadHistory();
});
</script>

<style scoped>
/* Scoped styles are not needed as we rely on history.css */
</style>
