import React, { useState } from 'react';
import './userReg.css';
import { useNavigate } from 'react-router-dom';

export default function UserReg() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    role: '', 
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all required fields
    if (!form.fullName || !form.email || !form.phoneNumber || !form.address || !form.password || !form.role) {
      setError('من فضلك أكمل جميع الحقول');
      return;
    }

    // Process address
    let addressArray;
    try {
      const addressParts = form.address.split('،')
        .map(part => part.trim())
        .filter(part => part !== '');

      if (addressParts.length !== 4) {
        throw new Error();
      }

      addressArray = [{
        Building_Num: addressParts[0],
        streetName: addressParts[1],
        govName: addressParts[2],
        cityName: addressParts[3],
      }];
    } catch (err) {
      setError('من فضلك أدخل العنوان بالصيغة: رقم المبنى، اسم الشارع، المحافظة، المدينة');
      return;
    }

    // Prepare payload without confirmPassword
    const { confirmPassword, ...userData } = form;
    const payload = {
      ...userData,
      address: addressArray
    };

    try {
      const res = await fetch('https://sevenerafy.onrender.com/auth/userRegister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('تم إنشاء الحساب بنجاح 🎉');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message || 'فشل في إنشاء الحساب');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إرسال البيانات');
    }
  };

  return (
    <section className='UserReg'>
      <div className="container">
        <div className="flex comSec">
          <div className="secCall">
            <div className="box">
              <div className="title">
                <h4>مرحبا بك في تطبيقنا !</h4>
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="fullName">الاسم *</label>
                <input 
                  type="text" 
                  id="fullName" 
                  required 
                  value={form.fullName} 
                  onChange={handleChange}
                />

                <label htmlFor="email">البريد الإلكتروني *</label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  value={form.email} 
                  onChange={handleChange}
                />

                <label htmlFor="phoneNumber">رقم الموبايل *</label>
                <input 
                  type="text" 
                  id="phoneNumber" 
                  required 
                  value={form.phoneNumber} 
                  onChange={handleChange}
                />

                <label htmlFor="address">العنوان *</label>
                <input 
                  type="text" 
                  id="address" 
                  required 
                  value={form.address} 
                  onChange={handleChange}
                  placeholder="مثال: 15، شارع الثورة، القاهرة، مصر الجديدة"
                />

                <label htmlFor="password">كلمة المرور *</label>
                <input 
                  type="password" 
                  id="password" 
                  required 
                  value={form.password} 
                  onChange={handleChange}
                />

                <label htmlFor="role">نوع الحساب *</label>
                <select id="role" required value={form.role} onChange={handleChange}>
                  <option value="">اختر نوع الحساب</option>
                  <option value="User">مستخدم</option>
                  <option value="Technician">فني</option>
                </select>

                <button type="submit">إنشاء حساب</button>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
              </form>

              <p className='parg'>
                لديك حساب؟ <a href="/UserLog">تسجيل دخول الآن</a>
              </p>
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
