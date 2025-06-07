import React from 'react'
import './need.css'

export default function Need() {
  return (
    <section className='Need'>
      <div className="container flex">
        <div className="image">
          <img src="./images/house.png" alt="Home" />
        </div>
        <div className="text">
          <h4>هل تحتاج إلى جدولة خدمتك الأولى؟</h4>
          <button>احجز خدمتك</button>
        </div>
      </div> 
    </section>
  )
}
