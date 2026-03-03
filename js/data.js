// ==========================================
// BAAN PHOM — Profile Page Logic (data.js)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ---- Load current user ----
    const currentUser = JSON.parse(localStorage.getItem("bp_currentUser") || "null");

    if (!currentUser) {
        // Not logged in — redirect to home
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "/index.html";
        return;
    }

    // ---- DOM Elements ----
    const nameInput = document.getElementById("profile-name");
    const phoneInput = document.getElementById("profile-phone");
    const emailInput = document.getElementById("profile-email");
    const passInput = document.getElementById("profile-pass");

    const btnEditName = document.getElementById("btn-edit-name");
    const btnEditPass = document.getElementById("btn-edit-pass");
    const textEditName = document.getElementById("text-edit-name");
    const textEditPass = document.getElementById("text-edit-pass");

    // ---- Populate fields ----
    if (nameInput) nameInput.value = currentUser.firstName + " " + currentUser.lastName;
    if (phoneInput) phoneInput.value = currentUser.phone || "";
    if (emailInput) emailInput.value = currentUser.email || "";
    if (passInput) passInput.value = currentUser.password || "";

    // ---- Helper: sync save to users array + currentUser ----
    function saveField(field, value) {
        const users = JSON.parse(localStorage.getItem("bp_users") || "[]");
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx !== -1) {
            users[idx][field] = value;
            localStorage.setItem("bp_users", JSON.stringify(users));
        }
        currentUser[field] = value;
        localStorage.setItem("bp_currentUser", JSON.stringify(currentUser));
        // Also update nav display name if name changed
        localStorage.setItem("userName", currentUser.firstName + " " + currentUser.lastName);
    }

    // ---- Edit Name ----
    let isEditingName = false;
    if (btnEditName) {
        btnEditName.addEventListener("click", () => {
            if (!isEditingName) {
                isEditingName = true;
                nameInput.readOnly = false;
                nameInput.style.borderColor = "#007bff";
                btnEditName.style.color = "#28a745";
                btnEditName.querySelector("i").className = "fas fa-save";
                textEditName.innerText = "บันทึก";
                nameInput.focus();
            } else {
                const fullName = nameInput.value.trim();
                if (!fullName) { alert("กรุณากรอกชื่อ"); return; }
                const parts = fullName.split(" ");
                const firstName = parts[0];
                const lastName = parts.slice(1).join(" ") || currentUser.lastName;
                saveField("firstName", firstName);
                saveField("lastName", lastName);

                // Update nav
                const navDisplay = document.getElementById("user-name-display");
                if (navDisplay) navDisplay.innerText = firstName + " " + lastName;

                isEditingName = false;
                nameInput.readOnly = true;
                nameInput.style.borderColor = "#8B5E3C";
                btnEditName.style.color = "#5D3A1A";
                btnEditName.querySelector("i").className = "fas fa-edit";
                textEditName.innerText = "แก้ไข";
                alert("บันทึกชื่อเรียบร้อยแล้ว!");
            }
        });
    }

    // ---- Edit Password ----
    let isEditingPass = false;
    if (btnEditPass) {
        btnEditPass.addEventListener("click", () => {
            if (!isEditingPass) {
                isEditingPass = true;
                passInput.readOnly = false;
                passInput.type = "text";
                passInput.style.borderColor = "#007bff";
                btnEditPass.style.color = "#28a745";
                btnEditPass.querySelector("i").className = "fas fa-save";
                textEditPass.innerText = "บันทึก";
                passInput.focus();
            } else {
                const newPass = passInput.value;
                if (newPass.length < 8) {
                    alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
                    return;
                }
                saveField("password", newPass);

                isEditingPass = false;
                passInput.readOnly = true;
                passInput.type = "password";
                passInput.style.borderColor = "#8B5E3C";
                btnEditPass.style.color = "#5D3A1A";
                btnEditPass.querySelector("i").className = "fas fa-edit";
                textEditPass.innerText = "แก้ไข";
                alert("บันทึกรหัสผ่านเรียบร้อยแล้ว!");
            }
        });
    }

    // ---- Edit Phone (with inline toggle) ----
    setupInlineEdit("profile-phone", "phone", "btn-edit-phone", "text-edit-phone");

    // ---- Edit Email (with inline toggle) ----
    setupInlineEdit("profile-email", "email", "btn-edit-email", "text-edit-email");

    function setupInlineEdit(inputId, fieldKey, btnId, textId) {
        const inp = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        const txt = document.getElementById(textId);
        if (!inp || !btn) return;
        let editing = false;
        btn.addEventListener("click", () => {
            if (!editing) {
                editing = true;
                inp.readOnly = false;
                inp.style.borderColor = "#007bff";
                btn.style.color = "#28a745";
                btn.querySelector("i").className = "fas fa-save";
                if (txt) txt.innerText = "บันทึก";
                inp.focus();
            } else {
                const val = inp.value.trim();
                if (!val) { alert("กรุณากรอกข้อมูล"); return; }
                saveField(fieldKey, val);
                editing = false;
                inp.readOnly = true;
                inp.style.borderColor = "#8B5E3C";
                btn.style.color = "#5D3A1A";
                btn.querySelector("i").className = "fas fa-edit";
                if (txt) txt.innerText = "แก้ไข";
                alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
            }
        });
    }
});
