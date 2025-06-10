import React, { useState } from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom'; // 👈 جديد

export default function ForgotPassword() {
  const navigate = useNavigate(); // 👈 جديد

  const [form, setForm] = useState({
    emailOrPhone: '',
    newPassword: ''
  });

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://sevenerafy.onrender.com/auth/User-ForgetPassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage('تم تغيير كلمة المرور بنجاح');
        setTimeout(() => {
          navigate('/contact'); // 👈 التوجيه بعد النجاح
        }, 1500); // تأخير بسيط لعرض الرسالة قبل التوجيه
      } else {
        const errorText = await response.text();
        setMessage(`حدث خطأ: ${errorText}. حاول مرة أخرى.`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(`حدث خطأ أثناء إرسال الطلب. تأكد من البيانات: ${error.message}`);
    }
  };

  return (
    <section className='ForgotPassword'>
      <div className="container">
        <div className="box flex">
          <div className="tit">
            <h5>تغيير كلمة المرور</h5>
          </div>
          <form className="inputs" onSubmit={handleSubmit}>
            <label htmlFor="emailOrPhone">البريد الإلكتروني أو رقم الموبايل *</label>
            <input
              type="text"
              id="emailOrPhone"
              name="emailOrPhone"
              required
              onChange={handleChange}
              value={form.emailOrPhone}
            />

            <label htmlFor="newPassword">كلمة المرور الجديدة *</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                required
                onChange={handleChange}
                value={form.newPassword}
              />
              <span className={`toggle-icon ${showPassword ? 'icon-eye-slash' : 'icon-eye'}`} onClick={togglePasswordVisibility}></span>
            </div>

            <button type="submit">إرسال</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
