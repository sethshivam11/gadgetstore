import React, { useCallback, useState, useEffect } from "react";
import "../../style/user/cart.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../client/Navbar";

const Cart = () => {
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  const [cart, setCart] = useState(true);
  const [wishlist, setWishlist] = useState(false);
  const [products, setProducts] = useState([]);
  // const [cartArray, setCartArray] = useState([]);
  // const [wishlistArray, setWishlistArray] = useState([]);
  const token = localStorage.getItem("gadgetstore-user-token");
    // const fetchProducts = useCallback((ids) => {
    //   ids.forEach(
    //     (id) => {
    //       fetch(`${host}/api/client/product/${id}`, {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json"
    //         }
    //       }).then(res => res.json()).then(resData => setProducts(products.concat([resData.product])));
    //     },
    //     [host, setProducts]
    //   );
    // });
  const fetchUser = useCallback(() => {
    fetch(`${host}/api/user/auth/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          if (cart) {
            setProducts(resData.user.cart);
          } else if (wishlist) {
            setProducts(resData.user.wishlist);
          }
        } else {
          console.log(resData.error);
        }
      });
  }, [host, token, cart, wishlist]);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    fetchUser();
  }, [token, fetchUser, navigate]);
  return (
    <section>
      <Navbar />
      <div>
        <div className="options">
          <h3
            className={cart ? "cart-active" : ""}
            type="button"
            onClick={() => setCart(true) && setWishlist(false)}
          >
            <i className="fa fa-shopping-basket"></i>&nbsp;&nbsp;Cart
          </h3>
          <h3
            className={wishlist ? "cart-active" : ""}
            type="button"
            onClick={() => setCart(false) && setWishlist(true)}
          >
            <i className="fa fa-heart"></i>&nbsp;&nbsp;Wishlist
          </h3>
        </div>
        {cart ? (
          <div className="cart-bottom cart">
            {products.map((product) => {
              return (
                <div className="cart-item" key={product.productId}>
                  {product.productId}
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
        {wishlist ? (
          <div className="cart-bottom wishlist">
            <h1>Shivam</h1>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="cart-sum">Roral</div>
    </section>
  );
};

export default Cart;
