import React, { useState } from 'react';
import './userlogin.css';
import { useNavigate } from 'react-router-dom';

export default function UserLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!form.emailOrPhone || !form.password) {
      setError('من فضلك أدخل البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      const res = await fetch('https://sevenerafy.onrender.com/auth/userLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok && data.success) {
        if (data.user && data.user.role === 'Technician') {
          setError('غير مسموح لتقني بتسجيل الدخول من هذا النموذج');
          return;
        }

        setSuccess('تم تسجيل الدخول بنجاح 🎉');

        if (data.tokens && data.tokens.access_token && data.user) {
          localStorage.setItem('access_token', data.tokens.access_token);
          localStorage.setItem('user_name', data.user.Name); 
        } else {
          console.error("البيانات ناقصة في الاستجابة");
        }

        setTimeout(() => navigate('/'), 2000); 
      } else {
        setError(data.message || 'فشل في تسجيل الدخول');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إرسال البيانات');
    }
  };

  return (
    <section className='Userlogin'>
      <div className="container">
        <div className="flex comSec">
          <div className="secCall">
            <div className="box">
              <div className="title">
                <h4>مرحبا بك في تطبيقنا !</h4>
                <p>الرجاء تسجيل الدخول لاستخدام التطبيق</p>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="emailOrPhone">البريد الإلكتروني أو رقم الموبايل *</label>
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  required
                  onChange={handleChange}
                  value={form.emailOrPhone}
                />

                <label className='passLabel' htmlFor="password">كلمة المرور *</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    onChange={handleChange}
                    value={form.password}
                  />
                  <span
                    className={`toggle-icon ${showPassword ? 'icon-eye-slash' : 'icon-eye'}`}
                    onClick={togglePasswordVisibility}>
                  </span>
                </div>

                <div className="flex remind">
                  <div className="check">
                    <div className="flex">
                      <input
                        type="checkbox"
                        id="checkboxId"
                        name="checkboxName"
                        value="checkboxValue"
                      />
                      <label htmlFor="checkboxId">تذكرني</label>
                    </div>
                  </div>
                  <div className="pass">
                    <a href="/ForgotPassword">نسيت كلمة المرور؟</a>
                  </div>
                </div>

                <button type="button" onClick={handleSubmit}>
                  تسجيل الدخول
                </button>

                <p className='parg'>
                  ليس لديك حساب؟ <a href="/UserReg">إنشاء حساب الآن</a>
                </p>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
              </form>
            </div>
          </div>

          <div className="ImgLogin">
            <img src="./images/login.png" alt="Login" />
          </div>
        </div>
      </div>
    </section>
  );
}
