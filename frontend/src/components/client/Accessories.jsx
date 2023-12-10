import React, { useCallback, useEffect, useRef, useState } from "react";
import Product from "./Product";
import "../../style/client/accessories.css";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Accessories = (props) => {
  const { category, subCategory } = props;
  const host = import.meta.env.VITE_HOST;
  const left = useRef();
  const right = useRef();
  const Ref = useRef();
  const slideLeft = (i) => {
    Ref.current.scrollLeft -= 200;
  };
  const slideRight = (i) => {
    Ref.current.scrollLeft += 200;
    if (window.innerWidth >= 900) {
      left.current.style.display = "inline-block";
    }
  };
  const [results, setResults] = useState([]);
  const fetchData = useCallback(() => {
    fetch(
      `${host}/api/client/home?${
        category ? "category=" + category : "subCategory=" + subCategory
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((jsonData) => jsonData.json())
      .then((data) => {
        if (data.success) {
          if (category) {
            setResults(data.products.reverse());
          }
          else{
            setResults(data.products);
          }
        }
      })
      .catch((err) => console.log(err));
  }, [host, category, subCategory]);
  useEffect(() => {
    fetchData();
    if (window.innerWidth >= 900) {
      if (results.length > 3) {
        right.current.style.display = "inline-block";
      } else {
        right.current.style.display = "none";
        left.current.style.display = "none";
      }
    }
  }, [fetchData, results.length]);
  return (
    <div className="box">
      <h3>{props.heading}</h3>
      <div className="flexbox smallbox" ref={Ref}>
        <button
          ref={left}
          className={`btn-flexbox left-flexbox a${props.index}-left ${
            results.length > 1 ? "" : "d-none"
          }`}
          onClick={() => slideLeft(0)}
          title="Previous"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          ref={right}
          className={`btn-flexbox right-flexbox a${props.index}-right ${
            results.length > 2 ? "" : "d-none"
          }`}
          onClick={() => slideRight(0)}
          title="Next"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        {results.length > 0 &&
          results.map((result_1) => {
            return (
              <Product
                img={result_1.images[0]}
                alt={result_1.name}
                name={result_1.name}
                detail={result_1.more}
                link={result_1._id}
                key={result_1._id}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Accessories;
