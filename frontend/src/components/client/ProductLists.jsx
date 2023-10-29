import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import "../../style/client/productlists.css";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const ProductLists = (props) => {
  const host = process.env.REACT_APP_HOST;
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState(false);
  const apple = useRef();
  const samsung = useRef();
  const xiaomi = useRef();
  const oppo = useRef();
  const realme = useRef();
  const vivo = useRef();
  const oneplus = useRef();
  const google = useRef();
  const motorola = useRef();
  const poco = useRef();
  const nothing = useRef();
  const min = useRef();
  const max = useRef();
  const sortBtn = useRef();
  const lists = useRef();
  // Set products
  const fetchData = useCallback(() => {
    fetch(`${host}/api/client/home?category=${props.category}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((jsonData) => setProducts(jsonData.products))
      .catch((err) => console.log(err));
  }, [host, props.category]);
  
  useEffect(() => {
    const listenscroll = () => {
      if (window.innerWidth <= 900) {
        let pos = lists.current.getBoundingClientRect();
        let win = window.innerHeight;
        if (pos.bottom <= win) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      } else {
        setVisible(false);
      }
    };
    if (window.innerWidth <= 900) {
      setVisible(true);
    } else {
      setFilter(true);
    }
    window.addEventListener("scroll", listenscroll);
    fetchData();
    return () => window.removeEventListener("scroll", listenscroll);
  }, [fetchData]);
  let arr = [
    apple,
    samsung,
    oppo,
    xiaomi,
    vivo,
    realme,
    oneplus,
    google,
    motorola,
    poco,
    nothing,
  ];
  // only one checked box
  function checkChecked(value) {
    let some = [];
    arr.forEach((checkbox) => {
      props.setProgress(50);
      if (!checkbox.current.checked) {
        some.push(true);
      } else if (checkbox.current.value === value) {
        some.push(true);
      } else {
        some.push(false);
      }
    });
    if (some.includes(false)) {
      props.setProgress(70);
      return false;
    }
    props.setProgress(70);
    return true;
  }
  // Brand checkboxes
  const handleCheck = (e) => {
    if (e.target.checked) {
      props.setProgress(30);
      if (checkChecked(e.target.value)) {
        props.setProgress(70);
        fetch(
          `${host}/api/client/query?brand=${e.target.value}&category=${props.category}`
        )
          .then((res) => res.json())
          .then((jsonData) => {
            if (jsonData.success) {
              setProducts(jsonData.products);
            } else {
              console.log(jsonData.error);
            }
            props.setProgress(100);
          })
          .catch((err) => console.log(err) && props.setProgress(100));
      } else {
        props.setProgress(50);
        fetch(
          `${host}/api/client/query?brand=${e.target.value}&category=${props.category}`
        )
          .then((res) => res.json())
          .then((jsonData) => {
            if (jsonData.success) {
              setProducts(products.concat(jsonData.products));
            } else {
              console.log(jsonData.error);
            }
            props.setProgress(100);
          })
          .catch((err) => console.log(err) && props.setProgress(100));
      }
    } else {
      props.setProgress(50);
      fetchData();
      props.setProgress(100);
    }
  };
  // Min Price
  const handleMin = (e) => {
    props.setProgress(30);
    fetch(
      `${host}/api/client/query?minprice=${e.target.value}&category=${props.category}&maxprice=${max.current.value}`
    )
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData.success) {
          setProducts(jsonData.products);
        } else {
          console.log(jsonData.error);
        }
        props.setProgress(50);
        props.setProgress(100);
      })
      .catch((err) => console.log(err) && props.setProgress(100));
  };
  // Max Price
  const handleMax = (e) => {
    props.setProgress(30);
    fetch(
      `${host}/api/client/query?maxprice=${e.target.value}&category=${props.category}&minprice=${min.current.value}`
    )
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData.success) {
          setProducts(jsonData.products);
        } else {
          console.log(jsonData.error);
        }
        props.setProgress(50);
        props.setProgress(100);
      })
      .catch((err) => console.log(err) && props.setProgress(100));
  };
  // Price Sorting
  function priceSort(a, b) {
    return a.price - b.price;
  }
  // Date Sorting
  function dateSort(a, b) {
    return a.data - b.date;
  }
  // Sorting products
  const handleSort = (e) => {
    if (e.target.value === "10") {
      let sortedProducts = products;
      sortedProducts.reverse();
      setProducts((products) => [...products]);
    } else if (e.target.value === "20") {
      let sortedProducts = products;
      sortedProducts.sort(dateSort);
      sortedProducts.reverse();
      setProducts((products) => [...sortedProducts]);
    } else if (e.target.value === "30") {
      let sortedProducts = products;
      sortedProducts.sort(priceSort);
      setProducts((products) => [...sortedProducts]);
    } else if (e.target.value === "40") {
      let sortedProducts = products;
      sortedProducts.sort(priceSort);
      sortedProducts.reverse();
      setProducts((products) => [...sortedProducts]);
    }
  };
  // show filters in mobiles
  const showFilters = () => {
    if (window.innerWidth <= 900) {
      if (filter) {
        setFilter(false);
      } else {
        setFilter(true);
        setVisible(true);
      }
    } else {
      setFilter(true);
      setVisible(false);
    }
  };
  const showSort = () => {
    // TODO ==>
    // const evt = new MouseEvent("mousedown");
    // sortBtn.current.dispatchEvent(evt);
    document.getElementById("product-sorts").click();
  };
  return (
    <section>
      <Navbar />
      <button
        className="filter-btn"
        id="left-sort"
        onClick={showSort}
        style={{ display: `${visible ? "inline-block" : "none"}` }}
      >
        <i className="fa-solid fa-arrow-right-arrow-left"></i>
        &nbsp;&nbsp;Sort
      </button>
      <button
        className="filter-btn"
        id="right-filter"
        onClick={showFilters}
        style={{ display: `${visible ? "inline-block" : "none"}` }}
      >
        <i className="fa-solid fa-filter"></i>
        &nbsp;&nbsp;Filters
      </button>
      {/* main content */}
      <div id="content">
        {/* All filters */}
        <div
          id="filters"
          style={{
            transform: `${filter ? "translateY(0%)" : "translateY(110%)"}`,
          }}
        >
          {/* Categories */}
          <div className="category">
            <h3>Categories</h3>
            <ul className="category-list">
              <li>
                <Link to="/">All</Link>
              </li>
              <li>
                <Link to="/mobiles">Mobiles</Link>
              </li>
              <li>
                <Link to="/pc">PCs</Link>
              </li>
              <li>
                <Link to="/electronics">Electronics</Link>
              </li>
              <li>
                <Link to="/accessories">Accessories</Link>
              </li>
            </ul>
          </div>
          {/* Price range */}
          <div className="category">
            <h3>Price</h3>
            <ul className="price-range category-list">
              <select name="from" id="from" onChange={handleMin} ref={min} defaultValue={0}>
                <option value={0}>
                  Min
                </option>
                <option value={10000}>&#8377; 10000</option>
                <option value={20000}>&#8377; 20000</option>
                <option value={30000}>&#8377; 30000</option>
                <option value={40000}>&#8377; 40000</option>
                <option value={50000}>&#8377; 50000</option>
              </select>
              <span id="price-seperator">to</span>
              <select
                name="to"
                id="to"
                onChange={handleMax}
                ref={max}
                defaultValue={1000000}
              >
                <option
                  value={10000}
                  className={
                    min.current && min.current.value >= 10000 ? "d-none" : ""
                  }
                >
                  &#8377; 10000
                </option>
                <option
                  value={20000}
                  className={
                    min.current && min.current.value >= 20000 ? "d-none" : ""
                  }
                >
                  &#8377; 20000
                </option>
                <option
                  value={30000}
                  className={
                    min.current && min.current.value >= 30000 ? "d-none" : ""
                  }
                >
                  &#8377; 30000
                </option>
                <option
                  value={40000}
                  className={
                    min.current && min.current.value >= 40000 ? "d-none" : ""
                  }
                >
                  &#8377; 40000
                </option>
                <option
                  value={50000}
                  className={
                    min.current && min.current.value >= 50000 ? "d-none" : ""
                  }
                >
                  &#8377; 50000
                </option>
                <option value={1000000}>&#8377; 100000+</option>
              </select>
            </ul>
          </div>
          {/* Brand */}
          <div className="category">
            <h3>Brand</h3>
            <ul className="category-list" id="brand-list">
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="apple"
                  value="apple"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={apple}
                />
                <label htmlFor="apple" className="category-label">
                  Apple
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="samsung"
                  value="samsung"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={samsung}
                />
                <label htmlFor="samsung" className="category-label">
                  Samsung
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="xiaomi"
                  value="xiaomi"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={xiaomi}
                />
                <label htmlFor="xiaomi" className="category-label">
                  Xiaomi
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="realme"
                  value="realme"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={realme}
                />
                <label htmlFor="realme" className="category-label">
                  Realme
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="oppo"
                  value="oppo"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={oppo}
                />
                <label htmlFor="oppo" className="category-label">
                  Oppo
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="vivo"
                  value="vivo"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={vivo}
                />
                <label htmlFor="vivo" className="category-label">
                  Vivo
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="oneplus"
                  value="oneplus"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={oneplus}
                />
                <label htmlFor="oneplus" className="category-label">
                  OnePlus
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="google"
                  value="google"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={google}
                />
                <label htmlFor="google" className="category-label">
                  Google
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="motorola"
                  value="motorola"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={motorola}
                />
                <label htmlFor="motorola" className="category-label">
                  Motorola
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="poco"
                  value="poco"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={poco}
                />
                <label htmlFor="poco" className="category-label">
                  Poco
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="brand"
                  id="nothing"
                  value="nothing"
                  onChange={handleCheck}
                  defaultChecked={false}
                  ref={nothing}
                />
                <label htmlFor="nothing" className="category-label">
                  Nothing
                </label>
              </li>
            </ul>
          </div>
        </div>
        <div className="product-lists" ref={lists}>
          {/* Sorting on price */}
          <div className="product-lists-top">
            <span>
              <select
                name="sorting"
                ref={sortBtn}
                id="product-sorts"
                onChange={handleSort}
                style={{
                  transform: `${
                    filter ? "translateY(0%)" : "translateY(110%)"
                  }`,
                }}
              >
                <option value={"10"}>Newest Arrivals</option>
                <option value={"20"}>Best Selling</option>
                <option value={"30"}>Price: Low to High</option>
                <option value={"40"}>Price: High to Low</option>
              </select>
            </span>
            <span id="product-count">
              {products && products.length} Products
            </span>
          </div>
          <div className="product-map">
            {/* Mapping the products */}
            {products &&
              products.map((product) => {
                return (
                  <Link
                    to={`/product/${product._id}`}
                    className="product-box"
                    key={product._id}
                  >
                    <img src={product.images[0]} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>&#8377; {product.price}</p>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default ProductLists;
