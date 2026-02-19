<template>
    <div>
        <br>
        <NuxtLink to="/payment/pay" style="text-decoration: none;"><h2 style="margin-left: 80px; color: #5A3E25;font-size: 30px; font-weight: bold;"><i class="fas fa-angle-left"></i>&nbsp;สแกนเพื่อชำระเงิน </h2><br></NuxtLink>
        <div style="display: flex; color: #aa7a50; justify-content:right; ">
                <h3 style="margin-right:35%; font-size: 20px; font-weight: bold;">รายละเอียดการจอง</h3>
        </div>
        
        
        <div class="qrpayment-container">
            <div class="qrpayment-methods">
                <img src="https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.15752-9/599522693_774603158383442_7518024844061670756_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_ohc=cxrwtFA_CcAQ7kNvwH3xAY6&_nc_oc=AdkbZ9b0VIYRwD5EaSRCcmreYVbXj8jpq_h8VIqs071o232MVGhaoCI79q49dQfL-Lw&_nc_zt=23&_nc_ht=scontent.fcnx2-1.fna&oh=03_Q7cD4gEMtvI1ibwTOSc8MwkrW-3godecd7w8MW7VWTezMwfRCw&oe=69A3E6A9" alt="qr" class="qrpay">
                <h2 style="color: #704c30; font-size: 30px;">150 bath</h2><br>
                <h2 style="color: #704c30; font-size: 20px;">ชื่อบัญชี : บ้านผมบาร์เบอร์ช็อป </h2>
                <div class="next-bt">
                    <button type="button" id="ok" style="display: flex;">บันทึก QR</button>
                    <button type="button" id="next" style="display: flex;" @click="handlePayment">ชำระเงิน</button>
                    <!-- Added loading state if needed -->
                </div>

            </div>
            
            <div class="qrbooking-details-card" >
        
                <NuxtLink to="/booking/book" style="text-decoration: none;"><button  id="undo" >
                    <i class="fas fa-edit" style="color: rgb(255, 255, 255);"></i>
                </button></NuxtLink>

                <div class="detail">

                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #8B5E3C;">บริการ:</span>
                        <span style="margin-left: 10px;" >{{ bookingDetails.service }}</span> </div>

                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #8B5E3C;">วัน เวลา:</span>
                        <span style="margin-left: 10px;">{{ formatDate(bookingDetails.date) }} เวลา {{ bookingDetails.time }} น.</span> </div>

                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #8B5E3C;">ระยะเวลา:</span>
                        <span style="margin-left: 10px;">{{ bookingDetails.duration }} นาที</span> </div>

                    <div style="margin-bottom: 15px;" class="price">
                        <span style="font-weight: bold; color: #8B5E3C;">ค่าบริการ:</span>
                        <span style="margin-left: 10px;">{{ bookingDetails.price }} บาท</span>
                        <span :class="paymentStatusClass" style="margin-left: 10px;">{{ paymentStatusText }}</span>
                        
                    </div>

                </div>
                
            </div>
            
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBooking } from '~/composables/useBooking';

const router = useRouter();
const bookingDetails = ref({
    service: '-',
    date: '',
    time: '-',
    duration: '-',
    price: '-'
});
const paymentStatusText = ref('*รอชำระเงิน');
const paymentStatusClass = ref('status-pending');

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = dateStr.split("-");
    if (d.length !== 3) return dateStr;
    return `${d[2]}/${d[1]}/${d[0]}`;
}

const handlePayment = () => {
    // 1. Update UI
    paymentStatusText.value = " *ชำระเงินเสร็จสิ้น";
    paymentStatusClass.value = "status-success";

    // 2. Save Logic
    const currentData = JSON.parse(localStorage.getItem('tempBooking'));
    if (!currentData) return;

    // Generate Queue ID if not exists
    if (!currentData.queueID) {
        currentData.queueID = Math.floor(Math.random() * 20) + 1;
        // Update tempBooking
        localStorage.setItem('tempBooking', JSON.stringify(currentData));
    }

    // Save to History (bookingHistory)
    let historyList = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    // Add unique ID
    currentData.id = Date.now(); 
    currentData.status = 'รอตัด'; // Default status for admin
    currentData.name = localStorage.getItem('userName') || 'ลูกค้าทั่วไป'; // Ensure name is saved
    
    historyList.push(currentData);
    localStorage.setItem('bookingHistory', JSON.stringify(historyList));

    // Save for Admin (useBooking)
    const { addBooking } = useBooking();
    addBooking(currentData);

    // 3. Redirect
    setTimeout(() => {
        router.push("/Queue/q");
    }, 1500);
}

onMounted(() => {
    // 1. Check Login
    const status = localStorage.getItem("isLoggedIn");
    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบ");
        router.push('/');
        return;
    }

    // 2. Load Booking Details
    const stored = localStorage.getItem('tempBooking');
    if (stored) {
        bookingDetails.value = JSON.parse(stored);
    }
});
</script>

<style scoped>
/* Scoped styles or use global from pay.css */
.status-pending {
    color: red;
}
.status-success {
    color: green;
}
</style>
