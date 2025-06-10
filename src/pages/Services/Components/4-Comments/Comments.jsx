import React, { useState, useEffect } from 'react';
import './comments.css';

const CommentCard = ({ name, comment, rating, image }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= rating ? 'full' : 'empty'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="out">
      <div className="card">
        <div className="comma">
          <img src="./images/comma.png" alt="علامة اقتباس" />
        </div>
        <div className="slide-caption">
          <h3>{name}</h3>
          <p>{comment}</p>
        </div>
        <div className="stars">
          {renderStars(rating)}
        </div>
        <div className="UserImg">
          <img src={image || './images/Account.png'} className="swiper-lazy" alt={`صورة المستخدم ${name}`} />
        </div>
      </div>
    </div>
  );
};

export default function Comments() {
  const [feedbacks, setFeedbacks] = useState([]);
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
        
        setFeedbacks(data.feedbacks);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">خطأ في تحميل البيانات: {error}</div>;

  return (
    <section className="comment" aria-labelledby="comments-heading">
      <div className="container">
        <div className="flex title">
          <div className="tit">
            <h6>شهادات</h6>
            <h4 id="comments-heading">اقرأ آراء العملاء الراضين</h4>
          </div>
          <div className="text">
            <p>
              آراء عملائنا شهادة على جودة خدماتنا ورضاهم عن تجربتهم معنا. <br />
              نفخر بتقديم خدمة احترافية تنال إعجاب وثقة عملائنا دائمًا.
            </p>
          </div>
        </div>

        <div className="slide">
          <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
            
            <div className="carousel-indicators">
              {feedbacks.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#carouselExampleAutoplaying"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : 'false'}
                  aria-label={`الشهادة ${index + 1}`}
                ></button>
              ))}
            </div>

            <div className="carousel-inner">
              {feedbacks.map((feedback, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={feedback._id}>
                  <CommentCard 
                    name={feedback.userId?.fullName || 'عميل'} 
                    comment={feedback.feedbackText} 
                    rating={feedback.Rating} 
                    image="./images/Account.png"
                  />
                </div>
              ))}
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">السابق</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">التالي</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}