import React, { useCallback, useState, useEffect } from "react";
import "../../style/user/cart.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../client/Navbar";

const Cart = (props) => {
  const { setProgress } = props;
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  const [cart, setCart] = useState(true);
  const [wishlist, setWishlist] = useState(false);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("gadgetstore-user-token");
  const fetchUser = useCallback(() => {
    setProgress(50);
    fetch(`${host}/api/user/auth/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(70);
        if (resData.success) {
          if (cart) {
            setProducts(resData.user.cart);
            setProgress(100);
          } else if (wishlist) {
            setProducts(resData.user.wishlist);
            setProgress(100);
          }
        } else {
          console.log(resData.error);
          setProgress(100);
        }
      });
  }, [host, token, cart, wishlist, setProgress]);
  let currentDate = new Date();
  let delDate = currentDate.getDate();
  if(delDate > 30){ 
    delDate = 1;
  }
  // let delDay = currentDate.getDay();
  useEffect(() => {
    setProgress(30);
    if (!token) {
      setProgress(70);
      navigate("/login");
      setProgress(100);
    }
    fetchUser();
  }, [token, fetchUser, navigate, setProgress]);
  const capital = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <section>
      <Navbar />
      <div className="cart-products">
        <div className="cart-top">
          <div className="options">
            <h3
              className={cart ? "cart-active" : ""}
              type="button"
              onClick={() => {
                setCart(true);
                setWishlist(false);
              }}
            >
              <i className="fa fa-shopping-basket"></i>&nbsp;&nbsp;Cart
            </h3>
            <h3
              className={wishlist ? "cart-active" : ""}
              type="button"
              onClick={() => {
                setCart(false);
                setWishlist(true);
              }}
            >
              <i className="fa fa-heart"></i>&nbsp;&nbsp;Wishlist
            </h3>
          </div>
          {cart ? (
            <div className="cart-bottom cart">
              {products ? (
                products.map((product) => {
                  return (
                    <div className="cart-item" key={product.id}>
                      <div className="cart-product-main">
                        <img
                          className="cart-product-image"
                          src={product.product.images}
                          alt={product.product.name}
                        />
                        <div className="cart-product-details">
                          <h3>{product.product.name}</h3>
                          <p>{capital(product.product.brand)}</p>
                          <p>&#8377; {product.product.price}</p>
                        </div>
                      </div>
                      <div className="cart-product-extra">
                        <p>Delivery by {delDate > 30 ? (delDate + 4): (3)}</p>
                        {/* <button type="button">Wishlist</button>
                        <button type="button" className="remove-product">Remove</button> */}
                      </div>
                    </div>
                  );
                })
              ) : (
                <img src="" alt="Cart Empty" />
              )}
            </div>
          ) : (
            ""
          )}
          {wishlist ? <div className="cart-bottom wishlist">
            Nothing Here
          </div> : ""}
        </div>
        <div className="cart-sum">
          Cart Summary
          <hr className="cart-summary-seperator" />
        </div>
      </div>
    </section>
  );
};

export default Cart;
