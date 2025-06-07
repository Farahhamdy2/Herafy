import React, { useState } from 'react';
import './call.css';
import Lottie from 'lottie-react';
import contactAnimation from '../../../../../public/animation/contcat.json'

export default function Call() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://sevenerafy.onrender.com/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setResponseMessage('تم إرسال الرسالة بنجاح.');
        setForm({ name: '', email: '', phoneNumber: '', message: '' }); // مسح البيانات بعد الإرسال
      } else {
        const errorText = await response.text();
        setResponseMessage(`حدث خطأ: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(`حدث خطأ أثناء إرسال الطلب. تأكد من البيانات: ${error.message}`);
    }
  };

  return (
    <section className="call">
      <div className="container">
        <div className="flex titlee">
          <div className="iconn">
            <img src="./images/24.png" alt="Icon" />
          </div>
          <h4>اتصل بخبرائنا</h4>
        </div>
        <div className="flex secCall">
          <div className="box">
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">اسم المستخدم*</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                onChange={handleChange}
                value={form.name}
              />

              <label htmlFor="phoneNumber">رقم الموبايل *</label>
              <input
                type="phone"
                id="phoneNumber"
                name="phoneNumber"
                required
                onChange={handleChange}
                value={form.phoneNumber}
              />

              <label htmlFor="email">البريد إلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={form.email}
              />

              <label htmlFor="message">الرسالة *</label>
              <textarea
                id="message"
                name="message"
                required
                onChange={handleChange}
                value={form.message}
              />

              <button type="submit">إرسال</button>
            </form>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
          </div>

          <div className='animation'>
          <Lottie className='contactAnimation' style={{height : 355}} animationData={contactAnimation} />
           </div>
        </div>
      </div>
    </section>
  );
}
