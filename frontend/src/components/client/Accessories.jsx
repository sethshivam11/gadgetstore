import React, { useCallback, useEffect, useRef, useState } from "react";
import Product from "./Product";
import "../../style/client/accessories.css";

const Accessories = (props) => {
  const host = process.env.REACT_APP_HOST;
  const left = useRef();
  const right = useRef();
  const Ref = useRef();
  const slideLeft = (i) => {
Ref.current.scrollLeft -= 990;
  };
  const slideRight = (i) => {
Ref.current.scrollLeft += 990;
if (window.innerWidth >= 900) {
  left.current.style.display = "inline-block";
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
    }, [host, props.category]);
  useEffect(() => {
    fetchData();
    if (window.innerWidth >= 900) {
      if (results.length > 6) {
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
              className={`btn-flexbox left-flexbox a0-left ${
                results.length > 1 ? "" : "d-none"
              }`}
              onClick={() => slideLeft(0)}
            >
              <i className="fa fa-chevron-left"></i>
            </button>
            <button
            ref={right}
              className={`btn-flexbox right-flexbox a0-right ${
                results.length > 1 ? "" : "d-none"
              }`}
              onClick={() => slideRight(0)}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
            {results &&
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
