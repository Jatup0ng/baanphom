// 1. ฟังก์ชันเปิด Popup
    function openLogin() {
        document.getElementById("loginModal").style.display = "flex";
    }

    // 2. ฟังก์ชันปิด Popup
    function closeLogin() {
        document.getElementById("loginModal").style.display = "none";
    }

    // 3. (เสริม) คลิกพื้นที่ว่างๆ รอบนอกเพื่อปิด
    window.onclick = function(event) {
        let modal = document.getElementById("loginModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    
    