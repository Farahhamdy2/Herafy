import React from 'react'
import './footer.css'

export default function Footer() {
  return (
    <section className='footer'>
      <div className="flex foot">
        <div className="herafy">
          <div className="flex tit">
            <div className="logo">
              <img src="./images/logo light.png" alt="logo" />
            </div>
            <h3>حِرَفِـي</h3>
          </div>
          <p>خدمتنا عبر الموقع تتيح لك حجز أفضل الحرفيين <br/> المتخصصين في النجارة، السباكة، والكهرباء بكل <br/> سهولة. اختر الخدمة، حدد الموعد المناسب، وتابع <br/> تقدم العمل حتى الانتهاء، مع إمكانية تقييم <br/> الخدمة والاحتفاظ بالسجل للرجوع إليه لاحقًا.</p>
    
        </div>
        <div className="info">
          <ul>
            <li>معلومة</li>
            <li><a href="">طلب الخدمة</a></li>
            <li><a href="">السباكة التجارية</a></li>
            <li><a href="">عملنا</a></li>
            <li><a href="">ما نقوم به</a></li>
          </ul>
        </div>
        <div className="supp">
          <ul>
            <li>دعم</li>
            <li><a href="">المهن</a></li>
            <li><a href="">اتصال</a></li>
          </ul>
        </div>
        <div className="contact">
          <ul>
            <li>تواصل معنا</li>
            <li><a href="">01002345674</a></li>
            <li><a href="">herfyServices@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="flex end">
        <div className="rights">
          <p>© جميع الحقوق محفوظة</p>
        </div>
        <div className="privacy">
          <p>سياسة الخصوصية - الشروط والأحكام</p>
        </div>
      </div>
    </section>
  )
}
