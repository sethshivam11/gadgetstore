import React, { useState } from "react";
import "../../style/client/section1.css";
import { Link } from "react-router-dom";
import poster1 from "../../img/poster1.jpg";

const Section1 = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const showSlide = (index) => {
    const slides = document.querySelectorAll(".carousel-slide");
    if (index < 0) {
      setSlideIndex(slides.length - 1);
    } else if (index >= slides.length) {
      setSlideIndex(0);
    } else {
      setSlideIndex(index);
    }
  };
  const handleLeft = () => {
    showSlide(slideIndex - 1);
  };
  const handleRight = () => {
    showSlide(slideIndex + 1);
  };
  return (
    <section>
      <div id="carousel">
        <button
          type="button"
          className="btn-car"
          id="left-car"
          onClick={handleLeft}
        >
          <i className="fa fa-chevron-left"></i>
        </button>
        <Link
          to="/mobiles"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/ee78de50f9dbe993.jpg?q=20"
            alt="poster1"
          />
        </Link>
        <Link
          to="/mobiles"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/cb8a624c94eb850e.jpg?q=20"
            alt="poster2"
          />
        </Link>
        <Link
          to="/mobiles"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/364c9a92201246a6.jpg?q=20"
            alt="poster3"
          />
        </Link>
        <Link
          to="/mobiles"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/ee78de50f9dbe993.jpg?q=20"
            alt="poster4"
          />
        </Link>
        <button
          type="button"
          className="btn-car"
          id="right-car"
          onClick={handleRight}
        >
          <i className="fa fa-chevron-right"></i>
        </button>
      </div>
      <div id="carousel-mobile">
        <Link
          to="/mobiles"
          className="carousel-slide-mobile"
        >
          <img
            src={poster1}
            alt="poster1"
          />
        </Link>
      </div>
      <div id="posters">
        <Link to="/mobiles" className="poster">
          <h3>Coming Soon</h3>
          <img
            src="http://res.cloudinary.com/dv3qbj0bn/image/upload/v1696261588/gadget-store/vkcq1vkwwvxgqytsgb0s.webp"
            alt="IPhone 15 Pro Max"
            className="poster-img"
          />
        </Link>
        <Link to="/mobiles" className="poster black">
          <h3>Sale is Live!</h3>
          <img
            src="http://res.cloudinary.com/dv3qbj0bn/image/upload/v1696261591/gadget-store/cdwhai2dyzik597ie8fr.png"
            alt="Samsung S23 Ultra"
            className="poster-img"
          />
        </Link>
        <Link to="/accessories" className="poster">
          <h3>Great Offers</h3>
          <img
            src="http://res.cloudinary.com/dv3qbj0bn/image/upload/v1696261591/gadget-store/imusw3ekxbcsvbgyulrz.webp"
            alt="Boat Airdopes"
            className="poster-img"
          />
        </Link>
      </div>
    </section>
  );
};

export default Section1;