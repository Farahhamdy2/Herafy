import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './technicians.css';

export default function Technicians({ serviceType = 'سباكة' }) {
  const [technicians, setTechnicians] = useState([]);
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sortOption, setSortOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        setError(null);

        const access_token = localStorage.getItem('access_token');
        if (!access_token) throw new Error('يجب تسجيل الدخول أولاً');

        try {
          const decoded = jwtDecode(access_token);
          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('انتهت صلاحية التوكن');
          }
          setUserData(decoded);
        } catch (decodeError) {
          throw new Error('الـ token غير صالح');
        }

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `User ${access_token}`
        };

        const response = await fetch(
          `https://sevenerafy.onrender.com/User/getTechniciansByService/${serviceType}?sortRating=desc`,
          { headers }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'فشل في جلب بيانات الفنيين');
        }

        const data = await response.json();
        setTechnicians(data || []);
      } catch (error) {
        console.error('حدث خطأ:', error);
        setError(error.message);
        if (
          error.message.includes('jwt') ||
          error.message.includes('مصادقة') ||
          error.message.includes('token')
        ) {
          navigate('/UserLog');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [navigate, serviceType]);

  const toggleFilter = (filter) => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const handleLocationFilter = (gov) => {
    setSelectedLocation(selectedLocation === gov ? null : gov);
    setOpenFilter(null);
  };

  const handleSort = (option) => {
    setSortOption(sortOption === option ? null : option);
    setOpenFilter(null);
  };

  const clearAllFilters = () => {
    setSelectedLocation(null);
    setSortOption(null);
  };

  const filteredTechnicians = selectedLocation
    ? technicians.filter((tech) => tech.Government?.govName === selectedLocation)
    : technicians;

  const sortedTechnicians = [...filteredTechnicians].sort((a, b) => {
    if (sortOption === 'price-asc') return a.initialPrice - b.initialPrice;
    if (sortOption === 'price-desc') return b.initialPrice - a.initialPrice;
    if (sortOption === 'ratings-desc') return (b.ratings || 0) - (a.ratings || 0);
    if (sortOption === 'ratings-asc') return (a.ratings || 0) - (b.ratings || 0);
    return 0;
  });

  const TechnicianCard = ({ name, location, price, Experience_Year, phone, image, ratings = 0, id }) => (
    <div className="card flex">
      <div className="profile">
        <img src={image || './images/default-tech.png'} alt={name} />
      </div>
      <div className="text flex">
        <div className="sec1">
          <h5>{name}</h5>
          <div className="flex ic">
            <div className="icon-location"></div>
            <p>محافظة العمل: {location}</p>
          </div>
          <div className="flex ic">
            <div className="icon-coin-dollar"></div>
            <p>سعر المعاينة: {price} جنيه</p>
          </div>
        </div>
        <div className="sec2">
          <div className="flex ic">
            <div className="icon-schedule"></div>
            <p>سنوات الخبرة: {Experience_Year} سنوات</p>
          </div>
          <div className="flex ic">
            <div className="icon-phone-call"></div>
            <p>رقم الموبايل: {phone}</p>
          </div>
        </div>
      </div>
      <div className="rating">
        <div className="starsService">
          {Array.from({ length: 5 }).map((_, i) => (
            <span 
              key={i} 
              className={i < Math.round(ratings) ? 'star filled' : 'star'}
              style={{ color: i < Math.round(ratings) ? '#FFD700' : '#ccc' }}
            >
              ★
            </span>
          ))}
          <span className="rating-value">({ratings.toFixed(1)})</span>
        </div>
        <button onClick={() => navigate(`/Booking`, { state: { technician: { id, name, location, price, Experience_Year, phone, image, ratings } } })}>
          احجز الآن
        </button> 
         </div>
    </div>
  );

  return (
    <section className="Service">
      <div className="container">
        <div className="title">
          <h5>محترفينا</h5>
          <h4>فريق حرفي متخصص</h4>
        </div>

        <div className="flex filters">
          <div className="filter-container">
            <div 
              className={`flex filter ${selectedLocation ? 'active' : ''}`} 
              onClick={() => toggleFilter('location')}
            >
              <div className="icon-filter"></div>
              <h6>{selectedLocation || 'قم باختيار المحافظة'}</h6>
            </div>
            {openFilter === 'location' && (
              <ul className="dropdown loca">
                <li 
                  onClick={() => handleLocationFilter('القاهرة')}
                  className={selectedLocation === 'القاهرة' ? 'active' : ''}
                >
                  القاهرة
                </li>
                <li 
                  onClick={() => handleLocationFilter('الجيزه')}
                  className={selectedLocation === 'الجيزه' ? 'active' : ''}
                >
                  الجيزه
                </li>
              </ul>
            )}
          </div>

          <div className="filter-container">
            <div 
              className={`flex filter ${sortOption?.includes('price') ? 'active' : ''}`} 
              onClick={() => toggleFilter('price')}
            >
              <div className="icon-filter"></div>
              <h6>
                {sortOption === 'price-asc' ? 'أقل سعر' : 
                 sortOption === 'price-desc' ? 'أعلى سعر' : 
                 'الترتيب حسب السعر'}
              </h6>
            </div>
            {openFilter === 'price' && (
              <ul className="dropdown pri">
                <li 
                  onClick={() => handleSort('price-asc')}
                  className={sortOption === 'price-asc' ? 'active' : ''}
                >
                  أقل سعر
                </li>
                <li 
                  onClick={() => handleSort('price-desc')}
                  className={sortOption === 'price-desc' ? 'active' : ''}
                >
                  أعلى سعر
                </li>
              </ul>
            )}
          </div>

          <div className="filter-container">
            <div 
              className={`flex filter ${sortOption?.includes('ratings') ? 'active' : ''}`} 
              onClick={() => toggleFilter('rating')}
            >
              <div className="icon-filter"></div>
              <h6>
                {sortOption === 'ratings-desc' ? 'التقييم الأعلى' : 
                 sortOption === 'ratings-asc' ? 'التقييم المنخفض' : 
                 'الترتيب حسب التقييم'}
              </h6>
            </div>
            {openFilter === 'rating' && (
              <ul className="dropdown rate">
                <li 
                  onClick={() => handleSort('ratings-desc')}
                  className={sortOption === 'ratings-desc' ? 'active' : ''}
                >
                  التقييم الأعلى
                </li>
                <li 
                  onClick={() => handleSort('ratings-asc')}
                  className={sortOption === 'ratings-asc' ? 'active' : ''}
                >
                  التقييم المنخفض
                </li>
              </ul>
            )}
          </div>

          {(selectedLocation || sortOption) && (
            <button className="clear-filters" onClick={clearAllFilters}>
              حذف التصفية
            </button>
          )}
        </div>

        {loading && <div className="loading">جاري تحميل الفنيين...</div>}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            {error.includes('jwt') || error.includes('مصادقة') ? (
              <button onClick={() => navigate('/UserLog')}>تسجيل الدخول</button>
            ) : (
              <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
            )}
          </div>
        )}

        {!loading && !error && sortedTechnicians.length === 0 && (
          <div className="no-results">
            <p>لا يوجد فنيين متطابقين مع معايير البحث.</p>
            <button onClick={clearAllFilters}>عرض جميع الفنيين</button>
          </div>
        )}

        {!loading && !error && sortedTechnicians.length > 0 && (
          <div className="technicians-list">
            {sortedTechnicians.map((tech) => (
              <TechnicianCard
                key={tech._id || tech.id}
                id={tech._id || tech.id}
                name={tech.fullName}
                location={tech.Government?.govName}
                price={tech.initialPrice}
                Experience_Year={tech.Experience_Year || 0}
                phone={tech.phoneNumber}
                image={tech.profileImage?.secure_url}
                ratings={tech.ratings}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}