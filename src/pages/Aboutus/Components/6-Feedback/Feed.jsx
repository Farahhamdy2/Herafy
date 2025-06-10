import React, { useState, useEffect } from 'react';
import './feed.css';

export default function Feed() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('https://sevenerafy.onrender.com/getFeedbacks');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.feedbacks || !Array.isArray(data.feedbacks)) {
          throw new Error('Invalid data format: expected feedbacks array');
        }
        
        if (data.feedbacks.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.feedbacks.length);
          setFeedback(data.feedbacks[randomIndex]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    
    return stars;
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">خطأ في تحميل البيانات: {error}</div>;
  if (!feedback) return <p>لا توجد آراء متاحة حالياً</p>;

  return (
    <section>
      <div className="container flex">  
        <div className="RightSecc">
          <h6>رأي العميل</h6>
          <h5>العملاء السعداء</h5>
          
          <div>
            <div className="stars">
              {renderStars(feedback.Rating)}
            </div>
            <p>{feedback.feedbackText}</p>
            <hr/>
            <div className="flex user">
              <div className="userImg">
                <img src="./images/user.png" alt="User" />
              </div>
              <div className="username">
                <h6>{feedback.userId?.fullName || 'عميل'}</h6>
                <h6>عميل مميز</h6>
              </div>
            </div>
          </div>
        </div>
        
        <div className="LeftSec">
          <div className="image">
            <img src="./images/customer.png" alt="Image" />
          </div>
        </div>
      </div>
    </section>
  );
}