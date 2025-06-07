import React from 'react'
import './complaint.css'
import { useNavigate } from 'react-router-dom';


export default function Complaint() {
    const navigate = useNavigate();
  
    const handleButtonClick = () => {
      navigate('/complaint');
    };
  
  return (
    <complaint className="complaint">
      <div className="container">
        <div className="flex title">
            <div className="iconn">
              <img src="./images/Report.png" alt="Icon" />
            </div>
            <h4>الشكاوي</h4>
        </div>
        <p>اختر  سبب شكوتك لنتمكن من مساعدتك </p>

        <div className="optionsSec">
          <div className="flex options">
              <div className="option">
                <button onClick={handleButtonClick} className="flex arr">
                  <div className='tiit'>
                    <h5>بخصوص السعر</h5>
                  </div>
                  <div className="icon-arrow_back_ios"></div>
                </button>
              </div>
              <div className="option">
                <button onClick={handleButtonClick} className="flex arr">
                  <div className='tiit'>
                    <h5>بخصوص الفني</h5>
                  </div>
                  <div className="icon-arrow_back_ios"></div>
                </button>
              </div>
          </div>
          <div className="flex options">
              <div className="option">
                <button onClick={handleButtonClick} className="flex arr">
                  <div className='tiit'>
                    <h5>بخصوص جودة الخدمة</h5>
                  </div>
                  <div className="icon-arrow_back_ios"></div>
                </button>
              </div>
              <div className="option">
                <button onClick={handleButtonClick} className="flex arr">
                  <div className='tiit'>
                    <h5>بخصوص تأخير المواعيد</h5>
                  </div>
                  <div className="icon-arrow_back_ios"></div>
                </button>
              </div>
          </div>
        </div>
      </div>
    </complaint>
  )
}
