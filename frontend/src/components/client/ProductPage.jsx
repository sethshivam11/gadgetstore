import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../style/client/productpage.css";
import Navbar from "./Navbar";
import { useParams, useNavigate } from "react-router-dom";
import {
  faHeart,
  faShare,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Section2 from "./Section2";
import Footer from "./Footer";

const ProductPage = (props) => {
  const { setProgress, toast } = props;
  const wishlist = useRef();
  const share = useRef();
  const host = import.meta.env.VITE_HOST;
  const { id } = useParams();
  const token = localStorage.getItem("gadgetstore-user-token");
  const navigate = useNavigate();
  const [bigImage, setBigImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState("highlights");
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
    setLoading(true);
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
          document.title = `${resData.product.name} | Gadget Store`;
          setBigImage(resData.product.images[0]);
        } else {
          console.log(resData.error);
          navigate(`/${id}`);
        }
        setProgress(100);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong, Please try again later!");
        setProgress(100);
        setLoading(false);
      });
  }, [host, id, setProduct, setLoading, setProgress, navigate, toast]);
  useEffect(() => {
    setProgress(30);
    fetchProduct();
  }, [fetchProduct, setProgress]);
  const handleBuy = () => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong, Please try again later!");
        setProgress(100);
        setLoading(false);
      });
  };
  const handleCart = () => {
    setLoading(true);
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
        } else {
          console.log(resData.error);
          toast.error("Something went wrong, Please try again later!");
        }
        setProgress(100);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong, Please try again later!");
        setProgress(100);
        setLoading(false);
      });
  };
  const handleWishlist = () => {
    setLoading(true);
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
          toast.success(resData.error);
          wishlist.current.style.color = "#ef5466";
        }
        setProgress(100);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong, Please try again later!");
        setProgress(100);
        setLoading(false);
      });
  };
  const handleShare = async () => {
    const shareData = {
      title: `Gadget Store | ${product.name}`,
      text: `Checkout the new ${product.name} on Gadget Store`,
      url: location.pathname,
    };
    const can = navigator.canShare(shareData);
    if (can) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location);
      toast.success("Copied to clipboard");
    }
    share.current.style.color = "#ffc356";
    setTimeout(() => {
      share.current.style.color = "#dadada";
    }, 6000);
  };

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
            disabled={loading}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <button
            type="button"
            className="product-floating-button"
            id="product-share-btn"
            onClick={handleShare}
            ref={share}
          >
            <FontAwesomeIcon icon={faShare} />
          </button>
          <div className="product-img-glimpses">
            {product.images.map((image, index) => {
              return (
                <img
                  src={image}
                  loading="lazy"
                  className="small-images"
                  alt={index}
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
            <span>
              &#8377;&nbsp;
              {product.discount
                ? Math.floor(
                    product.price - product.discount * (product.price / 100)
                  )
                : product.price}
            </span>
            {product.discount ? (
              <span>
                <span className="product-price-linethrough">
                  &#8377;&nbsp;{product.price}
                </span>
                <span className="product-page-discount">
                  &nbsp;&nbsp;{product.discount}%
                </span>
              </span>
            ) : (
              ""
            )}
            <span className="product-ratings">
              {Array.from({ length: Math.floor(product.rating) }, (_, i) => (
                <FontAwesomeIcon icon={faStar} key={"full" + i} />
              ))}
              {Array.from(
                { length: Math.floor(product.rating) - product.rating ? 1 : 0 },
                (_, i) => (
                  <FontAwesomeIcon icon={faStarHalfStroke} key={"half" + i} />
                )
              )}
              {product.rating <= 4
                ? Array.from(
                    { length: Math.floor(5 - product.rating) },
                    (_, i) => (
                      <FontAwesomeIcon icon={faStar} key={"hollow" + i} />
                    )
                  )
                : ""}
            </span>
          </h4>
          <p className="product-data-para">
            {product.stock ? (
              "Only " + product.stock + " Pieces left"
            ) : (
              <span style={{ color: "red", fontWeight: "500" }}>
                Out of Stock
              </span>
            )}
          </p>
          <p className="product-data-para">+ &#8377;0 Packaging Fee</p>
          <p className="product-page-para">
            <button
              type="button"
              onClick={handleBuy}
              className="product-page-btn hollow-btn"
              disabled={loading || !product.stock}
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={handleCart}
              className="product-page-btn"
              disabled={loading || !product.stock}
            >
              Add to Cart
            </button>
          </p>
          <hr className="product-detail-divider" />
          <ul className="product-details-list">
            <li
              style={{
                backgroundColor: details === "highlights" ? "#fff" : "",
                color: details === "highlights" ? "#000" : "",
              }}
              onClick={() => setDetails("highlights")}
            >
              Highlights
            </li>
            <li
              style={{
                backgroundColor: details === "description" ? "#fff" : "",
                color: details === "description" ? "#000" : "",
              }}
              onClick={() => setDetails("description")}
            >
              Description
            </li>
          </ul>
          <p
            className="product-details"
            style={{
              display: details === "highlights" ? "inline-block" : "none",
            }}
          >
            {product.highlights}
          </p>
          <p
            className="product-details"
            style={{
              display: details === "description" ? "inline-block" : "none",
            }}
          >
            {product.description}
          </p>
        </div>
      </div>
      <Section2 category={product.category} heading={"Related Products"} />
      <Footer />
    </section>
  );
};

export default ProductPage;
