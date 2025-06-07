import React, { useState } from 'react';
import './techReg.css';
import { useNavigate } from 'react-router-dom';

export default function TechnicianRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    password: '',
    SSN: '',
    Government: 'الجيزة',
    specialization: 'نجارة',
    Experience_Year: '',
    SSNImage: null,
    profileImage: null,
    initialPrice: '',
  });
  

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setForm({ ...form, [id]: files[0] });
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    for (let key in form) {
      if (form[key] === '' || form[key] === null) {
        setError('يرجى تعبئة جميع الحقول');
        return;
      }
    }

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
        cityName: addressParts[2],
        govName: addressParts[3],
      }];
    } catch (err) {
      setError('من فضلك أدخل العنوان بالصيغة: رقم المبنى، اسم الشارع، المدينة، المحافظة');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', form.profileImage);
    formData.append('fullName', form.fullName);
    formData.append('SSN', form.SSN);
    formData.append('password', form.password);
    formData.append('phoneNumber', form.phoneNumber);
    formData.append('specialization', JSON.stringify({ name: form.specialization }));
    formData.append('role', 'Technician');
    formData.append('address', JSON.stringify(addressArray));
    formData.append('Experience_Year', form.Experience_Year);
    formData.append('Government', JSON.stringify({ govName: form.Government }));
    formData.append('SSNImage', form.SSNImage);
    formData.append('initialPrice', form.initialPrice);

    try {
      const res = await fetch('https://sevenerafy.onrender.com/auth/TechnicianRegister', {
        method: 'POST',
        body: formData,
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
    <section className='TechRegister'>
      <div className="container">
        <div className="flex comSec">
          <div className="secCall">
            <div className="box">
              <div className="title">
                <h4>مرحبا بك في تطبيقنا !</h4>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="fullName">الاسم *</label>
                <input type="text" id="fullName" required onChange={handleChange} />

                <label htmlFor="phoneNumber"> رقم الموبايل *</label>
                <input type="text" id="phoneNumber" required onChange={handleChange} />

                <label htmlFor="address">العنوان *</label>
                <input 
                  type="text" 
                  id="address" 
                  required 
                  onChange={handleChange} 
                  placeholder="أدخل العنوان: رقم المبنى، اسم الشارع، المدينة، المحافظة" 
                  />

                <label htmlFor="password">كلمة المرور *</label>
                <input type="password" id="password" required onChange={handleChange} />

                <label htmlFor="SSN">الرقم القومي *</label>
                <input type="text" id="SSN" required onChange={handleChange} />

                <label htmlFor="initialPrice">سعر المعاينة *</label>
                <input type="text" id="initialPrice" required onChange={handleChange} />

                <div className="flex opts">
                  <label className='not' htmlFor="Government">المحافظة</label>
                  <select id="Government" onChange={handleChange}>
                  <option value="">اختر المحافظة</option>
                  <option value="الجيزه">الجيزه</option>
                  <option value="القاهرة">القاهرة</option>
                  </select>

                  <label className='not' htmlFor="specialization">التخصص</label>
                  <select id="specialization" onChange={handleChange}>
                  <option value="">اختر التخصص</option>
                    <option value="نجارة">نجارة</option>
                    <option value="سباكة">سباكة</option>
                    <option value="كهرباء">كهرباء</option>
                    <option value="نقاشة">نقاشة</option>
                  </select>

                  <label htmlFor="Experience_Year" className='yearsNums'>سنوات الخدمة</label>
                  <input className='opt ExYear' type="text" id="Experience_Year" required onChange={handleChange} />
                </div>

                <label htmlFor="SSNImage">ملف صورة البطاقة * <span className='note-text'> يجب أن يكون الملف بصيغة PDF ويحتوي على وجه وظهر البطاقة (صفحتين).
                </span></label>
                <input className='padtop' type="file" id="SSNImage" required onChange={handleChange} />

                <label className='ProfReg' htmlFor="profileImage">صورة شخصية *</label>
                <input className='padtop' type="file" id="profileImage" required onChange={handleChange} />

                <button type="button" onClick={handleSubmit}>
                  إنشاء حساب
                </button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
              </form>

              <p className='parg'>
                لديك حساب؟
                <a href="/TechLog">تسجيل دخول الآن</a>
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
