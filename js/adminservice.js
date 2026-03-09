document.addEventListener("DOMContentLoaded", () => {
    const servicesTbody = document.getElementById('services-tbody');
    const barbersTbody = document.getElementById('barbers-tbody');
    const btnAddBarber = document.getElementById('btn-add-barber');
    const imageInput = document.getElementById('service-image-input');

    let services = [];

    let barbers = [];

    const btnAddService = document.getElementById('btn-add-service');
    let currentEditServiceId = null;
    let currentEditData = null;

    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const base64Image = event.target.result;
                    if (window.useBooking && currentEditServiceId && currentEditData) {
                        currentEditData.image = base64Image;
                        window.useBooking.updateService(currentEditServiceId, currentEditData);
                        loadData();
                    }
                    // Reset input
                    imageInput.value = '';
                    currentEditServiceId = null;
                    currentEditData = null;
                };
                reader.readAsDataURL(file);
            } else {
                // Reset input
                this.value = '';
                currentEditServiceId = null;
                currentEditData = null;
            }
        });
    }

    function loadData() {
        if (window.useBooking) {
            barbers = window.useBooking.getBarbers();
            services = window.useBooking.getServices();
            renderServices();
            renderBarbers();
        }
    }

    function renderServices() {
        servicesTbody.innerHTML = '';
        services.forEach((service, index) => {
            const tr = document.createElement('tr');

            const statusClass = service.active ? 'status-on' : 'status-off';
            const statusText = service.active ? 'เปิด' : 'ปิด';

            tr.innerHTML = `
                <td><img src="${service.image || '/images/s.png'}" class="img-thumb"></td>
                <td><div class="item-name">${service.name}</div><div class="item-desc">${service.desc}</div></td>
                <td>${service.duration}</td>
                <td>${service.price}</td>
                <td>
                    <button class="status-pill ${statusClass}" data-index="${index}">
                        ${statusText}
                    </button>
                </td>
                <td>
                    <div style="display:flex; gap:5px;">
                        <button class="btn-edit-service" data-index="${index}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ffa500; color:white;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete-service" data-index="${index}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ff5252; color:white;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            servicesTbody.appendChild(tr);
        });

        // Attach events
        servicesTbody.querySelectorAll('.status-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                services[idx].active = !services[idx].active;
                if (window.useBooking) {
                    window.useBooking.updateService(services[idx].id, { active: services[idx].active });
                }
                renderServices();
            });
        });
        servicesTbody.querySelectorAll('.btn-edit-service').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                const s = services[idx];
                const newName = prompt('แก้ไขชื่อบริการ:', s.name);
                if (newName) {
                    const newDesc = prompt('แก้ไขรายละเอียดบริการ:', s.desc || '');
                    if (newDesc !== null) {
                        const newPrice = prompt('แก้ไขราคา (บาท):', s.price);
                        if (newPrice) {
                            if (confirm('คุณต้องการเปลี่ยนรูปภาพบริการด้วยหรือไม่?')) {
                                if (imageInput) {
                                    currentEditServiceId = s.id;
                                    currentEditData = { name: newName, desc: newDesc, price: newPrice };
                                    imageInput.click();
                                }
                            } else {
                                if (window.useBooking) {
                                    window.useBooking.updateService(s.id, { name: newName, desc: newDesc, price: newPrice });
                                    loadData();
                                }
                            }
                        }
                    }
                }
            });
        });
        servicesTbody.querySelectorAll('.btn-delete-service').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                if (confirm('คุณต้องการลบบริการนี้ใช่หรือไม่?')) {
                    if (window.useBooking) {
                        window.useBooking.deleteService(services[idx].id);
                        loadData();
                    }
                }
            });
        });
    }

    function renderBarbers() {
        barbersTbody.innerHTML = '';

        if (barbers.length === 0) {
            barbersTbody.innerHTML = `<tr><td colspan="6" class="text-center">ไม่มีข้อมูลช่าง</td></tr>`;
            return;
        }

        barbers.forEach((barber, index) => {
            const tr = document.createElement('tr');

            const statusClass = barber.active ? 'status-on' : 'status-off';
            const statusText = barber.active ? 'พร้อม' : 'ไม่พร้อม';

            tr.innerHTML = `
                <td><div class="item-name">${barber.name}</div><div class="item-desc">ช่างประจำร้าน</div></td>
                <td>ตัดผม</td>
                <td>0 บาท</td>
                <td>
                    <button class="status-pill ${statusClass}" data-index="${index}">
                        ${statusText}
                    </button>
                </td>
                <td>
                    <div style="display:flex; gap:5px;">
                        <button class="btn-edit-barber" data-index="${index}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ffa500; color:white;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete-barber" data-index="${index}" style="cursor:pointer; padding:5px 10px; border-radius:5px; border:1px solid #ccc; background:#ff5252; color:white;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            barbersTbody.appendChild(tr);
        });

        // Attach events
        barbersTbody.querySelectorAll('.status-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                barbers[idx].active = !barbers[idx].active;
                if (window.useBooking) {
                    window.useBooking.saveBarbers(barbers);
                }
                renderBarbers();
            });
        });
        barbersTbody.querySelectorAll('.btn-edit-barber').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                const b = barbers[idx];
                const newName = prompt('แก้ไขชื่อช่างตัดผม:', b.name);
                if (newName && newName.trim() !== '') {
                    if (window.useBooking) {
                        window.useBooking.updateBarber(b.id, newName.trim());
                        loadData();
                    }
                }
            });
        });
        barbersTbody.querySelectorAll('.btn-delete-barber').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                if (confirm('คุณต้องการลบช่างนี้ใช่หรือไม่?')) {
                    if (window.useBooking) {
                        window.useBooking.deleteBarber(barbers[idx].id);
                        loadData();
                    }
                }
            });
        });
    }

    btnAddBarber.addEventListener('click', () => {
        const name = prompt("กรุณากรอกชื่อช่างใหม่:");
        if (name) {
            if (name.trim() === '') return;

            const newB = {
                id: Date.now().toString(),
                name: name.trim(),
                active: true
            };

            if (window.useBooking) {
                window.useBooking.addBarber(newB);
                loadData();
            }
        }
    });

    if (btnAddService) {
        btnAddService.addEventListener('click', () => {
            const name = prompt("กรุณากรอกชื่อบริการใหม่:");
            if (name && name.trim() !== '') {
                const desc = prompt("รายละเอียดบริการ:");
                if (desc !== null) {
                    const price = prompt("ราคา (บาท):");
                    if (price) {
                        const newS = {
                            id: Date.now().toString(),
                            image: '/images/s.png',
                            name: name.trim(),
                            desc: desc.trim(),
                            duration: '60 นาที',
                            price: price + (!price.includes('บาท') ? ' บาท' : ''),
                            active: true
                        };
                        if (window.useBooking) {
                            window.useBooking.addService(newS);
                            loadData();
                        }
                    }
                }
            }
        });
    }

    // Init
    loadData();
});
