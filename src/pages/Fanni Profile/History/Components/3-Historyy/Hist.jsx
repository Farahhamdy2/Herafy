import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './history.css';

export default function Hist() {
  const [activeSquare, setActiveSquare] = useState('current');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceDetails, setServiceDetails] = useState({
    cost: '',
    serviceCode: '',
    details: ''
  });
  const [completedBookingId, setCompletedBookingId] = useState(null);
  const navigate = useNavigate();

  const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  const MESSAGES = {
    loading: 'جاري التحميل...',
    noBookings: 'لا توجد حجوزات متاحة',
    noCurrentBookings: 'لا توجد حجوزات حالية',
    noPendingBookings: 'لا توجد حجوزات جديدة',
    noHistoryBookings: 'لا توجد حجوزات سابقة',
    bookingAccepted: 'تم قبول الحجز بنجاح',
    bookingRejected: 'تم رفض الحجز بنجاح',
    bookingUpdated: 'تم تحديث حالة الحجز بنجاح',
    bookingCanceled: 'تم إلغاء الحجز بنجاح',
    serviceDetailsSubmitted: 'تم إرسال تفاصيل الخدمة بنجاح',
    confirmAccept: 'هل أنت متأكد من قبول هذا الحجز؟',
    confirmReject: 'هل أنت متأكد من رفض هذا الحجز؟',
    confirmCancel: 'هل أنت متأكد من إلغاء هذا الحجز؟',
    cancelNotAllowed: 'لا يمكن إلغاء الحجز قبل موعده بأقل من 24 ساعة',
    errorGeneral: 'حدث خطأ، يرجى المحاولة مرة أخرى',
    errorInvalidId: 'معرف الحجز غير صالح',
    errorFetchPending: 'فشل جلب الحجوزات المعلقة',
    errorFetchCurrent: 'فشل جلب الحجوزات الحالية',
    errorFetchHistory: 'فشل جلب سجل الحجوزات',
    errorAccept: 'فشل قبول الحجز',
    errorReject: 'فشل رفض الحجز',
    errorUpdate: 'فشل تحديث الحجز',
    errorCancel: 'فشل إلغاء الحجز',
    errorServiceDetails: 'فشل إرسال تفاصيل الخدمة'
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeSquare === 'approve') {
          await fetchPendingBookings();
        } else if (activeSquare === 'current') {
          await fetchCurrentBookings();
        } else if (activeSquare === 'history') {
          await fetchHistoryBookings();
        }
      } catch (error) {
        console.error('Fetch error:', error);
        alert(MESSAGES.errorGeneral);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeSquare]);

  const formatArabicDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return `${date.getDate()} ${ARABIC_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateString || 'غير محدد';
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'لا يوجد عنوان';
    if (typeof address === 'string') return address;
    if (typeof address !== 'object' || address === null) return 'عنوان غير صالح';
    return `${address.Building_Num || ''} ${address.streetName || ''}, ${address.cityName || ''}, ${address.govName || ''}`.trim();
  };

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/TechLog');
        return;
      }
  
      const res = await fetch('https://sevenerafy.onrender.com/Technician/getPendingBookings', {
        headers: { Authorization: `Technician ${token}` }
      });
  
      if (!res.ok) throw new Error(MESSAGES.errorFetchPending);
      const data = await res.json();
      
      setPendingBookings((data?.results || []).map(booking => ({
        _id: booking.bookingId || booking._id || '',
        clientName: booking.clientName || 'غير معروف',
        date: formatArabicDate(booking.bookingDate || booking.date),
        time: booking.bookingTime || booking.time || 'غير محدد',
        address: formatAddress(booking.address || (booking.user || {}).address || {}),
        originalData: booking
      })));
    } catch (err) {
      console.error('Error fetching pending bookings:', err);
      alert(err.message || MESSAGES.errorGeneral);
    }
  };

  const fetchCurrentBookings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/TechLog');
        return;
      }
  
      const res = await fetch('https://sevenerafy.onrender.com/Technician/currentBookings', {
        headers: { 'Authorization': `Technician ${token}`, 'Content-Type': 'application/json' }
      });

      if (!res.ok && res.status !== 404) throw new Error(MESSAGES.errorFetchCurrent);
      
      const response = await res.json();
      let bookings = [];
      
      if (response?.data) bookings = response.data;
      else if (response?.results?.data) bookings = response.results.data;
      else if (Array.isArray(response)) bookings = response;

      setCurrentBookings(bookings.map((booking, index) => ({
        _id: booking.bookingId || `unknown-${index}`,
        clientName: booking.userId?.fullName || 'غير معروف',
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime || 'غير محدد',
        serviceCode: booking.serviceCode || '',
        address: booking.address,
        bookingStatus: booking.bookingStatus || 'غير معروف',
        formattedDate: formatArabicDate(booking.bookingDate),
        formattedAddress: formatAddress(booking.address),
        statusArabic: booking.bookingStatus === 'Pending' ? 'في الانتظار' :
                    booking.bookingStatus === 'On the way' ? 'في الطريق 🚚' :
                    booking.bookingStatus === 'in-Progress' ? 'قيد التنفيذ  🔄' : 
                    booking.bookingStatus === 'Completed' ? 'مكتمل ️✅' : 
                    booking.bookingStatus || 'غير محدد',
        originalData: booking
      })));
    } catch (err) {
      console.error('Error fetching current bookings:', err);
      if (err.message !== 'No current bookings found') {
        alert(err.message || MESSAGES.errorGeneral);
      }
      setCurrentBookings([]);
    }
  };

  const fetchHistoryBookings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/TechLog');
        return;
      }
  
      const res = await fetch('https://sevenerafy.onrender.com/Technician/getBookingsHistory', {
        headers: { 'Authorization': `Technician ${token}`, 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error(MESSAGES.errorFetchHistory || 'Error fetching history bookings');
      
      const response = await res.json();
      let bookings = [];
      
      if (response?.bookings) bookings = response.bookings;
      else if (response?.data) bookings = response.data;
      else if (response?.results?.data) bookings = response.results.data;
      else if (Array.isArray(response)) bookings = response;

      setHistoryBookings(bookings.map((booking, index) => ({
        _id: booking.bookingId || `history-${index}`,
        clientName: booking.userId?.fullName || 'غير معروف',
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime || 'غير محدد',
        serviceCode: booking.serviceCode || '',
        address: booking.userId?.address?.[0] || {},
        bookingStatus: 'Completed',
        formattedDate: formatArabicDate(booking.bookingDate),
        formattedAddress: formatAddress(booking.userId?.address?.[0] || {}),
        statusArabic: 'مكتمل ️✅',
        originalData: booking
      })));
    } catch (err) {
      console.error('Error fetching history bookings:', err);
      alert(err.message || MESSAGES.errorGeneral || 'حدث خطأ');
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    if (!bookingId) {
      alert(MESSAGES.errorInvalidId);
      return;
    }

    try {
      setAcceptingId(bookingId);
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/TechLog');
        return;
      }

      const res = await fetch(`https://sevenerafy.onrender.com/Technician/acceptBooking/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Technician ${token}`, 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || MESSAGES.errorAccept);
      }

      alert(MESSAGES.bookingAccepted);
      setPendingBookings(prev => prev.filter(b => b._id !== bookingId));
      await fetchCurrentBookings();
    } catch (err) {
      console.error('Error accepting booking:', err);
      alert(err.message || MESSAGES.errorGeneral);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!bookingId) {
      alert(MESSAGES.errorInvalidId);
      return;
    }

    try {
      setRejectingId(bookingId);
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/TechLog');
        return;
      }

      const res = await fetch(`https://sevenerafy.onrender.com/Technician/rejectBooking/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Technician ${token}`, 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || MESSAGES.errorReject);
      }

      alert(MESSAGES.bookingRejected);
      setPendingBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error('Error rejecting booking:', err);
      alert(err.message || MESSAGES.errorGeneral);
    } finally {
      setRejectingId(null);
    }
  };

  const handleCancelBooking = async (bookingId, bookingDate) => {
    if (!bookingId) {
      alert(MESSAGES.errorInvalidId);
      return;
    }
  
    // Check if the booking is at least 24 hours in the future
    const now = new Date();
    const bookingDateTime = new Date(bookingDate);
    const timeDiff = bookingDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
  
    if (hoursDiff < 24) {
      alert(MESSAGES.cancelNotAllowed);
      return;
    }
  
    if (!window.confirm(MESSAGES.confirmCancel)) {
      return;
    }
  
    try {
      setCancelingId(bookingId);
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/TechLog');
        return;
      }
  
      const res = await fetch(`https://sevenerafy.onrender.com/Technician/cancelBooking/${bookingId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Technician ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || MESSAGES.errorCancel);
      }
  
      alert(MESSAGES.bookingCanceled);
      
      // Refresh the current bookings list
      if (activeSquare === 'current') {
        await fetchCurrentBookings();
      }
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert(err.message || MESSAGES.errorGeneral);
    } finally {
      setCancelingId(null);
    }
  };
  

  const handleUpdateStatus = async (bookingId, currentStatus) => {
    if (!bookingId) {
      alert(MESSAGES.errorInvalidId);
      return;
    }

    try {
      setUpdatingId(bookingId);
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/TechLog');
        return;
      }

      let newStatus;
      if (currentStatus === 'in-Progress') {
        newStatus = 'On the way';
      } else if (currentStatus === 'On the way') {
        newStatus = 'Completed';
      } else {
        alert('لا يمكن تحديث الحالة الحالية');
        return;
      }

      const res = await fetch(`https://sevenerafy.onrender.com/Technician/updateBooking/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Technician ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || MESSAGES.errorUpdate);
      }

      alert(MESSAGES.bookingUpdated);
      
      if (newStatus === 'Completed') {
        setCompletedBookingId(bookingId);
        setShowServiceModal(true);
      }
      
      await fetchCurrentBookings();
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert(err.message || MESSAGES.errorGeneral);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setServiceDetails({ cost: '', serviceCode: '', details: '' });
    setCompletedBookingId(null);
  };

  const handleServiceDetailsChange = (e) => {
    const { name, value } = e.target;
    setServiceDetails(prev => ({ ...prev, [name]: value }));
  };

  const submitServiceDetails = async () => {
    if (!completedBookingId) {
      alert('لا يوجد حجز محدد');
      return;
    }

    if (!serviceDetails.cost || !serviceDetails.serviceCode || !serviceDetails.details) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setUpdatingId(completedBookingId);
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/TechLog');
        return;
      }

      const res = await fetch(
        `https://sevenerafy.onrender.com/Technician/add-service-details/${completedBookingId}`,
        {
          method: 'PATCH',
          headers: { 'Authorization': `Technician ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceCode: serviceDetails.serviceCode,
            cost: Number(serviceDetails.cost),
            serviceDetails: serviceDetails.details
          })
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || MESSAGES.errorServiceDetails);
      }

      alert(MESSAGES.serviceDetailsSubmitted);
      handleCloseServiceModal();
      await fetchCurrentBookings();
      await fetchHistoryBookings();
    } catch (err) {
      console.error('Error submitting service details:', err);
      alert(err.message || MESSAGES.errorGeneral);
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmAction = (action, bookingId) => {
    if (!bookingId) {
      alert(MESSAGES.errorInvalidId);
      return;
    }
    
    if (action === 'accept' && window.confirm(MESSAGES.confirmAccept)) {
      handleAcceptBooking(bookingId);
    } else if (action === 'reject' && window.confirm(MESSAGES.confirmReject)) {
      handleRejectBooking(bookingId);
    }
  };

  const BookingCard = ({ booking, type = 'current', index }) => {
    const currentStatus = booking.bookingStatus || booking.originalData?.bookingStatus;
    
    return (
      <div className="smallSqr" key={`${type}-${booking._id || index}`}>
        <p><span className='icon-tech ic bold'>اسم العميل:</span> {booking.clientName || 'غير معروف'}</p>
        <p><span className='icon-calendar1 ic bold'>التاريخ:</span> {booking.formattedDate || booking.date || 'غير محدد'}</p>
        <p><span className='icon-time ic bold'>الوقت:</span> {booking.bookingTime || booking.time || 'غير محدد'}</p>
        <p><span className='icon-details ic bold'>العنوان:</span>{booking.formattedAddress || booking.address || 'غير محدد'}</p>
        <p><span className='icon-status ic bold'>حالةالحجز:</span>{booking.statusArabic || 'طلب الحجز' }</p>
        {booking.serviceCode && <p><span className='icon-qrcode ic bold'>كودالخدمة:</span>{booking.serviceCode}</p>}

        <div className="flex btns">
          {type === 'approve' ? (
            <>
              <button 
                onClick={() => confirmAction('accept', booking._id)} 
                disabled={acceptingId === booking._id}
              >
                {acceptingId === booking._id ? 'جاري القبول...' : 'قبول'}
              </button>
              <button 
                onClick={() => confirmAction('reject', booking._id)} 
                disabled={rejectingId === booking._id}
              >
                {rejectingId === booking._id ? 'جاري الرفض...' : 'رفض'}
              </button>
            </>
          ) : type === 'current' ? (
            <>
              {currentStatus === 'in-Progress' && (
                <button 
                  onClick={() => handleUpdateStatus(booking._id, 'in-Progress')}
                  disabled={updatingId === booking._id}
                >
                  {updatingId === booking._id ? 'جاري التحديث...' : 'في الطريق'}
                </button>
              )}
              {currentStatus === 'On the way' && (
                <button 
                  onClick={() => handleUpdateStatus(booking._id, 'On the way')}
                  disabled={updatingId === booking._id}
                >
                  {updatingId === booking._id ? 'جاري الإتمام...' : 'إتمام الخدمة'}
                </button>
              )}
              <button 
                onClick={() => handleCancelBooking(booking._id, booking.bookingDate)}
                disabled={cancelingId === booking._id}
              >
                {cancelingId === booking._id ? 'جاري الإلغاء...' : 'إلغاء الحجز'}
              </button>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <section className='HistoryTech'>
      <div className="header">
        <div className="flex titleHeader">
          <span className='icon-profile'></span>
          <h5>حسابي</h5>
        </div>
      </div>

      <div className="container flex">
        <div className="buttons">
          <button onClick={() => navigate('/TechProfile')}>معلومات الحساب</button>
          <button className={activeSquare === 'history' ? 'activeTech' : ''} 
                  onClick={() => setActiveSquare('history')}>سجل الحجز</button>
          <button className={activeSquare === 'current' ? 'activeTech' : ''} 
                  onClick={() => setActiveSquare('current')}>الحجز الحالي</button>
          <button className={activeSquare === 'approve' ? 'activeTech' : ''} 
                  onClick={() => setActiveSquare('approve')}>استقبال الحجوزات</button>
          <button onClick={() => navigate("/Calendar")}>تسجيل جدول المواعيد</button>
        </div>

        {activeSquare === 'current' && (
          <div className="square current">
            <div className="flex-between">
              <h5>الحجوزات الحالية</h5>
            </div>
            <div className="bookings-container">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>{MESSAGES.loading}</p>
                </div>
              ) : currentBookings.length === 0 ? (
                <div className="no-bookings">
                  <p>{MESSAGES.noCurrentBookings}</p>
                  <small>سيظهر هنا أي حجوزات قيد التنفيذ</small>
                </div>
              ) : (
                currentBookings.map((booking, index) => (
                  <BookingCard key={`current-${booking._id || index}`} 
                              booking={booking} 
                              type="current" 
                              index={index} />
                ))
              )}
            </div>
          </div>
        )}

        {activeSquare === 'approve' && (
          <div className="square approve">
            <h5>الحجوزات الجديدة</h5>
            <div className="bookings-container">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>{MESSAGES.loading}</p>
                </div>
              ) : pendingBookings.length === 0 ? (
                <div className="no-bookings">
                  <p>{MESSAGES.noPendingBookings}</p>
                </div>
              ) : (
                pendingBookings.map((booking, index) => (
                  <BookingCard key={`approve-${booking._id || index}`} 
                              booking={booking} 
                              type="approve" 
                              index={index} />
                ))
              )}
            </div>
          </div>
        )}

        {activeSquare === 'history' && (
          <div className="square history">
            <h5>سجل الحجوزات</h5>
            <div className="bookings-container">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>{MESSAGES.loading}</p>
                </div>
              ) : historyBookings.length === 0 ? (
                <div className="no-bookings">
                  <p>{MESSAGES.noHistoryBookings}</p>
                  <small>سيظهر هنا تاريخ الحجوزات المكتملة</small>
                </div>
              ) : (
                historyBookings.map((booking, index) => (
                  <BookingCard key={`history-${booking._id || index}`}
                              booking={booking}
                              type="history"
                              index={index} />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showServiceModal && (
        <div className="modal-overlay">
          <div className="service-modal">
            <h3>سجل البيانات للخدمة التي تمت</h3>
            
            <div className="form-group">
              <label>التكلفة</label>
              <input
                type="number"
                name="cost"
                value={serviceDetails.cost}
                onChange={handleServiceDetailsChange}
                placeholder="أدخل التكلفة"
              />
            </div>
            
            <div className="form-group">
              <label>كود الخدمة</label>
              <input
                type="text"
                name="serviceCode"
                value={serviceDetails.serviceCode}
                onChange={handleServiceDetailsChange}
                placeholder="أدخل كود الخدمة"
              />
            </div>
            
            <div className="form-group">
              <label>تفاصيل الخدمة *</label>
              <textarea
                name="details"
                value={serviceDetails.details}
                onChange={handleServiceDetailsChange}
                placeholder="اكتب هنا..."
                rows="4"
              />
            </div>
            
            <div className="modal-actions">
              <button onClick={handleCloseServiceModal}>إلغاء</button>
              <button 
                onClick={submitServiceDetails} 
                disabled={updatingId === completedBookingId}
              >
                {updatingId === completedBookingId ? 'جاري الإرسال...' : 'إرسال'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}