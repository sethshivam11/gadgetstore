import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../style/client/productpage.css";
import Navbar from "./Navbar";
import { useParams, useNavigate } from "react-router-dom";

const ProductPage = (props) => {
  const { setProgress, toast } = props;
  const wishlist = useRef();
  const share = useRef();
  const host = process.env.REACT_APP_HOST;
  const { id } = useParams();
  const token = localStorage.getItem("gadgetstore-user-token");
  const navigate = useNavigate();
  const [bigImage, setBigImage] = useState("");
  const [product, setProduct] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    images: [],
    subCategory: "",
    stock: "",
    price: "",
    more: "",
    date: "",
    id,
  });
  const fetchProduct = useCallback(() => {
    setProgress(50);
    fetch(`${host}/api/client/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(70);
        if (resData.success) {
          setProduct(resData.product);
          setBigImage(resData.product.images[0]);
        } else {
          console.log(resData.error);
          console.log(resData.message);
        }
        setProgress(100);
      });
  }, [host, id, setProduct, setProgress]);
  useEffect(() => {
    setProgress(30);
    fetchProduct();
  }, [fetchProduct, setProgress]);
  const handleBuy = () => {
    setProgress(30);
    if (!token) {
      setProgress(70);
      navigate("/login");
      setProgress(100);
    }
    fetch(`${host}/api/user/cart/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ product: product }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(50);
        if (resData.success) {
          navigate("/cart");
          setProgress(70);
        } else {
          console.log(resData.error);
          setProgress(70);
        }
        setProgress(100);
      });
  };
  const handleCart = () => {
    setProgress(30);
    if (!token) {
      setProgress(70);
      navigate("/login");
      setProgress(100);
    }
    setProgress(50);
    fetch(`${host}/api/user/cart/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ product: product }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setProgress(70);
          toast.success(
            `${product.name ? product.name : "Product"} added to cart`
          );
          setProgress(100);
        } else {
          console.log(resData.error);
          toast.error("Something went wrong, Please try again later!");
          setProgress(100);
        }
      });
  };
  const handleWishlist = () => {
    setProgress(30);
    fetch(`${host}/api/user/wishlist/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ product: product }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(50);
        if (resData.success) {
          console.log(resData.user);
          setProgress(70);
          toast.success(
            `${product.name ? product.name : "Product"} added to wishlist`
          );
          wishlist.current.style.color = "#ef5466";
        } else if (
          resData.error === "Internal Server Error!" ||
          resData.error === "Please provide a valid product!"
        ) {
          console.log(resData.error);
          toast.error("Something went wrong, Please try again later!");
        } else if (resData.error === "Product already in wishlist") {
          toast.success(resData.error)
          wishlist.current.style.color = "#ef5466";
        }
        setProgress(100);
      });
  };
  const handleShare = async () => {
    navigator.clipboard.writeText(window.location);
    share.current.style.color = "#ffc356";
    toast.success("Copied to clipboard");
  };
  setTimeout(() => {
    share.current.style.color = "#dadada";
  }, 6000)
  return (
    <section>
      <Navbar />
      <div className="product-page-content">
        <div className="product-image-box">
          <img
            loading="eager"
            src={bigImage}
            alt={product.name}
            className="big-image"
          />
          <button
            type="button"
            className="product-floating-button"
            id="product-wishlist-btn"
            onClick={handleWishlist}
            ref={wishlist}
          >
            <i className="fa fa-heart"></i>
          </button>
          <button
            type="button"
            className="product-floating-button"
            id="product-share-btn"
            onClick={handleShare}
            ref={share}
          >
            <i className="fa fa-share"></i>
          </button>
          <div className="product-img-glimpses">
            {product.images.map((image, index) => {
              return (
                <img
                  src={image}
                  loading="lazy"
                  className="small-images"
                  alt={image + index}
                  key={image + "-" + index}
                  onMouseEnter={() => setBigImage(image)}
                  style={{
                    border:
                      bigImage === image
                        ? "1px solid black "
                        : "1px solid transparent",
                    transform: bigImage === image ? "scale(0.95)" : "scale(1)",
                    padding: "2px",
                    transition: "transform 0.2s ease",
                    borderRadius: "5px",
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="product-info-box">
          <p className="product-page-category">
            {product.category === "pc" ? "PCs" : product.category}
          </p>
          <h3 className="product-page-name">{product.name}</h3>
          <h4 className="product-page-price">
            <span>&#8377;&nbsp;{product.price}</span>
            <span className="product-ratings">
              {Array.from({ length: Math.floor(product.rating) }, (_, i) => (
                <i key={"full" + i} className="fa fa-star"></i>
              ))}
              {Array.from(
                { length: Math.floor(product.rating) - product.rating ? 1 : 0 },
                (_, i) => (
                  <i key={"half" + i} className="fa fa-star-half-stroke"></i>
                )
              )}
              {product.rating <= 4
                ? Array.from(
                    { length: Math.floor(5 - product.rating) },
                    (_, i) => (
                      <i key={"hollow" + i} className="fa-regular fa-star"></i>
                    )
                  )
                : ""}
            </span>
          </h4>
          <p className="product-data-para">Only {product.stock} Pieces left</p>
          <p className="product-data-para">+ &#8377;0 Packaging Fee</p>
          <p className="product-page-para">
            <button
              type="button"
              onClick={handleBuy}
              className="product-page-btn hollow-btn"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={handleCart}
              className="product-page-btn"
            >
              Add to Cart
            </button>
          </p>
          <ul className="product-details-list">
            <li>Highlights</li>
            <li>Description</li>
            <li>Specifications</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
