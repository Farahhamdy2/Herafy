import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./calendar.css";

export default function Calend() {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState([]);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [weekDays, setWeekDays] = useState([]);
  const [monthName, setMonthName] = useState("");

  const arabicToEnglishDay = {
    "السبت": "Saturday",
    "الأحد": "Sunday",
    "الاثنين": "Monday",
    "الثلاثاء": "Tuesday",
    "الأربعاء": "Wednesday",
    "الخميس": "Thursday",
    "الجمعة": "Friday",
  };

  const timeSlots = [
    "8:00 - 10:00 AM",
    "10:00 - 12:00 AM",
    "12:00 - 2:00 PM",
    "2:00 - 4:00 PM",
    "4:00 - 6:00 PM",
    "6:00 - 8:00 PM",
    "8:00 - 10:00 PM",
  ];

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const daysUntilSaturday = (7 - dayOfWeek + 6) % 7;
    if (dayOfWeek !== 6) {
      startOfWeek.setDate(today.getDate() + daysUntilSaturday);
    }

    const newWeek = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const formattedDate = date.toISOString().split("T")[0];
      const todayStr = new Date().toISOString().split("T")[0];
      if (formattedDate >= todayStr) {
        return {
          name: date.toLocaleDateString("ar-EG", { weekday: "long" }),
          date: formattedDate,
        };
      }
      return null;
    }).filter(Boolean);

    setWeekDays(newWeek);
    setMonthName(startOfWeek.toLocaleDateString("ar-EG", { month: "long" }));
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      const access_token = localStorage.getItem("access_token");
      try {
        const res = await fetch("https://sevenerafy.onrender.com/Technician/getSchedule", {
          headers: {
            Authorization: `Technician ${access_token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.schedule)) {
            const times = {};
            const days = [];
            const todayStr = new Date().toISOString().split("T")[0];

            data.schedule.forEach((item) => {
              if (item.date >= todayStr) {
                times[item.date] = item.timeSlots;
                days.push(item.date);
              }
            });

            setSelectedTimes(times);
            setSelectedDays(days);
            setConfirmed(true);
          }
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, []);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", { weekday: "long" });
  };

  const toggleDaySelection = (date) => {
    setSelectedDays((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleChooseAppointments = () => {
    if (selectedDays.length > 0) {
      setShowTimeSelection(true);
    }
  };

  const handleTimeSelection = (day, time) => {
    setSelectedTimes((prev) => {
      const updated = { ...prev };
      if (updated[day]?.includes(time)) {
        updated[day] = updated[day].filter((t) => t !== time);
        if (updated[day].length === 0) delete updated[day];
      } else {
        updated[day] = updated[day] ? [...updated[day], time] : [time];
      }
      return updated;
    });
  };

  const handleConfirmSchedule = async () => {
    if (Object.keys(selectedTimes).length === 0) return;

    const scheduleData = Object.entries(selectedTimes).map(([date, slots]) => {
      const dayArabic = getDayName(date);
      return {
        day: arabicToEnglishDay[dayArabic],
        date,
        timeSlots: slots,
      };
    });

    const access_token = localStorage.getItem("access_token");
    const endpoint = isEditing
      ? "https://sevenerafy.onrender.com/Technician/updateSchedule"
      : "https://sevenerafy.onrender.com/Technician/createSchedule";

    try {
      const res = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Technician ${access_token}`,
        },
        body: JSON.stringify({ schedule: scheduleData }),
      });

      if (res.ok) {
        setConfirmed(true);
        setIsEditing(false);
        setShowTimeSelection(false);
      } else {
        alert(isEditing ? "فشل تحديث الجدول." : "لديك جدول بالفعل.");
      }
    } catch (err) {
      alert("حدث خطأ أثناء إرسال البيانات.");
      console.error(err);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setConfirmed(false);
    setShowTimeSelection(false);
  };

  return (
    <section className="Calendar">
      <div className="header">
        <div className="flex titleHeader">
          <span className="icon-profile"></span>
          <h5>حسابي</h5>
        </div>
      </div>

      <div className="Calend">
        <div className="flex">
          <div className="icon-calendar"></div>
          <h6>{monthName}</h6>
        </div>

        {!confirmed ? (
          <>
            <p>اختر الأيام المناسبة لك لهذا الأسبوع</p>

            {!showTimeSelection ? (
              <>
                <div className="days-container">
                  {weekDays.map((day, index) => (
                    <button
                      key={index}
                      className={`day ${selectedDays.includes(day.date) ? "selected" : ""}`}
                      onClick={() => toggleDaySelection(day.date)}
                    >
                      {day.name} <br /> {day.date}
                    </button>
                  ))}
                </div>

                <button
                  className="choose"
                  onClick={handleChooseAppointments}
                  disabled={selectedDays.length === 0}
                >
                  اختيار المواعيد
                </button>
              </>
            ) : (
              selectedDays.map((day, index) => (
                <div key={index} className="dates">
                  <h4>{getDayName(day)} - {day}</h4>
                  <div className="time-slots">
                    {timeSlots.map((slot, idx) => (
                      <div key={idx} className="time-option">
                        <input
                          type="checkbox"
                          id={`${day}-${idx}`}
                          value={slot}
                          checked={selectedTimes[day]?.includes(slot)}
                          onChange={() => handleTimeSelection(day, slot)}
                        />
                        <label htmlFor={`${day}-${idx}`}>{slot}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {showTimeSelection && Object.keys(selectedTimes).length > 0 && (
              <button className="confirm" onClick={handleConfirmSchedule}>
                تأكيد الجدول
              </button>
            )}
          </>
        ) : (
          <>
            <h3>جدول مواعيدك</h3>
            <div className="schedule">
              {Object.entries(selectedTimes)
                .filter(([date]) => date >= new Date().toISOString().split("T")[0])
                .map(([date, times], idx) => (
                  <div key={idx} className="schedule-row">
                    <div className="day-name">
                      {getDayName(date)}
                      <div className="day-date">{date}</div>
                    </div>
                    <div className="time-slots">{times.join(" / ")}</div>
                  </div>
              ))}
            </div>
            <div className="actions">
              <button className="home" onClick={() => navigate("/")}>
                الرئيسية
              </button>
              <button className="edit" onClick={handleEditClick}>
                تعديل
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
