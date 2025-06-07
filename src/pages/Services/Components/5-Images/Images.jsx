import React from 'react'
import './images.css'

export default function Images() {
  return (
    <section className='Images'>
      <div className="scrol flex">
        <div className="ImgSqr">
          <div className="overlayyy"></div>
          <img src="./images/serv1.png" alt="Image" />
        </div>
        <div className="ImgSqr">
          <div className="overlayyy"></div>
          <img src="./images/serv2.png" alt="Image" />
        </div>
        <div className="ImgSqr">
          <div className="overlayyy"></div>
          <img src="./images/serv3.png" alt="Image" />
        </div>
        <div className="ImgSqr">
          <div className="overlayyy"></div>
          <img src="./images/serv4.png" alt="Image" />
        </div>
      </div>
    </section>
  )
}
