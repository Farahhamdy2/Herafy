import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './userPro.css';

const UserProfile = () => {
  // State management
  const [activeSquare, setActiveSquare] = useState('history');
  const [userData, setUserData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    Building_Num: '',
    streetName: '',
    govName: '',
    cityName: '',
    isPrimary: false
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [serviceType, setServiceType] = useState('نجارة');
  const [sortBy, setSortBy] = useState('latest');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentServiceToRate, setCurrentServiceToRate] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [openFilter, setOpenFilter] = useState(null);
  const [sortOption, setSortOption] = useState(null);
  const [error, setError] = useState(null);
  const [currentAddressId, setCurrentAddressId] = useState(null); 

  const navigate = useNavigate();

  const SERVICE_TYPE_MAP = useMemo(() => ({
    'نجارة': 'Carpentry',
    'كهرباء': 'Electricity',
    'نقاشة': 'Painting',
    'سباكة': 'Plumbing'
  }), []);

  const formatDateTime = (dateString, timeRange, inline = false) => {
    if (!dateString && !timeRange) return null;
    
    try {
      const dateOnly = dateString ? dateString.split('T')[0] : null;
      const timeOnly = timeRange ? timeRange.replace(':00', '') : null;
      
      if (inline && dateOnly && timeOnly) {
        return (
          <p className='bol'>
            <span className='icon-calendar ic'>التاريخ والوقت:</span> {dateOnly} / {timeOnly}
          </p>
        );
      }
      
      return (
        <>
          {dateOnly && <p className='bol'><span className='icon-calendar ic'>التاريخ:</span> {dateOnly}</p>}
          {timeOnly && <p className='bol'><span className='icon-time ic'>الوقت:</span> {timeOnly}</p>}
        </>
      );
    } catch (e) {
      console.error('Error formatting date/time:', e);
      return (
        <>
          {dateString && <p>التاريخ: {dateString}</p>}
          {timeRange && <p>الوقت: {timeRange}</p>}
        </>
      );
    }
  };

  const getArabicStatus = (status) => {
    switch (status) {
      case 'Completed': return 'مكتمل ️✅';
      case 'in-Progress': return 'قيد التنفيذ 🔄';
      case 'On the way': return 'في الطريق 🚚';
      case 'Pending': return 'قيد الانتظار ⏳';
      case 'Cancelled': return 'ملغية ❌';
      default: return status;
    }
  };

  // API functions
  const fetchUserProfile = useCallback(async (access_token) => {
    try {
      const response = await fetch('https://sevenerafy.onrender.com/User/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `User ${access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      return {
        fullName: data.user?.fullName || data.user?.name || '',
        phoneNumber: data.user?.phoneNumber || '',
        email: data.user?.email || data.user?.data1 || '',
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }, []);

  const fetchCurrentBooking = useCallback(async (access_token) => {
    try {
      const response = await fetch('https://sevenerafy.onrender.com/User/currentBooking/${bookingID}', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `User ${access_token}`
        }
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Current booking fetch error:', error);
      return null;
    }
  }, []);

  const fetchServiceHistory = useCallback(async (access_token) => {
    try {
      setHistoryLoading(true);
      setError(null);
  
      const englishType = SERVICE_TYPE_MAP[serviceType] || 'Electricity';
  
      const response = await fetch(
        `https://sevenerafy.onrender.com/User/getServiceHistory?type=${englishType}&sort=${sortBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `User ${access_token}`
          }
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch service history');
      }
  
      const data = await response.json();
      
      const completedHistory = (data.data || []).filter(item => item.bookingStatus === 'Completed');
      setServiceHistory(completedHistory);
  
    } catch (error) {
      console.error('Service history fetch error:', error);
      setError(error.message);
      setServiceHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [serviceType, sortBy, SERVICE_TYPE_MAP]);
  

  const handleCancelBooking = useCallback(async () => {
    if (!currentBooking || !window.confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
      return;
    }
  
    setIsUpdating(true);
    setError(null);
    const access_token = localStorage.getItem('access_token');
  
    try {
      console.log('Attempting to cancel booking with ID:', currentBooking._id);
      
      const response = await fetch(
        `https://sevenerafy.onrender.com/User/currentBooking/${currentBooking._id}/cancel`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `User ${access_token}`
          }
        }
      );
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(errorData.message || 'فشل إلغاء الحجز');
      }
  
      // Refresh data
      const [updatedBooking, updatedHistory] = await Promise.all([
        fetchCurrentBooking(access_token),
        fetchServiceHistory(access_token)
      ]);
  
      setCurrentBooking(updatedBooking);
      setServiceHistory(updatedHistory);
      
      alert('تم إلغاء الحجز بنجاح');
    } catch (error) {
      console.error('Full error:', error);
      setError(`حدث خطأ أثناء إلغاء الحجز: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  }, [currentBooking, fetchCurrentBooking, fetchServiceHistory]);

  const fetchUserAddresses = useCallback(async () => {

    const access_token = localStorage.getItem('access_token');

    try {
      const response = await fetch('https://sevenerafy.onrender.com/User/address', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `User ${access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      console.log('Address IDs:', data.addresses.map(a => a._id)); // Debug log
      return data.addresses || [];
    } catch (error) {
      console.error('Address fetch error:', error);
      throw error;
    }
  }, []);

  // Handlers
  const handleSetActive = useCallback((section) => {
    setActiveSquare(section);
    setError(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setUserData(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleAddressInputChange = useCallback((e) => {
    const { id, value, type, checked } = e.target;
    setNewAddress(prev => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : value 
    }));
  }, []);

  const handleUpdateProfile = useCallback(async () => {
    if (!userData.fullName || !userData.phoneNumber || !userData.email) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
  
    setIsUpdating(true);
    setError(null);
    const access_token = localStorage.getItem('access_token');
  
    try {
      const response = await fetch('https://sevenerafy.onrender.com/User/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `User ${access_token}`
        },

        body: JSON.stringify({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          email: userData.email
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      alert('تم تحديث البيانات بنجاح');
    } catch (error) {
      console.error('Update error:', error);
      setError(`حدث خطأ أثناء التحديث: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  }, [userData]);  

  const handleAddAddress = useCallback(async () => {
    if (!newAddress.Building_Num || !newAddress.streetName || !newAddress.govName || !newAddress.cityName) {
      setError('الرجاء ملء جميع حقول العنوان المطلوبة');
      return;
    }
  
    setIsUpdating(true);
    setError(null);
    const access_token = localStorage.getItem('access_token');
  
    try {
      const response = await fetch('https://sevenerafy.onrender.com/User/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `User ${access_token}`
        },
        body: JSON.stringify({
          Building_Num: newAddress.Building_Num,
          streetName: newAddress.streetName,
          govName: newAddress.govName,
          cityName: newAddress.cityName,
          isPrimary: newAddress.isPrimary
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add address');
      }
      
      const updatedAddresses = await fetchUserAddresses(access_token);
      setAddresses(updatedAddresses);
      setNewAddress({
        Building_Num: '',
        streetName: '',
        govName: '',
        cityName: '',
        isPrimary: false
      });
      setShowAddAddressForm(false);
      alert('تم إضافة العنوان بنجاح');
    } catch (error) {
      console.error('Add address error:', error);
      setError(`حدث خطأ أثناء إضافة العنوان: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  }, [newAddress, fetchUserAddresses]);

  const handleSetPrimaryAddress = useCallback(async (addressId) => {
    setIsUpdating(true);
    setError(null);
    const access_token = localStorage.getItem('access_token');
  
    try {
      console.log('Setting primary address with ID:', addressId);
      
      const response = await fetch(
        `https://sevenerafy.onrender.com/User/set-primary/${addressId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `User ${access_token}`
          }
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set primary address');
      }
      
      const updatedAddresses = await fetchUserAddresses(access_token);
      setAddresses(updatedAddresses);
      
      // Update the current address ID if needed
      setCurrentAddressId(addressId);
      
      alert('تم تعيين العنوان كرئيسي بنجاح');
    } catch (error) {
      console.error('Set primary error:', error);
      setError(`حدث خطأ أثناء تعيين العنوان الرئيسي: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  }, [fetchUserAddresses]);

  const handleDeleteAddress = useCallback(async (addressId) => {
    const access_token = localStorage.getItem('access_token');

    if (!addressId) return;
  
    try {
      console.log('Setting primary address with ID:', addressId);

      const response = await fetch(
        `https://sevenerafy.onrender.com/User/${addressId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `User ${access_token}`
          }
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete address');
      }
      
      const updatedAddresses = await fetchUserAddresses(access_token);
      setAddresses(updatedAddresses);
      
      // Clear the current address ID if we're deleting it
      if (currentAddressId === addressId) {
        setCurrentAddressId(null);
      }
      
      alert('تم حذف العنوان بنجاح');
    } catch (error) {
      console.error('Delete error:', error);
      setError(`حدث خطأ أثناء الحذف: ${error.message}`);
    }
  }, [fetchUserAddresses]);

  const cancelAddressForm = useCallback(() => {
    setShowAddAddressForm(false);
    setNewAddress({
      Building_Num: '',
      streetName: '',
      govName: '',
      cityName: '',
      isPrimary: false
    });
    setError(null);
  }, []);

  const toggleFilter = useCallback((filter) => {
    setOpenFilter(openFilter === filter ? null : filter);
  }, [openFilter]);

  const handleSort = useCallback((option) => {
    if (['كهرباء', 'نقاشة', 'سباكة', 'نجارة'].includes(option)) {
      setServiceType(option);
    } else {
      setSortBy(option);
    }
    setSortOption(option);
    setOpenFilter(null);
  }, []);

  const submitFeedback = useCallback(async () => {
    if (!currentServiceToRate || !rating) {
      setError('الرجاء إعطاء تقييم قبل الإرسال');
      return;
    }
  
    if (!feedbackText.trim()) {
      setError('الرجاء إضافة تعليق قبل إرسال التقييم');
      return;
    }
  
    setIsUpdating(true);
    setError(null);
    const access_token = localStorage.getItem('access_token');
  
    try {
      const response = await fetch('https://sevenerafy.onrender.com/User/addFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `User ${access_token}`
        },
        body: JSON.stringify({
          technicianId: currentServiceToRate.technicianId._id,
          feedbackText: feedbackText,
          rating: rating,
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }
      
      alert('تم إرسال التقييم بنجاح');
      setShowFeedbackModal(false);
      setFeedbackText('');
      setRating(0);
      
      await fetchServiceHistory(access_token);
    } catch (error) {
      console.error('Feedback submission error:', error);
      setError(`حدث خطأ أثناء إرسال التقييم: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  }, [currentServiceToRate, feedbackText, rating, fetchServiceHistory]);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        navigate('/UserLog');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const [profileData, addressData, bookingData] = await Promise.all([
          fetchUserProfile(access_token),
          fetchUserAddresses(access_token),
          fetchCurrentBooking(access_token)
        ]);

        setUserData(profileData);
        setAddresses(addressData);
        setCurrentBooking(bookingData);
        
        if (activeSquare === 'history') {
          await fetchServiceHistory(access_token);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, activeSquare, fetchUserProfile, fetchUserAddresses, fetchCurrentBooking, fetchServiceHistory]);

  // Fetch history when filters change
  useEffect(() => {
    const fetchHistory = async () => {
      const access_token = localStorage.getItem('access_token');
      if (access_token && activeSquare === 'history') {
        await fetchServiceHistory(access_token);
      }
    };
    
    fetchHistory();
  }, [serviceType, sortBy, activeSquare, fetchServiceHistory]);

  // Components
  const InputField = useMemo(() => 
    ({ label, id, type = 'text', value, onChange, required = false }) => (
      <div className="input-group">
        <label htmlFor={id}>{label}</label>
        <input 
          type={type} 
          id={id} 
          value={value}
          onChange={onChange}
          className="form-input"
          required={required}
        />
      </div>
    ), []);

  const CheckboxField = useMemo(() => 
    ({ label, id, checked, onChange }) => (
      <div className="checkbox-group">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="form-checkbox"
        />
        <label htmlFor={id}>{label}</label>
      </div>
    ), []);

  const ActionButton = useMemo(() => 
    ({ text, onClick, disabled = false, className = '' }) => (
      <button 
        className={`action-button ${className}`} 
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    ), []);

  const Filter = useMemo(() => 
    ({ text, active, onClick }) => (
      <button 
        className={`filter ${active ? 'active-filter' : ''}`}
        onClick={onClick}
      >
        <span>{text}</span>
        <span className="icon-arrow-down"></span>
      </button>
    ), []);

    const HistoryItem = ({
      service, 
      date, 
      time,
      technician, 
      phone, 
      cost,
      status,
      rating: initialRating,
      serviceCode,
      profileImage,
      description,
      hasFeedback,
      technicianId,
      serviceType,
      bookingStatus,
      _id,
      navigate
    }) => {
      const [hoverRating, setHoverRating] = useState(0);
      const [selectedRating, setSelectedRating] = useState(0);
      const [localHasFeedback, setLocalHasFeedback] = useState(hasFeedback);
      const [localRating, setLocalRating] = useState(initialRating);
    
      const handleRateClick = (selectedRating) => {
        if (bookingStatus === 'Completed' && !localHasFeedback) {
          setSelectedRating(selectedRating);
          setCurrentServiceToRate({
            _id,
            technicianId: { 
              _id: technicianId, 
              fullName: technician, 
              specialization: { name: serviceType } 
            },
            bookingDate: date,
            bookingTime: time,
            serviceCode,
            serviceName: service,
            phoneNumber: phone,
            setLocalHasFeedback, // send state updater
            setLocalRating       // send state updater
          });
          setRating(selectedRating);
          setShowFeedbackModal(true);
        }
      };
    
      const handleReBook = () => {
        if(service === 'خدمة كهرباء'){
          navigate('/Electric');
        } else if(service === 'خدمة نقاشة'){
          navigate('/Painting');
        } else if(service === 'خدمة سباكة'){
          navigate('/Plumbing');
        } else{
          navigate('/Carpentry');
        }
      };
    
      return (
        <div className="smallsqr">
          <div className="small flex">
            <div className="rightsec">
              <h6 className='bold'>{service}</h6>
              <p><span className='bold icon-tech ic '>الفني:</span> <span></span>{technician}</p>
              <p><span className='bold icon-phone ic'>رقم الهاتف:</span> {phone}</p>
              {formatDateTime(date, time)}
              <p><span className='bold icon-status ic'>الحالة:</span> {getArabicStatus(bookingStatus)}</p>
              {cost && <p><span className='bold icon-wallet ic'>التكلفة:</span> {cost}</p>}
              <p><span className='bold icon-qrcode ic'>كود الخدمة:</span> {serviceCode}</p>
              <p><span className='bold icon-details ic'>تفاصيل الخدمة:</span>{description}</p>
            </div>
            <div className="leftsec">
              <img 
                src={profileImage || "./images/profileUser.png"} 
                alt="Profile" 
                className="prof" 
                onError={(e) => {
                  e.target.src = "./images/profileUser.png";
                }}
              />
              {bookingStatus === 'Completed' && (
                <div className="rating-section starsHis">
                  <p>تقييم الخدمة:</p>
                  <div className="stars">
                    {localHasFeedback ? (
                      <div className="rated-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`star ${star <= localRating ? 'filled' : 'empty'}`}
                          >
                            {star <= localRating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="rate-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`star ${star <= (hoverRating || selectedRating) ? 'filled' : 'empty'}`}
                            onClick={() => handleRateClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            {star <= (hoverRating || selectedRating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {bookingStatus === 'Completed' && (
            <button className="action-button" onClick={handleReBook}>
              إعادة حجز
            </button>
          )}    
        </div>
      );
    };
    

    const formatDate = (dateString, timeRange, inline = false, sameLine = false) => {
      if (!dateString && !timeRange) return null;
      
      try {
        const dateOnly = dateString ? 
          dateString.includes('T') ? 
            dateString.split('T')[0] : 
            dateString.split(' ')[0] : 
          null;
          
        const timeOnly = timeRange ? timeRange.replace(':00', '') : null;
        
        if (inline && dateOnly && timeOnly) {
          return (
            <p className='bol'>
              <span>التاريخ والوقت:</span> {dateOnly} / {timeOnly}
            </p>
          );
        }
    
        if (sameLine && dateOnly && timeOnly) {
          return (
            <p className='bol'>
              <span>التاريخ:</span> {dateOnly} <span className="time-separator">|</span> 
              <span>الوقت:</span> {timeOnly}
            </p>
          );
        }
        
        return (
          <>
            {dateOnly && <p className='bol'><span>التاريخ:</span> {dateOnly}</p>}
            {timeOnly && <p className='bol'><span>الوقت:</span> {timeOnly}</p>}
          </>
        );
      } catch (e) {
        console.error('Error formatting date/time:', e);
        return (
          <>
            {dateString && <p>التاريخ: {dateString}</p>}
            {timeRange && <p>الوقت: {timeRange}</p>}
          </>
        );
      }
    };
  const FeedbackModal = useMemo(() => {
    if (!showFeedbackModal || !currentServiceToRate) return null;

    return (
      <div className="modal-overlay">
        <div className="feedback-modal">
          <div className="modal-header">
            <h4>تقييم الخدمة السابقة</h4>
            <button 
              className="close-btn" 
              onClick={() => {
                setShowFeedbackModal(false);
                setFeedbackText('');
                setRating(0);
              }}
              aria-label="إغلاق"
            >
              &times;
            </button>
          </div>
          
          <div className="modal-body">
            <div className="service-info">
              {currentServiceToRate.serviceName && (
                <p className="service-type">نوع الخدمة: {currentServiceToRate.serviceName}</p>
              )}
              <p className="technician-name">الفني: {currentServiceToRate.technicianId.fullName}</p>
              {formatDate(currentServiceToRate.bookingDate, currentServiceToRate.bookingTime, false, true)}       
              <p className="service-code">كود الخدمة: {currentServiceToRate.serviceCode}</p>
            </div>
            
            <div className="rating-section">
              <p className="rating-label">تقييم الخدمة:</p>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`تقييم ${star} نجوم`}
                  >
                    {star <= (hoverRating || rating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <p className="rating-hint">{rating ? `لقد أعطيت ${rating} نجوم` : 'اضغط على النجوم للتقييم'}</p>
            </div>
            
            <div className="feedback-input">
              <label htmlFor="feedback-text">تعليقك على الخدمة:</label>
              <textarea
                id="feedback-text"
                className="feedback-textarea"
                placeholder="اكتب تعليقك هنا..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows="4"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="modal-actions">
              <button
                className={`submit-btn ${isUpdating ? 'loading' : ''} ${rating === 0 ? 'disabled' : ''}`}
                onClick={submitFeedback}
                disabled={isUpdating || rating === 0}
              >
                {isUpdating ? (
                  <>
                    <span className="spinner"></span>
                    جاري الإرسال...
                  </>
                ) : (
                  'إرسال التقييم'
                )}
              </button>
              <button
                className="skip-btn"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackText('');
                  setRating(0);
                }}
                disabled={isUpdating}
              >
                تخطي
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showFeedbackModal, currentServiceToRate, feedbackText, rating, hoverRating, error, isUpdating, submitFeedback]);

  const Header = useMemo(() => () => (
    <div className="header">
      <div className="flex titleHeader">
        <span className="icon-profile"></span>
        <h5>حسابي</h5>
      </div>
    </div>
  ), []);

  const Sidebar = useMemo(() => 
    ({ activeSquare, onSetActive }) => {
      const buttons = [
        { key: 'Info', text: 'معلومات الحساب' },
        { key: 'addresses', text: 'العناوين' },
        { key: 'history', text: 'سجل الحجز' },
        { key: 'current', text: 'الحجز الحالي' },
      ];

      return (
        <div className="buttons">
          {buttons.map(({ key, text }) => (
            <button
              key={key}
              className={activeSquare === key ? 'activeTech' : ''}
              onClick={() => onSetActive(key)}
            >
              {text}
            </button>
          ))}
        </div>
      );
    }, []);

    const AddressForm = (
      <div className="address-form">
        <h4>إضافة عنوان جديد</h4>
    
        <div className="input-group">
          <label htmlFor="Building_Num">رقم المبنى:</label>
          <input 
            type="text" 
            id="Building_Num" 
            value={newAddress.Building_Num}
            onChange={handleAddressInputChange}
            className="form-input"
            required
          />
        </div>
    
        <div className="input-group">
          <label htmlFor="streetName">اسم الشارع:</label>
          <input 
            type="text" 
            id="streetName" 
            value={newAddress.streetName}
            onChange={handleAddressInputChange}
            className="form-input"
            required
          />
        </div>
    
        <div className="input-group">
          <label htmlFor="govName">المحافظة:</label>
          <input 
            type="text" 
            id="govName" 
            value={newAddress.govName}
            onChange={handleAddressInputChange}
            className="form-input"
            required
          />
        </div>
    
        <div className="input-group">
          <label htmlFor="cityName">المدينة:</label>
          <input 
            type="text" 
            id="cityName" 
            value={newAddress.cityName}
            onChange={handleAddressInputChange}
            className="form-input"
            required
          />
        </div>
    
        <CheckboxField
          id="isPrimary"
          label="تعيين كعنوان رئيسي"
          checked={newAddress.isPrimary}
          onChange={handleAddressInputChange}
        />
    
        {error && <div className="error-message">{error}</div>}
    
        <div className="form-actions">
          <ActionButton 
            text="اضافة" 
            onClick={handleAddAddress}
            className="Add"
            disabled={isUpdating}
          />
          <ActionButton 
            text="إلغاء" 
            onClick={cancelAddressForm}
            className="cancel"
            disabled={isUpdating}
          />
        </div>
      </div>
    );
    

  const AddressList = useMemo(() => () => (
    <div className="address-list">
      {addresses.length === 0 ? (
        <p className="no-addresses">لا يوجد عناوين مسجلة</p>
      ) : (
        addresses.map((address) => (
          <div key={address._id} className={`address-card ${address.isPrimary ? 'primary' : ''}`}>
            <div className="address-content">
              <h5>{address.isPrimary ? 'العنوان الرئيسي' : 'عنوان إضافي'}</h5>
              <p>المبنى: {address.Building_Num}</p>
              <p>الشارع: {address.streetName}</p>
              <p>المحافظة: {address.govName}</p>
              <p>المدينة: {address.cityName}</p>
            </div>
            
            <div className="address-actions">
              {!address.isPrimary && (
                <ActionButton 
                  text="تعيين كرئيسي"
                  onClick={() => handleSetPrimaryAddress(address._id)}
                  className="small"
                  disabled={isUpdating}
                />
              )}
              
              <ActionButton 
                text="حذف"
                onClick={() => handleDeleteAddress(address._id)}
                className="small danger"
                disabled={isUpdating || address.isPrimary}
              />
            </div>
          </div>
        ))
      )}
      
      <ActionButton 
        text="+ إضافة عنوان جديد"
        onClick={() => {
          setShowAddAddressForm(true);
          setNewAddress({
            Building_Num: '',
            streetName: '',
            govName: '',
            cityName: '',
            isPrimary: addresses.length === 0
          });
        }}
        className="add-address"
      />
    </div>
  ), [addresses, isUpdating, handleSetPrimaryAddress, handleDeleteAddress]);

  // Section components
  const sections = useMemo(() => ({
    Info: (
      <div className="square squareInfo Info">
        {isLoading ? (
          <div className="loading">جاري تحميل البيانات...</div>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            <div className='InputsInfo'>
              <form>
                <InputField 
                  label="اسم المستخدم" 
                  id="fullName" 
                  type="text" 
                  value={userData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <InputField 
                  label="رقم الموبيل" 
                  id="phoneNumber" 
                  type="tel" 
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                <InputField 
                  label="البريد الإلكتروني" 
                  id="email" 
                  type="email" 
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                />
              </form>
            </div>
            <ActionButton 
              text={isUpdating ? "جاري التحديث..." : "تحديث"} 
              onClick={handleUpdateProfile}
              disabled={isUpdating}
            />
          </>
        )}
      </div>
    ),
    addresses: (
      <div className="square addresses">
        {isLoading ? (
          <div className="loading">جاري تحميل العناوين...</div>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            {showAddAddressForm ? (
              AddressForm
            ) : (
              <AddressList />
            )}
          </>
        )}
      </div>
    ),
    history: (
      <div className="square history">
        <div className="flex filters">
          <div className="filter-container">
            <div 
              className={`flex filter ${sortOption === 'latest' || sortOption === 'oldest' ? 'active' : ''}`} 
              onClick={() => toggleFilter('date')}
            >
              <div className="icon-filter"></div>
              <h6>
                {sortOption === 'latest' ? 'الأحدث' : 
                sortOption === 'oldest' ? 'الأقدم' : 
                'الترتيب حسب كود الخدمة'}
              </h6>
            </div>
            {openFilter === 'date' && (
              <ul className="dropdown rate">
                <li 
                  onClick={() => handleSort('latest')}
                  className={sortOption === 'latest' ? 'active' : ''}
                >
                  الأحدث
                </li>
                <li 
                  onClick={() => handleSort('oldest')}
                  className={sortOption === 'oldest' ? 'active' : ''}
                >
                  الأقدم
                </li>
              </ul>
            )}
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {historyLoading ? (
          <div className="loading">جاري تحميل سجل الحجوزات...</div>
        ) : serviceHistory.length > 0 ? (
          <div className="history-scroll-container">
            {serviceHistory.map((booking) => (
              <HistoryItem 
                key={booking._id}
                _id={booking._id}
                service={`خدمة ${booking.technicianId.specialization.name}`}
                date={booking.bookingDate}
                time={booking.bookingTime}
                technician={booking.technicianId.fullName}
                phone={booking.technicianId.phoneNumber}
                cost={`${booking.ServiceCost || 0} جنيه`}
                serviceCode={`${booking.serviceCode || ''} `}
                status={getArabicStatus(booking.bookingStatus)}             
                description={booking.ServiceDescription || 'لا يوجد وصف'}
                rating={booking.rating}
                profileImage={booking.technicianId.profileImage?.secure_url}
                hasFeedback={booking.hasFeedback}
                technicianId={booking.technicianId._id}
                serviceType={serviceType}
                bookingStatus={booking.bookingStatus}
              />
            ))}
          </div>
        ) : (
          <div className="no-history">
            <p>لا يوجد سجل حجوزات لخدمة {serviceType}</p>
          </div>
        )}
      </div>
    ),
    current: (
      <div className="square currSquare current">
        {isLoading ? (
          <div className="loading">جاري تحميل البيانات...</div>
        ) : currentBooking ? (
          <>
            <img className="car" src="./images/Car.png" alt="Car Service" />
            <h5>خدمتك في الطريق</h5>
            <div className="sqr">
              <h6>خدمة {currentBooking.technicianId.specialization.name}</h6>
              <p><span className='icon-tech ic '>الفني:</span> {currentBooking.technicianId.fullName}</p>
              <p><span className='icon-phone ic'>رقم الهاتف:</span> {
                currentBooking?.technicianId?.phoneNumber || 
                currentBooking?.technicianId?.phone || 
                'غير متاح'
              }</p>            
              {formatDateTime(currentBooking.bookingDate, currentBooking.bookingTime, true)}
              <p><span className='icon-status ic'>الحالة:</span> {getArabicStatus(currentBooking.bookingStatus)}</p>
              <p><span className='icon-details ic'>كود الخدمة:</span> {currentBooking.serviceCode}</p>
            </div>
            <div className="flex butt">
              <ActionButton 
                text={isUpdating ? "جاري الإلغاء..." : "إلغاء الحجز"} 
                onClick={handleCancelBooking}
                disabled={isUpdating}
                className="danger"
              />
            </div>
          </>
        ) : (
          <div className="no-booking">
            <p>لا يوجد حجوزات حالية</p>
          </div>
        )}
      </div>
    ),
  }), [
    isLoading, error, userData, handleInputChange, isUpdating, handleUpdateProfile,
    showAddAddressForm, AddressForm, AddressList,
    sortOption, openFilter, toggleFilter, handleSort, historyLoading, serviceHistory,
    serviceType, currentBooking,  handleCancelBooking

  ]);

  return (
    <section className="UserProfile">
      <Header />
      <div className="container flex">
        <Sidebar activeSquare={activeSquare} onSetActive={handleSetActive} />
        {sections[activeSquare]}
      </div>
      {FeedbackModal}
    </section>
  );
};

export default UserProfile;

