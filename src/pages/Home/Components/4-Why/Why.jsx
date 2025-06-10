import React from 'react'
import './why.css'

export default function Why() {
  return (
    <section>
      <div className="WHY">
        <div className="flex why">
          <div className="whyImg">
            <img src="./images/why.png" alt="Why" />
          </div>
          <div className="title">
            <h3>
            لماذا تختارنا    
            <span>؟</span>
            </h3>
          </div>
        </div>

          <div className="flex pack">
             <div className="card">
              <div className="image">
                <img src="./images/Trust.png" alt="Icon" />
              </div>
              <div className="text">
                <h4>لماذا نحن الأفضل</h4>
                <p>لأننا نقدم خدمات موثوقة وعالية الجودة على يد فريق من الخبراء المحترفين. نحرص على تلبية احتياجاتك بسرعة وفعالية، مع التزام كامل بالشفافية والاحترافية في كل     .</p>
              
              </div>
            </div>
            <div className="card">
              <div className="image">
                <img src="./images/Protect.png" alt="Icon" />
              </div>
              <div className="text">
                <h4>الفنيين المرخصين</h4>
                <p>يضم فريقنا فنيين مرخصين يمتلكون الخبرة والكفاءة اللازمة لتنفيذ جميع الخدمات بأعلى معايير الجودة والسلامة، مما يضمن حصولك على خدمة موثوقة وآمنة.</p>
              
              </div>
            </div>
            <div className="card">
              <div className="image">
                <img src="./images/Facebook Like.png" alt="Icon" />
              </div>
              <div className="text">
                <h4>خدمة ذات تقييم عالي</h4>
                <p>نفتخر بتقديم خدمة ذات تقييم عالي تعكس رضا عملائنا وثقتهم بجودة خدماتنا. نسعى دائمًا للحفاظ على مستوى عالٍ من الاحترافية لضمان تجربة مميزة لكل عميل.</p>
              </div>
            </div>
            <div className="card">
              <div className="image">
                <img src="./images/Time Machine.png" alt="Icon" />
              </div>
              <div className="text">
                <h4> الوقت المناسب</h4>
                <p>نحرص على تقديم خدماتنا في الوقت المناسب لتلبية احتياجاتك دون تأخير، مع مراعاة جدولك وضمان تنفيذ الخدمة بسرعة وكفاءة</p>              
              </div>
            </div>
        </div>

      </div>
    </section>
  )
}
