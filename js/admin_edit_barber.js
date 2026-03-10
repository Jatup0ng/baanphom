document.addEventListener("DOMContentLoaded", () => {
    const editForm = document.getElementById('edit-barber-form');
    const nameInput = document.getElementById('barber-name');
    const serviceInput = document.getElementById('barber-service');
    const feeInput = document.getElementById('barber-fee');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const submitBtn = document.getElementById('submit-btn');

    // Get Barber ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const barberId = urlParams.get('id');
    const isEdit = !!barberId;

    let currentBarber = null;

    // Update UI based on mode
    if (isEdit) {
        formTitle.innerHTML = '<i class="fas fa-user-edit"></i> แก้ไขข้อมูลช่าง';
        formSubtitle.innerText = 'ปรับแต่งข้อมูลช่างตัดผมให้เป็นสไตล์ของร้าน';
        submitBtn.innerText = 'บันทึกการเปลี่ยนแปลง';
    } else {
        formTitle.innerHTML = '<i class="fas fa-user-plus"></i> เพิ่มช่างใหม่';
        formSubtitle.innerText = 'เพิ่มช่างตัดผมคนใหม่เข้าสู่ร้านของคุณ';
        submitBtn.innerText = 'เพิ่มช่าง';
    }

    // Load Data if Edit Mode
    if (isEdit && window.useBooking) {
        const barbers = window.useBooking.getBarbers();
        currentBarber = barbers.find(b => b.id === barberId);

        if (currentBarber) {
            nameInput.value = currentBarber.name || '';
            serviceInput.value = currentBarber.service || 'ตัดผม';
            feeInput.value = currentBarber.additionalFee || 0;
        } else {
            bpAlert.error('ไม่พบข้อมูล', 'ไม่พบข้อมูลช่างที่ระบุในระบบ').then(() => {
                window.location.href = '/admin/service.html';
            });
        }
    }

    // Handle Form Submit
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (window.useBooking) {
            const barberData = {
                name: nameInput.value.trim(),
                service: serviceInput.value.trim(),
                additionalFee: parseInt(feeInput.value) || 0,
                active: true
            };

            // Basic Validation
            if (!barberData.name || !barberData.service) {
                bpAlert.error('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ครบถ้วนด้วยครับผม');
                return;
            }

            if (isEdit) {
                window.useBooking.updateBarber(barberId, barberData);
                bpAlert.success('บันทึกสำเร็จ', 'ข้อมูลช่างได้รับการอัปเดตเรียบร้อยแล้ว').then(() => {
                    window.location.href = '/admin/service.html';
                });
            } else {
                window.useBooking.addBarber(barberData);
                bpAlert.success('เพิ่มสำเร็จ', 'เพิ่มช่างคนใหม่เข้าสู่ระบบเรียบร้อยแล้ว').then(() => {
                    window.location.href = '/admin/service.html';
                });
            }
        }
    });
});
