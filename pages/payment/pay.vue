<template>

    <div>   
        <br>
        <h2 style="margin-left: 80px; color: #5A3E25; font-size: 30px; font-weight: bold;">ชำระเงิน</h2><br>
        <div style="display: flex; color: #aa7a50; justify-content: space-between; ">
                <h3 style="margin-left: 80px; font-size: 20px; font-weight: bold;">วิธีการชำระเงิน</h3>
                <h3 style="margin-right: 35%; font-size: 20px; font-weight: bold;">รายละเอียดการจอง</h3>
        </div>
        
        <div class="payment-container">
            <div class="payment-methods">
                
                <div class="payment-method">
                    <div style="display: flex; align-items: center;"> 
                        <input type="radio" id="qr-scan" name="payment" value="qr" checked style="margin-right: 10px; cursor: pointer;">
                            <label for="qr-scan" style="margin: 0; cursor: pointer; font-weight: bold; color: #5a3e2b;">
                                สแกนคิวอาร์โค้ด
                            </label>
                    </div>

                    <img src="/payment.png" alt="PromptPay" style="height: 75px;"> 
                </div>
                
            
                <div class="payment-method">
                    <div style="display: flex; align-items: center;"> 
                        <input type="radio" id="tnk" name="payment" value="qr"  style="margin-right: 10px; cursor: pointer;">
                        <label for="tnk" style="margin: 0; cursor: pointer; font-weight: bold; color: #5a3e2b;">
                            โอนเงินผ่านเลขบัญชี
                        </label>
                    </div>

                    <img src="https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.15752-9/620002964_1915001529408252_5897832893303710817_n.png?_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_ohc=gB2qtCinS_sQ7kNvwEKZW01&_nc_oc=AdnyofWu3-X1Lcz192rPX2qHEZAbnMWa97eBK-_F34SXzKiARDNyioDM0bytX8-ES00&_nc_zt=23&_nc_ht=scontent.fcnx2-1.fna&oh=03_Q7cD4QEvBCx-dvqWYWxjIwTZUkRYucITrUa2NkHmvJc3JFow5w&oe=69A3415E" alt="รูปธนาคาร" style="height: 65px;"> 
                </div>
                <div style="margin-top:20px" >
                     <NuxtLink to="/payment/qr"><button type="button" id="pay">ชำระเงิน</button></NuxtLink>
                </div>
               
                <div class="warning" style="color: rgb(201, 4, 4); margin-top: 10px; font-size: 14px; ">
                    <b><p>*** คำเตือน การยกเลิกการจองจะไม่สามารถขอเงินคืนได้ ***</p></b>
                </div>
            </div>
            
            <div class="booking-details-card" >
        
                <NuxtLink to="/booking/book" style="text-decoration: none;"> <button  id="undo" >
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

                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #8B5E3C;">ค่าบริการ:</span>
                        <span style="margin-left: 10px;">{{ bookingDetails.price }} บาท</span> </div>

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
    price: '-'
});

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = dateStr.split("-");
    if (d.length !== 3) return dateStr;
    return `${d[2]}/${d[1]}/${d[0]}`;
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
/* Scoped styles removed to rely on global pay.css */
@import '~/assets/css/payment/pay.css';
</style>
