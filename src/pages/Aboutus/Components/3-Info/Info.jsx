import React from 'react'
import './info.css'
import Lottie from 'lottie-react';
import contactAnimation from '../../../../../public/animation/about.json'

export default function Info() {
  return (
    <section className='homeServ'>
      <div className="flex container">
        <div className="RightSec">
          <div className="flex title">
            <div className="image">
              <img src="./images/logohand.png" alt="logo" />
            </div>
            <h3>خدمات منزلية</h3>
          </div>
          <div className="flex pack">
            <div className="imageIc">
              <img src="./images/Technical Support.png" alt="logo" />
            </div>
            <div className="text">
              <h4>الاستشارة المبكرة</h4>
              <p>يتيح لك قسم الاستشارة المبكرة طرح استفساراتك وتحديد احتياجاتك قبل بدء الخدمة، وذلك لمساعدتك على اختيار الأنسب لك وتوضيح التفاصيل المطلوبة. سواء كنت بحاجة إلى أعمال سباكة، نجارة، أو كهرباء، فإن خبراءنا مستعدون لتقديم النصيحة لضمان جودة الخدمة وتلبية توقعاتك.</p>
            </div>
          </div>
          <div className="flex pack">
            <div className="imageIc">
              <img src="./images/Solution.png" alt="logo" />
            </div>
            <div className="text">
              <h4>حلول مخصصة</h4>
              <p>خدمات مصممة خصيصاً لتلبية احتياجاتك الفردية، سواء في أعمال السباكة، النجارة، أو الكهرباء. نعمل معك لضمان أن كل خدمة تلبي متطلباتك بدقة، مع ضمان أعلى مستويات الجودة والاحترافية</p>
            </div>
          </div>
          <div className="flex pack">
            <div className="imageIc">
              <img src="./images/Discount.png" alt="logo" />
            </div>
            <div className="text">
              <h4>افضل الاسعار</h4>
              <p> نضمن لك الحصول على خدمات عالية الجودة بأسعار تنافسية تتناسب مع ميزانيتك. نسعى لتقديم حلول فعّالة تلبي احتياجاتك بأفضل قيمة ممكنة.</p>
            </div>
          </div>
        </div>
        <div className="LeftSec">
           <div className='animation'>
             <Lottie className='aboutAnimation' animationData={contactAnimation} />
           </div>
        </div>
      </div>
    </section>
  )
}
