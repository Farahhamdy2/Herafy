import React from 'react';
import { useNavigate } from 'react-router-dom';
import './services.css';

export default function Services() {
  const navigate = useNavigate();

  return (
    <section className='container'>
      <div className="title">
        <h5>ابدأ اليوم</h5>
        <h2>خدمات حِرَفِـي</h2>
        <p>
          يقدم الموقع مجموعة متنوعة من الخدمات تشمل السباكة، والنجارة، والأعمال الكهربائية، لتلبية احتياجات العملاء بكل احترافية وسهولة.
          احجز خدمتك الآن <br /> واستمتع بجودة عالية وسرعة في التنفيذ.
        </p>
      </div>

      <div className="cards flex">
        <div className="card" onClick={() => navigate('/Painting')}>
          <div className="image">
            <img src="./images/painting.png" alt="painting" />
          </div>
          <div className="text">
            <h5>نقاش</h5>
            <button className='reserve'>احجز الان</button>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/Plumbing')}>
          <div className="image">
            <img src="./images/plumbing.png" alt="plumbing" />
          </div>
          <div className="text">
            <h5>سباك</h5>
            <button className='reserve'>احجز الان</button>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/Electric')}>
          <div className="image img1">
            <img src="./images/electric.png" alt="electric" />
          </div>
          <div className="text">
            <h5 className='edit1'>كهربائـي</h5>
            <button className='reserve'>احجز الان</button>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/Carpentry')}>
          <div className="image img2">
            <img src="./images/carpentry.png" alt="carpentry" />
          </div>
          <div className="text">
            <h5 className='edit2'>نجـــار</h5>
            <button className='reserve'>احجز الان</button>
          </div>
        </div>
      </div>
    </section>
  );
}
