// ==========================================
// BAAN PHOM — Profile Page Logic (data.js)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ---- Load current user ----
    const currentUser = JSON.parse(localStorage.getItem("bp_currentUser") || "null");

    if (!currentUser) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "/index.html";
        return;
    }

    // ---- DOM Elements ----
    const firstnameInput = document.getElementById("profile-firstname");
    const lastnameInput = document.getElementById("profile-lastname");
    const phoneInput = document.getElementById("profile-phone");
    const emailInput = document.getElementById("profile-email");
    const passInput = document.getElementById("profile-pass");

    const btnEditFirstname = document.getElementById("btn-edit-firstname");
    const btnEditLastname = document.getElementById("btn-edit-lastname");
    const btnEditPass = document.getElementById("btn-edit-pass");
    const textEditFirstname = document.getElementById("text-edit-firstname");
    const textEditLastname = document.getElementById("text-edit-lastname");
    const textEditPass = document.getElementById("text-edit-pass");

    // ---- Populate fields ----
    if (firstnameInput) firstnameInput.value = currentUser.firstName || "";
    if (lastnameInput) lastnameInput.value = currentUser.lastName || "";
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
        // Update nav display: show only firstName
        localStorage.setItem("userName", currentUser.firstName);
    }

    // ---- Edit First Name ----
    setupInlineEdit("profile-firstname", "firstName", "btn-edit-firstname", "text-edit-firstname", {
        validate: (val) => {
            if (!val) { alert("กรุณากรอกชื่อ"); return false; }
            return true;
        },
        onSave: () => {
            const navDisplay = document.getElementById("user-name-display");
            if (navDisplay) navDisplay.innerText = currentUser.firstName;
        }
    });

    // ---- Edit Last Name ----
    setupInlineEdit("profile-lastname", "lastName", "btn-edit-lastname", "text-edit-lastname");

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
                if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(newPass)) {
                    alert("รหัสผ่านต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น");
                    return;
                }
                if (newPass.length < 8) {
                    alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
                    return;
                }
                if (!/[A-Z]/.test(newPass)) {
                    alert("รหัสผ่านต้องมีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว");
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

    // ---- Generic inline edit helper ----
    function setupInlineEdit(inputId, fieldKey, btnId, textId, options = {}) {
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
                if (options.validate) {
                    if (!options.validate(val)) return;
                } else {
                    if (!val && fieldKey !== "lastName") { alert("กรุณากรอกข้อมูล"); return; }
                }
                saveField(fieldKey, val);
                if (options.onSave) options.onSave();
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
