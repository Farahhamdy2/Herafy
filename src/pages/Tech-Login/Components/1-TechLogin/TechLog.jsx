import React, { useState } from 'react';
import './techlog.css';
import { useNavigate } from 'react-router-dom';

export default function Complaintt() {
  const navigate = useNavigate();
  const [phoneNumber, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 حالة إظهار/إخفاء كلمة المرور

  const handleLogin = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://sevenerafy.onrender.com/auth/TechnicianLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('access_token', data.tokens.access_token);
        localStorage.setItem('user_name', data.technician.Name);
        setSuccess('تم تسجيل الدخول بنجاح 🎉');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError('فشل في تسجيل الدخول، يرجى التأكد من البيانات.');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className='TechLogin'>
      <div className="container">
        <div className="flex comSec">
          <div className="secCall">
            <div className="box">
              <div className="title">
                <h4>مرحبا بك في تطبيقنا !</h4>
                <p>الرجاء تسجيل الدخول لاستخدام التطبيق</p>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="phoneNumber">رقم الموبايل *</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <label className='passLabel' htmlFor="password">كلمة المرور *</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className={`toggle-icon ${showPassword ? 'icon-eye-slash' : 'icon-eye'}`}
                    onClick={togglePasswordVisibility}
                  ></span>
                </div>

                <div className="flex remind">
                  <div className="check">
                    <div className="flex">
                      <input type="checkbox" id="remind" name="remind" value="yes" />
                      <label htmlFor="remind">تذكرني</label>
                    </div>
                  </div>
                  <div className="pass">
                    <a href="/ForgotPasswordTech">نسيت كلمة المرور؟</a>
                  </div>
                </div>

                <button type="button" onClick={handleLogin}>
                  تسجيل الدخول
                </button>

                <p className='parg'>
                  ليس لديك حساب؟ <a href="/TechReg">إنشاء حساب الآن</a>
                </p>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
              </form>
            </div>
          </div>

          <div className="ImgComplaint">
            <img src="./images/login.png" alt="Login" />
          </div>
        </div>
      </div>
    </section>
  );
}