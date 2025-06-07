import React, { useState, useEffect, useRef } from 'react';
import './profile.css';

export default function Prof() {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    buildingNum: '',
    streetName: '',
    cityName: '',
    government: '',
    phone: '',
    ssn: '',
    spec: '',
    years: '',
    initialPrice: '',
    profileImage: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const access_token = localStorage.getItem('access_token');

      if (!access_token) {
        setError('يجب تسجيل الدخول أولاً');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load cached profile first (optional)
        const cachedProfile = localStorage.getItem('techProfile');
        if (cachedProfile) {
          const cachedData = JSON.parse(cachedProfile);
          setFormData(cachedData);
          setOriginalData(cachedData);
        }

        const response = await fetch('https://sevenerafy.onrender.com/Technician/profile', {
          headers: {
            Authorization: `Technician ${access_token}`
          },
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) throw new Error('فشل في تحميل البيانات');

        const data = await response.json();
        const address = data.user?.address?.[0] || {};

        const profileData = {
          name: data.user?.fullName || '',
          buildingNum: address.Building_Num || '',
          streetName: address.streetName || '',
          cityName: address.cityName || '',
          government: address.govName || '',
          phone: data.user?.phoneNumber || '',
          ssn: data.user?.SSN || '',
          spec: data.user?.specialization?.name || '',
          years: data.user?.Experience_Year?.toString() || '',
          initialPrice: data.user?.initialPrice?.toString() || '',
          profileImage: data.user?.profileImage?.secure_url || ''
        };

        setFormData(profileData);
        setOriginalData(profileData);
        localStorage.setItem('techProfile', JSON.stringify(profileData));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('فشل في تحميل البيانات');
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    };

    fetchProfileData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = async () => {
    if (isEditing) {
      setIsLoading(true);
      setError(null);
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        setError('يجب تسجيل الدخول أولاً');
        setIsLoading(false);
        return;
      }

      try {
        const updatedData = {
          fullName: formData.name,
          address: [{
            Building_Num: formData.buildingNum,
            streetName: formData.streetName,
            cityName: formData.cityName,
            govName: formData.government
          }],
          phoneNumber: formData.phone,
          Experience_Year: parseInt(formData.years) || 0,
          initialPrice: parseInt(formData.initialPrice) || 0
        };

        const response = await fetch('https://sevenerafy.onrender.com/Technician/updateProfile', {
          method: 'PATCH',
          headers: {
            'Authorization': `Technician ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'فشل في حفظ التحديثات');
        }

        setOriginalData(formData);
        localStorage.setItem('techProfile', JSON.stringify(formData));
        setIsEditing(false);

      } catch (err) {
        console.error('Error updating profile:', err);
        setError(err.message || 'فشل في حفظ التحديثات');
        if (originalData) {
          setFormData(originalData);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
      setError(null);
    }
  };

  useEffect(() => {
    return () => {
      if (formData.profileImage && formData.profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(formData.profileImage);
      }
    };
  }, [formData.profileImage]);

  const triggerFileInput = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  return (
    <section className='TechProfile'>
      <div className="header">
        <div className="flex titleHeader">
          <span className='icon-profile'></span>
          <h5>حسابي</h5>
        </div>
      </div>

      <div className="container">
        {isLoading && <div className="loading-overlay">جاري التحميل...</div>}

        <div className="change">
          <div className="ProfileImage">
            <img 
              src={formData.profileImage || ""} 
              alt="صورة الملف" 
              style={isImageLoading ? { opacity: 0.5 } : {}}
            />
            {isImageLoading && <div className="image-loading">جاري رفع الصورة...</div>}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form>
          <div className="flex inps">
            <div className='input-wrapper'>
              <label htmlFor="name">اسم المستخدم</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />
            </div>
            <div className='input-wrapper phoneNumb'>
              <label htmlFor="phone">رقم الموبايل</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />
            </div>
          </div>

          <div className="flex inps">
            <div className='input-wrapper'>
              <label htmlFor="buildingNum">رقم المبنى/العنوان</label>
              <input 
                type="text" 
                id="buildingNum" 
                name="buildingNum" 
                value={formData.buildingNum} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />
            </div>
            <div className='input-wrapper'>
              <label htmlFor="streetName">اسم الشارع</label>
              <input 
                type="text" 
                id="streetName" 
                name="streetName" 
                value={formData.streetName} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />
            </div>
          </div>

          <div className="flex inps">
            <div className='input-wrapper'>
              <label htmlFor="cityName">المدينة</label>
              <input 
                type="text" 
                id="cityName" 
                name="cityName" 
                value={formData.cityName} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />
            </div>
            <div className='input-wrapper'>
              <label htmlFor="government">المحافظة</label>
              <input 
                type="text" 
                id="government" 
                name="government" 
                value={formData.government} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />
            </div>
          </div>

          <div className="flex inps">
            <div className='input-wrapper'>
              <label htmlFor="ssn">الرقم القومي</label>
              <input 
                type="text" 
                id="ssn" 
                name="ssn" 
                value={formData.ssn} 
                readOnly 
              />
            </div>
            <div className='input-wrapper'>
              <label htmlFor="spec">التخصص</label>
              <input 
                type="text" 
                id="spec" 
                name="spec" 
                value={formData.spec} 
                readOnly 
              />
            </div>
          </div>

          <div className="flex inps">
            <div className='input-wrapper'>
              <label htmlFor="years">سنوات الخبرة</label>
              <input 
                type="number" 
                id="years" 
                name="years" 
                value={formData.years} 
                onChange={handleChange} 
                readOnly={!isEditing} 
                min="0"
              />
            </div>
            <div className='input-wrapper'>
              <label htmlFor="initialPrice">السعر المبدئي</label>
              <input 
                type="number" 
                id="initialPrice" 
                name="initialPrice" 
                value={formData.initialPrice} 
                onChange={handleChange} 
                readOnly={!isEditing} 
                min="0"
              />
            </div>
          </div>
        </form>

        <button 
          onClick={handleEditClick} 
          disabled={isLoading || isImageLoading}
          className={isEditing ? 'save-btn' : 'edit-btn'}
        >
          {isEditing ? (isLoading ? "جاري التحديث..." : "حفظ التغييرات") : "تعديل البيانات"}
        </button>
      </div>
    </section>
  );
}