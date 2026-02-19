<template>
    <div>
        <br>
        <h2 style="margin-left: 80px; color: #5A3E25; font-size: 30px; font-weight: bold;">จองคิว</h2>
        <div class="all_block">
            <div class="booking-container">
                <div class="boxone">
                    <h3 style="font-size: 20px; font-weight: bold ; color: #aa7a50;">เลือกช่างและบริการ</h3><br>
                    <div class="form-group">
                        <label class="form-label">บริการ</label>
                        <select id="inputService" class="form-input" @change="updatePrice" v-model="selectedService">
                            <option value="" selected>เลือกบริการ</option>
                            <option value="ตัด สระ ไดร์">ตัด สระ ไดร์</option>
                        </select>
                    </div>

                    
                    <div class="form-group">
                        <label class="form-label">ช่างตัดผม</label>
                        <select id="barber-select" class="form-input" v-model="selectedBarber">
                            <option value="" disabled selected>เลือกช่าง</option>
                            <option value="ช่างA">ช่างA</option>
                            
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">ราคา</label>
                        <input type="text" id="priceInput" class="form-input" placeholder="ราคา - บาท" readonly v-model="priceDisplay">  
                    </div>


                </div>

                    <div class="boxtwo">
                        <h3 style="font-size: 20px; font-weight: bold ; color: #aa7a50;">เลือกวันและเวลา</h3><br>
                        <div class="form-group ">
                            <label class="form-label">วันที่ต้องการจอง</label>
                            <input type="date" class="form-input" id="inputDate" v-model="selectedDate"> 
                        </div> 

                        <div class="form-group">
                            <label class="form-label">เวลาที่ต้องการจอง</label>
                            <select id="inputTime" class="form-input" v-model="selectedTime">
                                <option value="" disabled selected>เลือกเวลา</option>
                                <option value="11.00 - 12.00">11.00 - 12.00</option>
                                <option value="12.00 - 13.00">12.00 - 13.00</option>
                                <option value="13.00 - 14.00">13.00 - 14.00</option>
                                <option value="14.00 - 15.00">14.00 - 15.00</option>
                                <option value="15.00 - 16.00">15.00 - 16.00</option>
                                <option value="16.00 - 17.00">16.00 - 17.00</option>
                                <option value="17.00 - 18.00">17.00 - 18.00</option>
                                <option value="18.00 - 19.00">18.00 - 19.00</option>
                                <option value="19.00 - 20.00">19.00 - 20.00</option>
                                <option value="20.00 - 21.00">20.00 - 21.00</option>
                                
                            </select>
                        </div>
                        
                    </div>

                    
            </div>
           
        
        </div>
        <div class="box_about">
            <h3 style="font-size: 20px; font-weight: bold ; color: #aa7a50;" >ข้อมูลผู้จอง</h3><br>
            <div class="form-group" style="display: flex;  gap: 20px;" >
                <div style="flex: 1;">
                    <label class="form-label">ชื่อ</label>
                    <input type="text" class="form-input" placeholder="-" readonly v-model="userName">
                </div>
                 <div style="flex: 1;">
                    <label class="form-label">เบอร์โทร</label>
                    <input type="text" class="form-input" value="064-191-1122" readonly>
                </div>
                
            </div>
            <div class="form-group" style="display: flex; margin-top: 20px; gap: 20px;" >
                <div style="flex: 1;">
                    <label class="form-label">Email</label>
                    <input type="text" class="form-input" placeholder="-" readonly>
                </div>
                <div style="flex: 1;">
                    <label class="form-label">หมายเหตุ</label>
                    <input type="text" class="form-input" placeholder="-" readonly>
                </div>
                
            </div>
                <button class="btn-next" @click="saveAndGoNext">
                    ถัดไป
                </button>
            
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedService = ref('');
const selectedBarber = ref('');
const priceDisplay = ref('');
const selectedDate = ref('');
const selectedTime = ref('');
const userName = ref('');

const updatePrice = () => {
    if (selectedService.value === "ตัด สระ ไดร์") {
        priceDisplay.value = "150 บาท";
    } else if (selectedService.value === "ตัดผมชาย") {
        priceDisplay.value = "100 บาท";
    } else {
        priceDisplay.value = "";
    }
}

const saveAndGoNext = () => {
    // Validation
    if (!selectedDate.value || !selectedTime.value) {
        alert("กรุณาเลือกวันและเวลาให้ครบถ้วน");
        return;
    }

    let price = "150";
    let duration = "60";

    if (selectedService.value.includes("ตัด สระ ไดร์")) {
        price = "150";
        duration = "60";
    }

    const bookingData = {
        service: selectedService.value,
        date: selectedDate.value,
        time: selectedTime.value,
        price: price, // This logic was a bit hardcoded in original JS, keeping it similar
        duration: duration,
        barber: selectedBarber.value
    };

    localStorage.setItem("tempBooking", JSON.stringify(bookingData));
    router.push('../payment/pay');
}

onMounted(() => {
    // Gatekeeper
    const status = localStorage.getItem("isLoggedIn");
    const name = localStorage.getItem("userName");

    if (status !== "yes") {
        alert("⛔ กรุณาเข้าสู่ระบบก่อนเข้าจองคิว");
        router.push('/');
    } else {
        if (name) userName.value = name;
    }
});
</script>

