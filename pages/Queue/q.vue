<template>
    <div>
        <div class="q_con">
            <div class="q_text" style="text-align: center;">
                <h1>การจองคิวสำเร็จ !</h1>
                <h2 id="showQNumber" style="text-align: center; font-size: 40px; color: #ffffff;">{{ queueNumber }}</h2>
                <p>ขอบคุณที่ใช้บริการกับบ้านผม บาร์เบอร์</p>
                <p>‼️รอรับข้อความแจ้งเตือนเมื่อใกล้ถึงคิวของคุณ‼️</p>
            </div>
            
            
        </div>

            
        <div class="detail">

                <h3 style="margin-top: 20px; margin-left: 8%;color: #aa7a50; font-weight: bold; font-size: 20px;">รายละเอียดการจอง</h3>
            <div class="column">
                
                <div class="card">

                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #8B5E3C;">บริการ:</span>
                        <span style="margin-left: 10px;" >{{ bookingDetails.service }}</span> </div>

                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #8B5E3C;">วัน เวลา:</span>
                        <span style="margin-left: 10px;">{{ formatDate(bookingDetails.date) }} เวลา {{ bookingDetails.time }} น.</span> </div>

                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #8B5E3C;">ระยะเวลา:</span>
                        <span style="margin-left: 10px;">{{ bookingDetails.duration }} นาที</span> </div>

                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #8B5E3C;">ค่าบริการ:</span>
                        <span style="margin-left: 10px;">{{ bookingDetails.price }} บาท</span> 
                        <span class="status-pending" id="status-pending" style="margin-left: 10px;color: rgb(0, 166, 66);font-weight: bold;">*ชำระเงินเสร็จสิ้น</span>
                    </div>

                </div> 

                <div>
                    <div class="rebook-container">
                        <NuxtLink to="/booking/book"><button class="btn-rebook">
                            จองอีกครั้ง
                        </button></NuxtLink>
                        <NuxtLink to="/history/history"><button class="btn-rebook">
                            ประวัติการจอง
                        </button></NuxtLink>
                        <NuxtLink to="/"><button class="btn-rebook">
                            กลับหน้าหลัก
                        </button></NuxtLink>
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
const bookingDetails = ref({
    service: '-',
    date: '',
    time: '-',
    duration: '-',
    price: '-',
    queueID: ''
});
const queueNumber = ref('-');

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = dateStr.split("-");
    if (d.length !== 3) return dateStr;
    return `${d[2]}/${d[1]}/${d[0]}`;
}

onMounted(() => {
    const stored = localStorage.getItem('tempBooking');
    
    if (!stored) {
        alert("❌ ไม่พบข้อมูลการจอง! (คุณอาจจะกดรีเฟรชหน้าคิวเล่นๆ ให้กลับไปจองใหม่)");
        return;
    }

    const data = JSON.parse(stored);
    
    if (!data.queueID) {
        alert("❌ ข้อมูลมาแล้ว แต่ไม่มีเลขคิว! (โค้ดหน้า Pay อาจจะยังไม่บันทึก)");
        return;
    }

    bookingDetails.value = data;
    queueNumber.value = "Q-" + data.queueID;
});


</script>

