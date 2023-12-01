import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import "../../style/client/productlists.css";
import { Link, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { faArrowRightArrowLeft, faClose, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductLists = (props) => {
  const { setProgress, toast, category, query, setQuery } = props;
  const host = import.meta.env.VITE_HOST;
  const min = useRef();
  const max = useRef();
  const sortBtn = useRef();
  const lists = useRef();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState(false);
  const [brands, setBrands] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [productsData, setProductsData] = useState([]);

  // Set products
  const fetchData = useCallback(() => {
    setProgress(30);
    setProgress(50);
    fetch(`${host}/api/client/home?category=${category}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setProgress(70);
        if (jsonData.success) {
          setProducts(jsonData.products);
          let brand = new Set(
            jsonData.products.map((product) => product.brand)
          );
          setBrands(brand);
          setDataFetched(true);
          setProductsData(jsonData.products);
        } else {
          console.log(jsonData.error);
        }
        setProgress(100);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, Please try again later!");
        setProgress(100);
      });
  }, [host, category, toast, setProgress, setBrands]);
  const fetchQuery = useCallback(() => {
    setProgress(30);
    setProgress(50);
    fetch(`${host}/api/client/query?name=${query}&brand=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(70);
        if (resData.success) {
          setProducts(resData.products);
        } else if (resData.error === "Internal Server Error!") {
          toast.error("Something went wrong, Please try again later!");
        } else {
          toast.success(resData.error);
        }
        setProgress(100);
      }).catch(err => {
        toast.error("Something went wrong, Please try again later!");
        console.log(err);
        setProgress(100);
      })
  }, [host, query, toast, setProgress]);
  useEffect(() => {
    if (location.pathname !== "/search") {
      fetchData();
    } else {
      fetchQuery();
    }
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
    return () => window.removeEventListener("scroll", listenscroll);
  }, [fetchData, setVisible, setProgress, location, fetchQuery]);

  const handleCheck = (brand) => {
    setSelectedBrands((prevSelectedBrands) => {
      if (prevSelectedBrands.includes(brand)) {
        return prevSelectedBrands.filter(
          (selectedBrand) => selectedBrand !== brand
        );
      } else {
        return [...prevSelectedBrands, brand];
      }
    });
    if (dataFetched) {
      setProducts(productsData);
      setSelectedBrands((prevSelectedBrands) => {
        const filteredProducts = productsData.filter((product) =>
          prevSelectedBrands.length === 0
            ? true
            : prevSelectedBrands.includes(product.brand)
        );
        setProducts(filteredProducts);
        return prevSelectedBrands;
      });
    }
  };

  // Minimum Price
  const handleMin = (e) => {
    const min = e.target.value;
    const filteredProducts = productsData.filter(
      (product) =>
        product.price - (product.price / 100) * product.discount >= min
    );
    setProducts(filteredProducts);
  };

  // Maximum Price
  const handleMax = (e) => {
    const max = e.target.value;
    const filteredProducts = productsData.filter(
      (product) =>
        product.price - (product.price / 100) * product.discount <= max
    );
    setProducts(filteredProducts);
  };

  // Sorting products
  const handleSort = (e) => {
    // Newest Arrivals
    if (e.target.value === "10") {
      let sortedProducts = products;
      sortedProducts.sort((a, b) => a.date - b.date);
      setProducts((products) => [...products]);
    }
    // Best Selling
    else if (e.target.value === "20") {
      let sortedProducts = products;
      sortedProducts.sort((a, b) => a.quantity - b.quantity);
      setProducts(() => [...sortedProducts]);
    }
    // Price - low to high
    else if (e.target.value === "30") {
      let sortedProducts = products;
      sortedProducts.sort((a, b) => a.price - b.price);
      setProducts(() => [...sortedProducts]);
    }
    // Price - high to low
    else if (e.target.value === "40") {
      let sortedProducts = products;
      sortedProducts.sort((a, b) => b.price - a.price);
      setProducts(() => [...sortedProducts]);
    }
  };
  
  // Show filters in mobiles
  const showFilters = () => {
    if (window.innerWidth <= 900) {
      if (filter) {
        document.body.style.overflowY = "";
        setFilter(false);
      } else {
        document.body.style.overflowY = "hidden";
        setFilter(true);
        setVisible(true);
      }
    } else {
      setFilter(true);
      setVisible(false);
    }
  };
  return (
    <section>
      <Navbar setQuery={setQuery} />
      <button
        className="filter-btn"
        id="left-sort"
        style={{ display: `${visible ? "inline-block" : "none"}` }}
      >
        <FontAwesomeIcon icon={faArrowRightArrowLeft} />
        &nbsp;&nbsp;Sort
      </button>
      <button
        className="filter-btn"
        id="right-filter"
        onClick={showFilters}
        style={{ display: `${visible ? "inline-block" : "none"}` }}
      >
        <FontAwesomeIcon icon={faFilter} />
        &nbsp;&nbsp;Filters
      </button>
      {/* main content */}
      <div id="content">
        {/* All filters */}
        <div
          id="filters"
          style={{
            transform: `${
              filter
                ? window.innerWidth > 865
                  ? "translateY(0%)"
                  : "translateY(-14%)"
                : "translateY(110%)"
            }`,
            zIndex: filter ? "10" : "0",
          }}
        >
          {/* Categories */}
          <div className="category">
            <h3>Categories</h3>
            <button onClick={showFilters} className="close-filters-btn">
              <FontAwesomeIcon icon={faClose} />
            </button>
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
              <select
                name="from"
                id="from"
                onChange={handleMin}
                ref={min}
                defaultValue={0}
              >
                <option value={0}>Min</option>
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
              {[...brands].map((brand) => {
                return (
                  <li key={brand}>
                    <input
                      autoComplete="off"
                      type="checkbox"
                      name="brand"
                      id={brand}
                      value={brand}
                      onChange={() => handleCheck(brand)}
                      checked={selectedBrands.includes(brand)}
                    />
                    <label htmlFor={brand} className="category-label">
                      {brand}
                    </label>
                  </li>
                );
              })}
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
                    <img
                      loading="lazy"
                      src={product.images[0]}
                      alt={product.name}
                    />
                    <h3>{product.name}</h3>
                    <p>
                      <span className="product-list-page-price">
                        &#8377;&nbsp;
                        {product.discount
                          ? Math.floor(
                              product.price -
                                product.discount * (product.price / 100)
                            )
                          : product.price}
                        &nbsp;&nbsp;
                      </span>
                      {product.discount ? (
                        <>
                          <span className="product-page-price-linethrough">
                            &#8377;&nbsp;{product.price}
                          </span>
                          <span className="pl-discount">
                            &nbsp;&nbsp;{product.discount}%
                          </span>
                        </>
                      ) : (
                        ""
                      )}
                    </p>
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
