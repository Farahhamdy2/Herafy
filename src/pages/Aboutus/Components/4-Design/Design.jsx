import React from 'react'
import './design.css'

export default function Design() {
  return (
    <section className='design'>
      <div className="container">
        <div className="sec1">
          <div className="flex line">
            <div>
              <p>خدمة عالية الجودة</p>
            </div>
            <div className="image">
              <img src="./images/design1.png" alt="Image" />
            </div>
            <div>
              <p>التركيب والإصلاح</p>
            </div>
            <div className="linesImg">
              <img src="./images/lines.png" alt="image" />
            </div>
          </div>
          <div className="flex line">
            <div className="image">
              <img src="./images/design2.png" alt="Image" />
            </div>
            <div>
              <p>خدمات من قبل فنيون</p>
            </div>
            <div className="arrImg">
              <img src="./images/arr.png" alt="Image" />
            </div>
          </div>
          <div className="flex line">
            <div>
              <p>محترفون</p>
            </div>
            <div className="sunImg">
              <img src="./images/Sun.png" alt="Image" />
            </div>
            <div>
               <p>لتلبية الاحتياجات </p>
            </div>
          </div>
          <p>الكاملة</p>
        </div>
      </div>

    </section>
  )
}
