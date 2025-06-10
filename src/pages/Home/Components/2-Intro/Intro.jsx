import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./intro.css";

export default function Intro() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const navigate = useNavigate(); // React Router navigation

  // Function to close both modals
  const closeModals = () => {
    setShowLoginOptions(false);
    setShowSignupOptions(false);
  };

  return (
    <div className='Intro'>
      <div className="overlay"></div>

      <video className="bg-video" autoPlay muted>
        <source src="./videos/home.mp4" type="video/mp4" />
      </video>

      <div className="TextonVideo">
        <h1>جاهزين لخدمتك !</h1>
        <p>احجز أفضل الصنايعية لخدمات الصيانة المنزلية <br /> بسهولة وأمان، ووفر وقتك وجهدك مع حِرَفِـي </p>
      </div>

      <div className="buttons flex">
        <button 
          className='login' 
          onClick={() => {
            setShowLoginOptions(true);
            setShowSignupOptions(false);
          }}
        >
          تسجيل الدخول    
        </button>

        <button 
          className='signup' 
          onClick={() => {
            setShowSignupOptions(true);
            setShowLoginOptions(false);
          }}
        >
          انشاء حساب جديد     
        </button>
      </div>

      {/* Show login options when login button is clicked */}
      {showLoginOptions && (
        <div className="bgUserTech" onClick={closeModals}>
          <div className="UserOrTechLog" onClick={(e) => e.stopPropagation()}>
            <div className="titlee">
              <h6>تسجيل الدخول ك </h6>
            </div>
            <button onClick={() => navigate('/UserLog')}>مستخدم</button>
            <button onClick={() => navigate('/TechLog')}>فني</button>
          </div>
        </div>
      )}

      {/* Show signup options when signup button is clicked */}
      {showSignupOptions && (
        <div className="bgUserTech" onClick={closeModals}>
          <div className="UserOrTechReg" onClick={(e) => e.stopPropagation()}>
            <div className="titlee">
              <h6>انشاء حساب جديد ل</h6>
            </div>
            <button onClick={() => navigate('/UserReg')}>مستخدم</button>
            <button onClick={() => navigate('/TechReg')}>فني</button>
          </div>
        </div>
      )}
    </div>
  );
}
