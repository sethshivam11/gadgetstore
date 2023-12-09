import React, { useState } from "react";
import "../../style/client/section1.css";
import { Link } from "react-router-dom";
import poster1 from "../../img/poster1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Section1 = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  document.title = "Gadget Store";
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
          title="Previous Slide"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <Link
          to="/product/65570677fff32e1334137d8e"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1700152858/gadget-store/sv1x9mvkpnwulkyxvnuk.webp"
            loading="eager"
            alt="Redmi Note 12 Pro 5G"
          />
        </Link>
        <Link
          to="/product/655708f5fff32e1334137d91"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1700152858/gadget-store/dldza9wau2nzxvlzrllo.webp"
            loading="lazy"
            alt="Vivo T2 5G"
          />
        </Link>
        <Link
          to="/product/65570bbefff32e1334137d94"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1700152858/gadget-store/cxfbybjwhfuufpiepgfu.webp"
            loading="lazy"
            alt="Realme 11 Pro+ 5G"
          />
        </Link>
        <Link
          to="/product/65570fe6fff32e1334137da2"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1700152858/gadget-store/coytkw0mqdkbczw66env.webp"
            loading="lazy"
            alt="Vivo T2 Pro 5G"
          />
        </Link>
        <Link
          to="/product/655711ccfff32e1334137da5"
          className="carousel-slide"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <img
            src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1700152858/gadget-store/pbu5vkeangccekjzvbwu.webp"
            loading="lazy"
            alt="Realme C53 5G"
          />
        </Link>
        <button
          type="button"
          className="btn-car"
          id="right-car"
          onClick={handleRight}
          title="Next Slide"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div id="carousel-mobile">
        <Link to="/mobiles" className="carousel-slide-mobile">
          <img loading="lazy" src={poster1} alt="poster1" />
        </Link>
      </div>
      <div id="posters">
        <Link
          to="/product/6552102c4ea3dc5baaee89c1"
          className="poster"
          id="section1-poster1"
        >
          <h3>Best Selling</h3>
          <img
            loading="lazy"
            src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1699876898/gadget-store/jsc3r0tpzzyoawfypi1f.webp"
            alt="IPhone 15 Pro Max"
            className="poster-img"
          />
        </Link>
        <Link
          to="/product/65532047866ab4dc4d046cf1"
          className="poster black"
          id="section1-poster2"
        >
          <h3>Sale is Live!</h3>
          <img
            loading="lazy"
            src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1701880713/gadget-store/wdnwwtttnjkbtkwqqamb.png"
            alt="Samsung S23 Ultra"
            className="poster-img"
          />
        </Link>
        <Link
          to="/product/65635c6e4b12a6f1975d5b2e"
          className="poster"
          id="section1-poster3"
        >
          <h3>Great Offers</h3>
          <img
            loading="lazy"
            src="http://res.cloudinary.com/dv3qbj0bn/image/upload/v1702145508/gadget-store/fthy2q1uzt8v4ic8ouzs.webp"
            alt="Boat Airdopes"
            className="poster-img"
          />
        </Link>
      </div>
    </section>
  );
};

export default Section1;
