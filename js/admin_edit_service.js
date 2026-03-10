document.addEventListener("DOMContentLoaded", () => {
    const editForm = document.getElementById('edit-service-form');
    const nameInput = document.getElementById('service-name');
    const descInput = document.getElementById('service-desc');
    const priceInput = document.getElementById('service-price');
    const durationInput = document.getElementById('service-duration');
    const imgPreview = document.getElementById('service-img-preview');
    const fileInput = document.getElementById('service-image-input');
    const imageBtn = document.getElementById('image-preview-btn');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const submitBtn = document.getElementById('submit-btn');

    // Get Service ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    const isEdit = !!serviceId;

    let currentService = null;
    let base64Image = null;

    // Update UI based on mode
    if (isEdit) {
        formTitle.innerHTML = '<i class="fas fa-edit"></i> แก้ไขข้อมูลบริการ';
        formSubtitle.innerText = 'ปรับแต่งรายละเอียดบริการของคุณให้ดูน่าสนใจ';
        submitBtn.innerText = 'บันทึกการเปลี่ยนแปลง';
    } else {
        formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> เพิ่มบริการใหม่';
        formSubtitle.innerText = 'สร้างบริการใหม่ให้ลูกค้าของคุณเลือกจอง';
        submitBtn.innerText = 'เพิ่มบริการ';
    }

    // Load Data if Edit Mode
    if (isEdit && window.useBooking) {
        const services = window.useBooking.getServices();
        currentService = services.find(s => s.id === serviceId);

        if (currentService) {
            nameInput.value = currentService.name || '';
            descInput.value = currentService.desc || '';
            priceInput.value = currentService.price || '';
            durationInput.value = currentService.duration || '';
            imgPreview.src = currentService.image || '/images/s.png';
            base64Image = currentService.image;
        } else {
            bpAlert.error('ไม่พบข้อมูล', 'ไม่พบบริการที่ระบุในระบบ').then(() => {
                window.location.href = '/admin/service.html';
            });
        }
    }

    // Handle Image Selection
    imageBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                base64Image = event.target.result;
                imgPreview.src = base64Image;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Form Submit
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (window.useBooking) {
            const serviceData = {
                name: nameInput.value.trim(),
                desc: descInput.value.trim(),
                price: priceInput.value.trim(),
                duration: durationInput.value.trim(),
                image: base64Image || '/images/s.png',
                active: true
            };

            // Basic Validation
            if (!serviceData.name || !serviceData.price || !serviceData.duration) {
                bpAlert.error('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
                return;
            }

            if (isEdit) {
                window.useBooking.updateService(serviceId, serviceData);
                bpAlert.success('บันทึกสำเร็จ', 'ข้อมูลบริการได้รับการอัปเดตเรียบร้อยแล้ว').then(() => {
                    window.location.href = '/admin/service.html';
                });
            } else {
                window.useBooking.addService(serviceData);
                bpAlert.success('เพิ่มสำเร็จ', 'เพิ่มบริการใหม่เข้าสู่ระบบเรียบร้อยแล้ว').then(() => {
                    window.location.href = '/admin/service.html';
                });
            }
        }
    });
});
