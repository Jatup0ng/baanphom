document.addEventListener("DOMContentLoaded", () => {
    // Gatekeeper setup isn't explicitly there but good practice based on userName
    const currentName = localStorage.getItem("userName");

    // DOM Elements
    const nameInput = document.getElementById("profile-name");
    const passInput = document.getElementById("profile-pass");
    const navName = document.getElementById("user-name-display");

    const btnEditName = document.getElementById("btn-edit-name");
    const iconEditName = btnEditName.querySelector("i");
    const textEditName = document.getElementById("text-edit-name");

    const btnEditPass = document.getElementById("btn-edit-pass");
    const iconEditPass = btnEditPass.querySelector("i");
    const textEditPass = document.getElementById("text-edit-pass");

    // State Variables
    let isEditingName = false;
    let isEditingPass = false;

    // Initialization
    nameInput.value = currentName || "Guest";

    // Edit Name Logic
    btnEditName.addEventListener("click", () => {
        if (!isEditingName) {
            // Enter edit mode
            isEditingName = true;
            nameInput.readOnly = false;
            nameInput.style.borderColor = "#007bff";
            btnEditName.style.color = "#28a745";
            iconEditName.className = "fas fa-save";
            textEditName.innerText = "บันทึก";
            nameInput.focus();
        } else {
            // Save mode
            if (nameInput.value.trim() === "") {
                alert("กรุณากรอกชื่อ");
                return;
            }

            localStorage.setItem("userName", nameInput.value);
            if (navName) navName.innerText = nameInput.value;

            isEditingName = false;
            nameInput.readOnly = true;
            nameInput.style.borderColor = "#8B5E3C";
            btnEditName.style.color = "#5D3A1A";
            iconEditName.className = "fas fa-edit";
            textEditName.innerText = "แก้ไข";

            alert("บันทึกชื่อเรียบร้อยแล้ว!");
        }
    });

    // Edit Password Logic
    btnEditPass.addEventListener("click", () => {
        if (!isEditingPass) {
            // Enter edit mode
            isEditingPass = true;
            passInput.readOnly = false;
            passInput.type = "text";
            passInput.style.borderColor = "#007bff";
            btnEditPass.style.color = "#28a745";
            iconEditPass.className = "fas fa-save";
            textEditPass.innerText = "บันทึก";
            passInput.focus();
        } else {
            // Save mode
            isEditingPass = false;
            passInput.readOnly = true;
            passInput.type = "password";
            passInput.style.borderColor = "#8B5E3C";
            btnEditPass.style.color = "#5D3A1A";
            iconEditPass.className = "fas fa-edit";
            textEditPass.innerText = "แก้ไข";

            alert("บันทึกรหัสผ่านเรียบร้อยแล้ว!");
        }
    });
});
