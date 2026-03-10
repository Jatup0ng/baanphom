document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const nameInput = document.getElementById("profile-name");
    const passInput = document.getElementById("profile-pass");

    const btnEditName = document.getElementById("btn-edit-name");
    const iconEditName = btnEditName.querySelector("i");
    const textEditName = document.getElementById("text-edit-name");

    const btnEditPass = document.getElementById("btn-edit-pass");
    const iconEditPass = btnEditPass.querySelector("i");
    const textEditPass = document.getElementById("text-edit-pass");

    // State Variables
    let isEditingName = false;
    let isEditingPass = false;

    // Load Initial Data
    nameInput.value = localStorage.getItem("adminName") || "AdminPhontud";
    passInput.value = localStorage.getItem("adminPass") || "12345678";

    // Edit Name Logic
    btnEditName.addEventListener("click", () => {
        if (!isEditingName) {
            isEditingName = true;
            nameInput.readOnly = false;
            nameInput.style.borderColor = "#007bff";
            btnEditName.style.color = "#28a745";
            iconEditName.className = "fas fa-save";
            textEditName.innerText = "บันทึก";
            nameInput.focus();
        } else {
            if (nameInput.value.trim() === "") {
                bpAlert.error("ข้อมูลไม่ครบ", "กรุณากรอกชื่อแอดมินด้วยครับผม");
                return;
            }

            localStorage.setItem("adminName", nameInput.value);

            isEditingName = false;
            nameInput.readOnly = true;
            nameInput.style.borderColor = "#8B5E3C";
            btnEditName.style.color = "#5D3A1A";
            iconEditName.className = "fas fa-edit";
            textEditName.innerText = "แก้ไข";

            bpAlert.success("บันทึกสำเร็จ", "บันทึกชื่อเรียบร้อยแล้วครับผม\n(หากต้องการให้ชื่อมุมขวาบนเปลี่ยนทันที กรุณารีเฟรชหน้าเว็บนะครับ)");
        }
    });

    // Edit Password Logic
    btnEditPass.addEventListener("click", () => {
        if (!isEditingPass) {
            isEditingPass = true;
            passInput.readOnly = false;
            passInput.type = "text";
            passInput.style.borderColor = "#007bff";
            btnEditPass.style.color = "#28a745";
            iconEditPass.className = "fas fa-save";
            textEditPass.innerText = "บันทึก";
            passInput.focus();
        } else {
            if (passInput.value.trim() === "") {
                bpAlert.error("ข้อมูลไม่ครบ", "รหัสผ่านห้ามว่างเปล่าครับผม");
                return;
            }

            localStorage.setItem("adminPass", passInput.value);

            isEditingPass = false;
            passInput.readOnly = true;
            passInput.type = "password";
            passInput.style.borderColor = "#8B5E3C";
            btnEditPass.style.color = "#5D3A1A";
            iconEditPass.className = "fas fa-edit";
            textEditPass.innerText = "แก้ไข";

            bpAlert.success("บันทึกรหัสผ่านสำเร็จ", "บันทึกรหัสผ่านใหม่เรียบร้อยแล้วครับผม\nอย่าลืมจำรหัสผ่านใหม่สำหรับการเข้าระบบครั้งถัดไปนะครับ");
        }
    });
});
