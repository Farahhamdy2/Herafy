import React, { useRef, useState } from 'react'
import './video.css'

export default function Video() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideo = () => {
    if (isPlaying) {
      videoRef.current.pause();  
    } else {
      videoRef.current.play();   
    }
    setIsPlaying(!isPlaying); 
  };

  return (
    <section className='vIdeo'>
      <div className="container">
        <div className="title">
          <h5>عمليتنا</h5>
          <h3>خدمات منزلية</h3>
          <p>خدمتنا عبر الموقع تتيح لك حجز أفضل الحرفيين المتخصصين في النجارة، السباكة، الكهرباء، والنقاشة بكل سهولة. <br/> اختر الخدمة، حدد الموعد المناسب، وتابع تقدم العمل حتى الانتهاء</p>
        </div>
        <div className="vid">
          <div className="overlay2"></div>
          <div className="aboutVideo">
            <video ref={videoRef} muted>
              <source src="./videos/about.mp4" type="video/mp4" />
            </video>
          </div>
          <button className="play" onClick={toggleVideo}>
            <p>{isPlaying ? 'إيقاف' : 'تشغيل'}</p> 
          </button>
        </div>
        <div className="section2">
          <div className="cards2 flex">
            <div className="card one">
              <div className="iconImg">
                <img src="./images/Diploma.png" alt="Icon" />
              </div>
              <div className="text">
                <h5>الفنيين المرخصين</h5>
                <p>الفنيون لدينا مرخصون وذو كفاءة عالية، يتمتعون بخبرة واسعة في مجالاتهم لضمان تقديم خدمة <br/> آمنة وموثوقة.</p>
            </div>
            </div>
            <div className="card">
              <div className="iconImg">
                <img src="./images/Like.png" alt="Icon" />
              </div>
              <div className="text">
                <h5>خدمة ذات تقييم عالي</h5>
                <p>خدمتنا حاصلة على تقييمات عالية من عملائنا بفضل الجودة والاحترافية في <br/> التنفيذ. </p>
            </div>
            </div>
            <div className="card">
              <div className="iconImg">
                <img src="./images/Hammer and Anvil.png" alt="Icon" />
              </div>
              <div className="text">
                <h5>خدمات في الوقت المناسب</h5>
                <p>نلتزم بتقديم خدماتنا في الوقت المحدد لضمان راحة عملائنا ورضاهم. فريقنا يعمل بكفاءة لتلبية احتياجاتك بأسرع <br/> وقت ممكن وبدون تأخير.</p>
            </div>
            </div>
            <div className="card">
              <div className="iconImg">
                <img src="./images/Screw.png" alt="Icon" />
              </div>
              <div className="text">
                <h5>خدمات ذات جودة عالية</h5>
                <p>نقدم خدمات عالية الجودة تلبي توقعات عملائنا وتفوقها، مع الحرص على أدق التفاصيل.</p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
