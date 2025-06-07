import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './book.css';

export default function Book() {
  const location = useLocation();
  const { technician } = location.state || {};
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingInfo, setBookingInfo] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [waitingModal, setWaitingModal] = useState(false);

  const daysInArabic = {
    Monday: 'الإثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',
    Sunday: 'الأحد',
  };

  useEffect(() => {
    if (!technician?.id) return;

    const fetchSchedule = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('يجب تسجيل الدخول أولاً');
        return;
      }

      try {
        const res = await fetch(`https://sevenerafy.onrender.com/User/getTechnicianSchedule/${technician.id}`, {
          headers: { Authorization: `User ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setSchedule(data);
          if (data.length) {
            setSelectedDate(data[0].date);
            setSelectedTime(data[0].timeSlots?.[0] || '');
          }
        } else {
          alert('فشل في تحميل المواعيد');
        }
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء تحميل المواعيد');
      }
    };

    fetchSchedule();
  }, [technician]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return alert('يرجى اختيار اليوم والوقت');
    const token = localStorage.getItem('access_token');
    if (!token) return alert('يجب تسجيل الدخول');

    try {
      const res = await fetch('https://sevenerafy.onrender.com/User/createBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `User ${token}`,
        },
        body: JSON.stringify({
          technicianId: technician.id,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setBookingId(result.bookingId);
      setWaitingModal(true);
    } catch (err) {
      alert(`فشل الحجز: ${err.message}`);
    }
  };

  useEffect(() => {
    if (!bookingId) return;

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`https://sevenerafy.onrender.com/User/getBookingStatus/${bookingId}`, {
          headers: { Authorization: `User ${token}` }
        });
        const result = await res.json();

        if (result.bookingStatus === 'Confirmed' || result.bookingStatus === 'Ongoing') {
          clearInterval(interval);
          setBookingInfo({
            serviceCode: result.serviceCode,
            technicianName: result.technicianName,
            date: result.date,
            time: result.time,
            day: result.day,
          });
          setWaitingModal(false);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingId]);

  return (
    <section className="Booking">
      <div className="header">
        <div className="flex titleHeader">
          <span className="icon-calendar"></span>
          <h5>اختار ميعاد خدمتك !</h5>
        </div>
      </div>

      {technician && (
        <div className="TechCard flex">
          <div className="Card2">
            <h6>فني {technician.specialization}</h6>
            <p>الإسم : {technician.name}</p>
            <p>المحافظة : {technician.location}</p>
            <p>سعر المعاينة : {technician.price} جنيه</p>
            <p>الخبرة : {technician.Experience_Year} سنوات</p>
          </div>
          <div className="leftSec">
            <div className="Prof">
              <img src={technician.image || './images/default-tech.png'} alt="Profile" />
            </div>
            <div className="stars">
              <p>{technician.ratings?.toFixed(1) || '0.0'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="Reserve">
        <div className="days">
          <h6 className="tit">اختر يوم خدمتك</h6>
          <div className="flex day">
            {schedule.length === 0 ? (
              <p>جارٍ تحميل المواعيد المتاحة...</p>
            ) : (
              schedule.map((item, index) => (
                <div
                  key={index}
                  className={`selections ${selectedDate === item.date ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDate(item.date);
                    setSelectedTime(item.timeSlots?.[0] || '');
                  }}
                >
                  <h6>{daysInArabic[item.day] || item.day}</h6>
                  <p>{item.date}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="times">
          <h6 className="tit">اختر ميعاد خدمتك</h6>
          <div className="flex time">
            {selectedDate ? (
              (schedule.find(item => item.date === selectedDate)?.timeSlots?.length > 0 ? (
                schedule.find(item => item.date === selectedDate).timeSlots.map((time, i) => (
                  <div
                    key={i}
                    className={`selections ti ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    <h6>{time}</h6>
                  </div>
                ))
              ) : (
                <p>لا توجد مواعيد متاحة في هذا اليوم</p>
              ))
            ) : (
              <p>يرجى اختيار يوم أولاً</p>
            )}
          </div>
        </div>
      </div>

      <button onClick={handleBooking}>حجز</button>

      {waitingModal && (
        <div className="popup-success">
          <div className="popup-content Pend">
            <h3>تم إرسال طلب الحجز</h3>
            <p>جارٍ انتظار تأكيد الفني...</p>
            <p className="note">⏳ يرجى متابعة الحجز الحالي في حسابك </p>
            <p className="note">لتتبع خدمتك في وقتها من خلال تطبيق حرفي</p>
            <button className='BtnBook' onClick={() => setWaitingModal(false)}>حسنًا</button>
          </div>
        </div>
      )}

      {bookingInfo && (
        <div className="popup-success">
          <div className="popup-content">
            <h3>تم تأكيد حجز الخدمة</h3>
            <p>كود الخدمة: {bookingInfo.serviceCode}</p>
            <p>الفني: {bookingInfo.technicianName}</p>
            <p>اليوم: {daysInArabic[bookingInfo.day] || bookingInfo.day}</p>
            <p>التاريخ: {bookingInfo.date}</p>
            <p>الوقت: {bookingInfo.time}</p>
            <p className="note">⚠️ تابع خدمتك عبر تطبيق حرفي</p>
            <button onClick={() => setBookingInfo(null)}>حسنًا</button>
          </div>
        </div>
      )}
    </section>
  );
}
