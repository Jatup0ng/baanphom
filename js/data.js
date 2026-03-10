// ==========================================
// BAAN PHOM — Profile Page Logic (data.js)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ---- Load current user ----
    const currentUser = JSON.parse(localStorage.getItem("bp_currentUser") || "null");

    if (!currentUser) {
        bpAlert.error("⛔ เข้าสู่ระบบ", "กรุณาเข้าสู่ระบบก่อนดำเนินการต่อครับผม").then(() => {
            window.location.href = "/index.html";
        });
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
            if (!val) { bpAlert.error("ข้อมูลไม่ครบ", "กรุณากรอกชื่อด้วยครับผม"); return false; }
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
    const togglePassBtn = document.getElementById("toggle-pass-visibility");

    if (togglePassBtn && passInput) {
        togglePassBtn.addEventListener("click", () => {
            if (passInput.type === "password") {
                passInput.type = "text";
                togglePassBtn.className = "fas fa-eye";
                togglePassBtn.title = "ซ่อนรหัสผ่าน";
            } else {
                passInput.type = "password";
                togglePassBtn.className = "fas fa-eye-slash";
                togglePassBtn.title = "แสดงรหัสผ่าน";
            }
        });
    }

    if (btnEditPass) {
        btnEditPass.addEventListener("click", () => {
            if (!isEditingPass) {
                isEditingPass = true;
                passInput.readOnly = false;
                // Keep input type as password initially, let user toggle it
                passInput.type = "password";
                passInput.style.borderColor = "#007bff";
                btnEditPass.style.color = "#28a745";
                btnEditPass.querySelector("i").className = "fas fa-save";
                textEditPass.innerText = "บันทึก";

                if (togglePassBtn) {
                    togglePassBtn.style.display = "block";
                    togglePassBtn.className = "fas fa-eye-slash";
                }

                passInput.focus();
            } else {
                const newPass = passInput.value;
                if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(newPass)) {
                    bpAlert.error("รหัสผ่านไม่ปลอดภัย", "รหัสผ่านต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้นครับผม");
                    return;
                }
                if (newPass.length < 8) {
                    bpAlert.error("รหัสผ่านสั้นเกินไป", "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรครับผม");
                    return;
                }
                if (!/[A-Z]/.test(newPass)) {
                    bpAlert.error("รหัสผ่านไม่ถูกต้อง", "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัวครับผม");
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

                if (togglePassBtn) togglePassBtn.style.display = "none";

                bpAlert.success("บันทึกสำเร็จ", "บันทึกรหัสผ่านใหม่เรียบร้อยแล้วครับผม");
            }
        });
    }

    // ---- Edit Phone (with inline toggle) ----
    setupInlineEdit("profile-phone", "phone", "btn-edit-phone", "text-edit-phone", {
        validate: (val) => {
            if (!val) { bpAlert.error("ข้อมูลไม่ครบ", "กรุณากรอกเบอร์โทรศัพท์ด้วยครับผม"); return false; }
            if (val.length !== 10 || !/^[0-9]+$/.test(val)) {
                bpAlert.error("ข้อมูลไม่ถูกต้อง", "กรุณากรอกเบอร์โทรให้ถูกต้อง (ตัวเลข 10 หลัก) ครับผม");
                return false;
            }
            // Duplicate check
            const users = JSON.parse(localStorage.getItem("bp_users") || "[]");
            const duplicate = users.find(u => u.phone === val && u.email !== currentUser.email);
            if (duplicate) {
                bpAlert.error("เบอร์ซ้ำในระบบ", "เบอร์โทรศัพท์นี้ถูกใช้งานแล้วครับผม");
                return false;
            }
            return true;
        }
    });

    // ---- Edit Email (with inline toggle) ----
    setupInlineEdit("profile-email", "email", "btn-edit-email", "text-edit-email", {
        validate: (val) => {
            if (!val) { bpAlert.error("ข้อมูลไม่ครบ", "กรุณากรอกอีเมลด้วยครับผม"); return false; }
            if (!val.includes("@")) {
                bpAlert.error("รูปแบบไม่ถูกต้อง", "กรุณากรอกอีเมลให้ถูกต้องด้วยครับผม");
                return false;
            }
            // Duplicate check
            const users = JSON.parse(localStorage.getItem("bp_users") || "[]");
            const duplicate = users.find(u => u.email === val && u.email !== currentUser.email);
            if (duplicate) {
                bpAlert.error("อีเมลซ้ำในระบบ", "อีเมลนี้ถูกใช้งานไปแล้วครับผม");
                return false;
            }
            return true;
        }
    });

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
                    if (!val && fieldKey !== "lastName") { bpAlert.error("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบถ้วนด้วยครับผม"); return; }
                }
                saveField(fieldKey, val);
                if (options.onSave) options.onSave();
                editing = false;
                inp.readOnly = true;
                inp.style.borderColor = "#8B5E3C";
                btn.style.color = "#5D3A1A";
                btn.querySelector("i").className = "fas fa-edit";
                if (txt) txt.innerText = "แก้ไข";
                bpAlert.success("บันทึกสำเร็จ", "ข้อมูลได้รับการบันทึกเรียบร้อยแล้วครับผม");
            }
        });
    }
});
