import React, { useState } from 'react';
import './complaint-main.css';
import { useNavigate } from 'react-router-dom';

export default function Complaintt() {
  const navigate = useNavigate();
  const [serviceCode, setServiceCode] = useState('');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');

  const handleButtonClick = async (e) => {
    e.preventDefault();

    if (!serviceCode || !details) {
      setMessage('يرجى تعبئة جميع الحقول');
      return;
    }

    const access_token = localStorage.getItem('access_token'); // استرجاع التوكن

    if (!access_token) {
      setMessage('يجب تسجيل الدخول قبل إرسال الشكوى');
      return;
    }

    const complaintData = {
      category: "Delays",
      serviceCode,
      details
    };

    try {
      const response = await fetch('https://sevenerafy.onrender.com/User/createComplaint?category=Delays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `User ${access_token}`
        },
        body: JSON.stringify(complaintData),
      });

      const resData = await response.json();

      if (response.ok) {
        setMessage('تم إرسال الشكوى بنجاح');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(`فشل في الإرسال: ${resData.message || 'يرجى المحاولة مرة أخرى.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('حدث خطأ أثناء إرسال الشكوى. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <section className='Complaint'>
      <div className="container">
        <div className="flex comSec">
          <div className="secCall">
            <div className="box">
              <div className="flex title">
                <div className="iconn">
                  <img src="./images/Report.png" alt="Icon" />
                </div>
                <h4>الشكاوي</h4>
              </div>
              <form onSubmit={handleButtonClick}>
                <label htmlFor="serviceCode">كود الخدمة *</label>
                <input 
                  type="number" 
                  id="serviceCode" 
                  value={serviceCode} 
                  onChange={(e) => setServiceCode(e.target.value)} 
                  required 
                />
                <label htmlFor="details">الشكوى *</label>
                <textarea 
                  id="details" 
                  value={details} 
                  onChange={(e) => setDetails(e.target.value)} 
                  required 
                />
                <button type="submit">
                  إرسال
                </button>
              </form>
              {message && <p className="message">{message}</p>}
            </div>
          </div>

          <div className="ImgComplaint">
            <img src="./images/Complaint.png" alt="Complaint" />
          </div>
        </div>
      </div>
    </section>
  );
}
