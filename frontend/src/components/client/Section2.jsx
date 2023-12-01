import React, { useEffect, useState, useRef, useCallback } from "react";
import "../../style/client/section2.css";
import Product from "./Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";


const Section2 = (props) => {
  const host = import.meta.env.VITE_HOST;
  const Ref = useRef();
  const Rbtn = useRef();
  const Lbtn = useRef();
  const slideLeft = () => {
    Ref.current.scrollLeft -= 200;
  };
  const slideRight = () => {
    Ref.current.scrollLeft += 200;
    if(window.innerWidth >= 900){
      Lbtn.current.style.display = "inline-block";
    }
  };
  const [results, setResults] = useState([]);
  const fetchData = useCallback(() => {
    fetch(`${host}/api/client/home?category=${props.category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((jsonData) => jsonData.json())
      .then((data) => {
        if (data.success) {
          setResults(data.products);
        }
      })
      .catch((err) => console.log(err));
  }, [props.category, host]);
  useEffect(() => {
    fetchData();
    if (window.innerWidth >= 900) {
      if (results.length > 6) {
        Rbtn.current.style.display = "inline-block";
      } else {
        Rbtn.current.style.display = "none";
        Lbtn.current.style.display = "none";
      }
    }
  }, [fetchData, results.length]);
  return (
    <section>
      <div className="slide">
        <h3>{props.heading}</h3>
        <div
          className="flexbox"
          id={props.index}
          ref={Ref}
          style={{ scrollLeft: "320px" }}
        >
          <button
            className="btn-flexbox left-flexbox"
            ref={Lbtn}
            onClick={slideLeft}
            title="Previous"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className="btn-flexbox right-flexbox"
            ref={Rbtn}
            onClick={slideRight}
            title="Next"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          {results &&
            results.map((result) => {
              return (
                <Product
                  img={result.images[0]}
                  alt={result.name}
                  name={result.name}
                  detail={result.more}
                  link={result._id}
                  key={result._id}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Section2;
