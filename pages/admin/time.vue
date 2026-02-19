<template>
    <div id="page-schedule">
        <div class="page-header"><h1>จัดการตารางเวลา</h1></div>

        <div class="schedule-selector-area">
            <select id="schedule-barber-select" class="schedule-dropdown" v-model="selectedBarber">
                <option value="" disabled selected>เลือกช่าง</option>
                <option value="1">ช่างต้น</option>
                <option value="2">ช่าง A</option>
            </select>

            <div class="instruction-bar" v-if="!selectedBarber">
                กรุณาเลือกช่างเพื่อจัดการตารางเวลา
            </div>
        </div>

        <div id="schedule-workspace" v-if="selectedBarber">
            
            <div class="brown-box-container mt-20">
                <div class="box-header" id="schedule-header-text">ตารางเวลา ({{ selectedBarberName }})</div>
                <div class="box-body" style="padding: 15px;">
                    <div class="schedule-table-wrapper">
                        <table class="schedule-grid">
                            <thead>
                                <tr>
                                    <th>วัน</th>
                                    <th>11.00-<br>12.00</th>
                                    <th>12.00-<br>13.00</th>
                                    <th>13.00-<br>14.00</th>
                                    <th>14.00-<br>15.00</th>
                                    <th>15.00-<br>16.00</th>
                                    <th>16.00-<br>17.00</th>
                                    <th>17.00-<br>18.00</th>
                                    <th>18.00-<br>19.00</th>
                                    <th>19.00-<br>20.00</th>
                                    <th>20.00-<br>21.00</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="day in days" :key="day">
                                    <td class="day-cell">
                                        <div>{{ day }}</div>
                                        <button class="btn-select-all">เลือกทั้งหมด</button>
                                    </td>
                                    <td v-for="i in 10" :key="i"><input type="checkbox" checked></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="holiday-section-row">
                <div class="brown-box-container holiday-box">
                    <div class="box-header">เพิ่มวันหยุด</div>
                    <div class="box-body holiday-body">
                        <div class="form-group">
                            <label>วันที่หยุด</label>
                            <input type="date" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>เหตุผล</label>
                            <input type="text" class="form-control">
                        </div>
                    </div>
                </div>

                <div class="brown-box-container holiday-box">
                    <div class="box-header">วันหยุดทั้งหมด</div>
                    <div class="box-body holiday-body">
                        <div class="form-group">
                            <label>วันที่</label>
                            <div class="white-inner-box">
                                <i class="fas fa-exclamation-circle"></i> ยังไม่มีข้อมูลวันหยุด
                            </div>
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
import '~/assets/css/admin/admin.css';
import { ref, computed } from 'vue';

const selectedBarber = ref('');
const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

const selectedBarberName = computed(() => {
    if (selectedBarber.value === '1') return 'ช่างต้น';
    if (selectedBarber.value === '2') return 'ช่าง A';
    return '';
});
</script>

<style scoped>
/* Inherited from admin.css */
/* Specific overrides for Time page if not in admin.css */
.schedule-dropdown {
    padding: 10px; width: 200px; border-radius: 5px; border: 1px solid #ccc;
}
.instruction-bar {
    margin-top: 10px; color: #666; font-style: italic;
}
.schedule-table-wrapper {
    overflow-x: auto;
}
.schedule-grid {
    width: 100%; border-collapse: collapse; min-width: 800px;
}
.schedule-grid th, .schedule-grid td {
    border: 1px solid #ccc; padding: 10px; text-align: center;
    background-color: white; color: #5A3E25;
}
.schedule-grid th {
    background-color: #eee; font-size: 12px;
}
.day-cell {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
}
.btn-select-all {
    font-size: 10px; padding: 2px 5px; cursor: pointer;
}
.holiday-section-row {
    display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap;
}
.holiday-box {
    flex: 1; min-width: 300px;
}
</style>
