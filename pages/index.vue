
<template>

  <header class="hero" style="background-image: url('/background01.jpg');">
    <div class="hero-content">
      <div class="hero-title">
        Classic Cuts<br>
        <span>Modern Style</span>
      </div>
      <NuxtLink to="/booking/book">
        <button class="book-btn">
          <i class="fas fa-calendar-check"></i> BOOK NOW
        </button>
      </NuxtLink>
    </div>
  </header>


  <section>
    <h2 class="section-title">บริการของเรา</h2>

    <div class="service-card">
      <img
        src="https://scontent.xx.fbcdn.net/v/t1.15752-9/621157830_1432653738395100_1949126408221735019_n.png?_nc_cat=106&ccb=1-7&_nc_sid=fc17b8&efg=eyJxZV9ncm91cHMiOlsiaWdkX2Jlc3RfZWZmb3J0X2ltYWdlOmNvbnRyb2wiXX0%3D&_nc_ohc=-E-1dmraQ0UQ7kNvwELqQdn&_nc_oc=AdlSMawBksKepo2SZD3S5gqpo0IFXWAOL4gIM3cKDNCHTd7tIDNwoRRsvEoPyGRuxT2sQrWgsUOGMcNvk3ySVW-k&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD4QEyoxIUzElK2-sHp8d7LyE2w9dxmOPXmj5Huh7J7hHZJQ&oe=699C1A9C"
        alt="ตัดผมชาย" class="service-img">

      <div class="service-info" style="flex: 1;">
        <h3>ตัดผมชาย</h3>
        <p class="service-desc">ตัดผมพร้อมบริการสระและไดร์ หล่อพร้อมเที่ยว ในราคาเดียว</p>
        <div class="service-price">ราคา 150 บาท</div>

        <div class="service-action">
          <span class="duration"><i class="far fa-clock"></i> 60 นาที</span>
          <NuxtLink to="/booking/book">
            <button class="btn-outline">จองเลย</button>
          </NuxtLink>

        </div>
      </div>
    </div>
  </section>

  <section>
    <h2 class="section-title">รีวิว</h2>

    <div class="reviews-container">
      <div class="review-card">
        <div class="reviewer">
          <img
            src="https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.15752-9/615793269_946552197768704_4234719763029757796_n.png?_nc_cat=105&ccb=1-7&_nc_sid=fc17b8&efg=eyJxZV9ncm91cHMiOlsiaWdkX2Jlc3RfZWZmb3J0X2ltYWdlOmNvbnRyb2wiXX0%3D&_nc_ohc=j98Nnqv4ebwQ7kNvwE-bar3&_nc_oc=AdlLzw3lMnIHown2x4qNA6GvG1aoZ-cHM4g_pxuNLZ7QvYnuMHKVAsdSaNfEpdMHL2Y&_nc_zt=23&_nc_ht=scontent.fcnx2-1.fna&oh=03_Q7cD4QGfnXL29fKvUwsVF2N9TuOucHUB6DSy_7mfLZtWvtRgJQ&oe=699C294C"
            alt="User" class="avatar">
          <div class="reviewer-info">
            <h4>snack007</h4>
            <div class="stars">★★★★★ 2 วันที่แล้ว</div>
          </div>
        </div>
        <p class="review-text">บริการดีมากครับ ช่างตัดละเอียด ตรงตามบรีฟ แนะนำเลยครับ</p>
      </div>

      <div class="review-card">
        <div class="reviewer">
          <img
            src="https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.15752-9/616235027_860735463446775_422928689241598845_n.png?_nc_cat=109&ccb=1-7&_nc_sid=fc17b8&efg=eyJxZV9ncm91cHMiOlsiaWdkX2Jlc3RfZWZmb3J0X2ltYWdlOmNvbnRyb2wiXX0%3D&_nc_ohc=59w17VtN5rAQ7kNvwG4FY4J&_nc_oc=Adl9rAZd0NthxHOk2ZZIPlfrId9k3mdxV7OuCnHWkJ6eq82act0Xfpl5lONMt6oi6bs&_nc_zt=23&_nc_ht=scontent.fcnx2-1.fna&oh=03_Q7cD4QHQHeiYq7hgbn5twnhaHN-nWFMkVbCECsMQ39hqXbm9Ag&oe=699C26C1"
            alt="User" class="avatar">
          <div class="reviewer-info">
            <h4>C lnwza</h4>
            <div class="stars">★★★★★ 1 สัปดาห์</div>
          </div>
        </div>
        <p class="review-text">ร้านสะอาด บรรยากาศดีครับ ระบบจองคิวสะดวกไม่ต้องรอนาน</p>
      </div>

      <div class="review-card">
        <div class="reviewer">
          <img
            src="https://scontent.xx.fbcdn.net/v/t1.15752-9/619190345_3254859248029202_6607263092285736235_n.png?_nc_cat=101&ccb=1-7&_nc_sid=9f807c&_nc_ohc=VvUp4ci2ZVsQ7kNvwFARKlB&_nc_oc=AdkPSPLukrtFEIxAf74FjOy8VHF6SnWvR_XuvZMMRXF0UXKPmSHPWEqAfZ7d2SbnVw2bIEJWpbf-pXdnb-GzXbd_&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD4QGL0Lbvw7kZxU-gpzcB8PmAg9dRE9AjeRnuZ1rVtMmchg&oe=699C05ED"
            alt="User" class="avatar">
          <div class="reviewer-info">
            <h4>moterzaza</h4>
            <div class="stars">★★★★★ 2 สัปดาห์</div>
          </div>
        </div>
        <p class="review-text">ตัดทรงวินเทจสวยครับ ราคาไม่แพง คุ้มค่ามาก</p>
      </div>
    </div>
  </section>




</template>
