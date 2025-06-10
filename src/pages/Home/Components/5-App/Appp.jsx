import React from 'react'
import './app.css'

export default function Appp() {
  return (
    <section className='app wave-div'>
        <div className="container">
          <div className="flex sec">
            <div className="text">
              <h3>احصل على تطبيق حِرَفِـي الآن</h3>
                <div className="flex buttons">
                  <button>
                     App Store<span><img src="./images/App store.png" alt="Appstore" /></span>
                  </button>
                  <button>
                    Google Play<span><img src="./images/Google play.png" alt="Googleplay" /></span> 
                  </button>
                </div>
            </div>
            <div className="appImg">
              <img src="./images/appUI.png" alt="App" />
            </div>
          </div>
        </div>
        <svg
          className="wave-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#f0f0f0" /* Same as div background */
            fillOpacity="1"
            d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,170.7C672,160,768,96,864,96C960,96,1056,160,1152,176C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
    </section>
  )
}
