// Layout Logic (Navbar, Modals, Auth) extracted from layouts/default.vue

function openLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "flex";
}

function closeLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
}

function openRegister() {
    const modal = document.getElementById("registerModal");
    if (modal) modal.style.display = "flex";
}

function closeRegister() {
    const modal = document.getElementById("registerModal");
    if (modal) modal.style.display = "none";
}

function updateNavToMember(name) {
    let guestNav = document.getElementById("guest-nav");
    let memberNav = document.getElementById("member-nav");
    let nameDisplay = document.getElementById("user-name-display");

    if (guestNav) guestNav.style.display = "none";
    if (memberNav) memberNav.style.display = "inline-block";
    if (nameDisplay) nameDisplay.innerText = name;
}

function updateNavToGuest() {
    let guestNav = document.getElementById("guest-nav");
    let memberNav = document.getElementById("member-nav");

    if (guestNav) guestNav.style.display = "inline";
    if (memberNav) memberNav.style.display = "none";
}

function checkLoginStatus() {
    let status = localStorage.getItem("isLoggedIn");
    let name = localStorage.getItem("userName");

    if (status === "yes") {
        updateNavToMember(name);
    } else {
        updateNavToGuest();
    }
}

function performLogin() {
    let inputField = document.getElementById("username-input");

    // Safety check
    if (!inputField) {
        console.error("No username input found");
        return;
    }

    let nameValue = inputField.value;
    let passwordValue = document.getElementById("password-input").value;

    if (!nameValue || nameValue.trim() === "") {
        // If empty name, default to User, unless attempting admin login
        nameValue = "User";
    }

    // Admin Login Check
    if (nameValue === 'admin' && passwordValue === '12345678') {
        localStorage.setItem("isAdminAuthenticated", "true");
        window.location.href = "/admin/adminhome.html";
        return;
    }

    // Normal User Login
    localStorage.setItem("isLoggedIn", "yes");
    localStorage.setItem("userName", nameValue);

    updateNavToMember(nameValue);
    closeLogin();
}

function toggleDropdown() {
    let dropdown = document.getElementById("userDropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

function logout() {
    if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        window.location.href = "/index.html";
    }
}

// Ensure the functions are available globally for inline onclick handlers
window.openLogin = openLogin;
window.closeLogin = closeLogin;
window.openRegister = openRegister;
window.closeRegister = closeRegister;
window.performLogin = performLogin;
window.toggleDropdown = toggleDropdown;
window.logout = logout;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Check status on load
    checkLoginStatus();

    // 2. Window click listener for closing modals/dropdowns
    window.onclick = function (event) {
        let loginModal = document.getElementById("loginModal");
        let registerModal = document.getElementById("registerModal");
        let dropdowns = document.getElementsByClassName("dropdown-content");

        // 1. Click background to close Login
        if (loginModal && event.target == loginModal) {
            loginModal.style.display = "none";
        }

        // 2. Click background to close Register
        if (registerModal && event.target == registerModal) {
            registerModal.style.display = "none";
        }

        // 3. Click outside to close Dropdown
        if (!event.target.closest('.menu-icon')) {
            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
});
