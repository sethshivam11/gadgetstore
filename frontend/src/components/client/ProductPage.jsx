import React, { useCallback, useEffect, useState } from "react";
import "../../style/client/productpage.css";
import Navbar from "./Navbar";
import { useParams, useNavigate } from "react-router-dom";

const ProductPage = () => {
  const host = process.env.REACT_APP_HOST;
  const { id } = useParams();
  const token = localStorage.getItem("gadgetstore-user-token");
  const navigate = useNavigate();
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
    fetch(`${host}/api/client/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setProduct(resData.product);
        } else {
          console.log(resData.error);
          console.log(resData.message);
        }
      });
  }, [host, id, setProduct]);
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct, navigate]);
  const handleBuy = () => {
    if (!token) {
      navigate("/login");
    }
    fetch(`${host}/api/user/cart/remove`, {
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
          navigate("/cart");
        } else {
          console.log(resData.error);
        }
      });
  };
  const handleCart = () => {
    if (!token) {
      navigate("/login");
    }
    fetch(`${host}/api/user/cart/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ product: product }),
    });
  };
  const handleWishlist = () => {
    fetch(`${host}/api/user/wishlist/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({product: product})
    }).then(res => res.json()).then(resData => {
      if(resData.success){
        console.log(resData.user);
      }
      else{
        console.log(resData.error);
      }
    });
  }
  return (
    <section>
      <Navbar />
      <div className="product-page-content">
        <h1>{product.name}</h1>
        <img
          src={product.images[0]}
          alt={product.name}
          style={{ width: "250px", objectFit: "contain" }}
        />
        <button type="button" onClick={handleBuy}>
          Buy Now
        </button>
        <button type="button" onClick={handleCart}>
          Add to Cart
        </button>
        <button type="button" onClick={handleWishlist}>Wishlist</button>
      </div>
    </section>
  );
};

export default ProductPage;
