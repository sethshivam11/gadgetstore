import React, { useCallback, useState, useEffect } from "react";
import "../../style/user/cart.css";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../client/Navbar";
import Address from "./Address";
import Payment from "./Payment";

const Cart = (props) => {
  const { setProgress, toast } = props;
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  let currentDate = new Date();
  let delDate = currentDate.getDate();
  let day = currentDate.getDay();
  let month = currentDate.getMonth();
  let delMonth = "";
  let delDay = "";
  const [cart, setCart] = useState(true);
  const [address, setAddress] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [payment, setPayment] = useState(false);
  const [delivery, setDelivery] = useState({
    name: "",
    mobile: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    type: "",
    landmark: "",
    alternate: "",
  });
  const [order, setOrder] = useState({
    products: [],
    total: "",
    date: currentDate,
    address: delivery,
    payment: "",
  });
  const [remove, setRemove] = useState({});
  const token = localStorage.getItem("gadgetstore-user-token");
  const fetchUser = useCallback(() => {
    setProducts([]);
    setProgress(30);
    fetch(`${host}/api/user/auth/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(50);
        if (resData.success) {
          if (cart) {
            setProducts(resData.user.cart);
          } else if (wishlist) {
            setProducts(resData.user.wishlist);
          }
          setProgress(70);
        } else {
          console.log(resData.error);
        }
        setProgress(100);
      });
  }, [host, token, cart, wishlist, setProgress]);
  switch (day) {
    case 0:
      delDay = "Sun";
      break;
    case 1:
      delDay = "Mon";
      break;
    case 2:
      delDay = "Tue";
      break;
    case 3:
      delDay = "Thu";
      break;
    case 4:
      delDay = "Fri";
      break;
    case 5:
      delDay = "Sat";
      break;
    default:
      delDay = "";
      break;
  }
  switch (month) {
    case 0:
      delMonth = "Jan";
      break;
    case 1:
      delMonth = "Feb";
      break;
    case 2:
      delMonth = "Mar";
      break;
    case 3:
      delMonth = "Apr";
      break;
    case 4:
      delMonth = "May";
      break;
    case 5:
      delMonth = "Jun";
      break;
    case 6:
      delMonth = "Jul";
      break;
    case 7:
      delMonth = "Aug";
      break;
    case 8:
      delMonth = "Sep";
      break;
    case 9:
      delMonth = "Oct";
      break;
    case 10:
      delMonth = "Nov";
      break;
    case 11:
      delMonth = "Dec";
      break;
    default:
      delMonth = "";
      break;
  }
  useEffect(() => {
    if (!token) {
      setProgress(50);
      navigate("/login");
      setProgress(100);
    }
    fetchUser();
  }, [token, fetchUser, navigate, setProgress]);
  const handleRemove = (com) => {
    if (!remove._id) {
      return;
    }
    const toastId = toast.loading("Removing Item");
    fetch(`${host}/api/user/${com}/remove`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ product: remove, all: true }),
    })
      .then((res) => res.json())
      .then((resData) => {
        toast.dismiss(toastId);
        if (resData.success) {
          setProducts(products.filter((product) => product._id !== remove._id));
          toast.success("Product Removed");
        } else {
          toast.error("Something went wrong, Please try again later!");
        }
        setShowModal(false);
        document.body.style.overflow = "";
      });
  };
  const handleIncrease = (quantity, com) => {
    if (!quantity.quantity) {
      console.log(quantity);
      return;
    }
    fetch(`${host}/api/user/cart/${com}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ product: quantity }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          if (com === "add") {
            setProducts(
              products.map((product) => {
                if (product._id === quantity._id) {
                  return { ...product, quantity: quantity.quantity + 1 };
                } else {
                  return product;
                }
              })
            );
            toast.success(
              `${quantity.product.name} quantity changed to ${
                quantity.quantity + 1
              }`
            );
          } else {
            setProducts(
              products.map((product) => {
                if (product._id === quantity._id) {
                  return { ...product, quantity: quantity.quantity - 1 };
                } else {
                  return product;
                }
              })
            );
            toast.success(
              `${quantity.product.name} quantity changed to ${
                quantity.quantity - 1
              }`
            );
          }
        } else if (resData.error === "Internal Server Error!") {
          toast.error("Something went wrong, Please try again later!");
        } else {
          toast.error(resData.error);
        }
      });
  };
  const handleMove = (move) => {
    if (!move._id) {
      return;
    }
    let id = move._id;
    move = move.product;
    move._id = id;
    fetch(`${host}/api/user/movetocart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ product: move }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          toast.success(`${move.name} moved to cart`);
          setProducts(products.filter((product) => product._id !== id));
        } else if (resData.error === "Product already in cart") {
          toast.success(`${move.name} is already in cart`);
          setProducts(products.filter((product) => product._id !== id));
        } else if (resData.error === "Internal Server Error!") {
          console.log(resData.error);
          toast.error("Something went wrong, Please try again later!");
        } else {
          toast.error(resData.error);
        }
      });
  };
  const handleWishlist = (wish) => {
    if (!wish._id) {
      return;
    }
    delete wish.quantity;
    let productId = wish._id;
    wish = wish.product;
    wish._id = productId;
    fetch(`${host}/api/user/wishlist/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ product: wish }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          toast.success(`${wish.name} added to wishlist`);
        } else if (resData.error === "Internal Server Error!") {
          toast.error("Something went wrong, Please try again later!");
        } else if (resData.error === "Product already in wishlist") {
          toast.success(resData.error);
        } else {
          toast.error(resData.error);
        }
      });
  };
  return (
    <section>
      <Navbar />
      <div className="cart-products">
        <div
          id="confirm-remove-modal"
          style={{
            transform: `${showModal ? "translateY(0%)" : "translateY(-110%)"}`,
          }}
        >
          <div className="confirm-product-remove">
            <h3>Remove Item</h3>
            <p>Are you sure you want to remove this item?</p>
            <button
              type="button"
              id="cart-cancel-remove"
              onClick={() => {
                setShowModal(false);
                document.body.style.overflowY = "";
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              id="cart-confirm-remove"
              onClick={() => handleRemove(cart ? "cart" : "wishlist")}
            >
              Remove
            </button>
          </div>
        </div>
        <div
          className="cart-top"
          style={{ display: `${address || payment ? "none" : "block"}` }}
        >
          <div className="options">
            <h3
              className={cart ? "cart-active" : ""}
              type="button"
              onClick={() => {
                setCart(true);
                setWishlist(false);
                fetchUser();
              }}
            >
              <span style={{ color: "#ffb326" }}>
                <i className="fa fa-shopping-basket"></i>
              </span>
              &nbsp;&nbsp;Cart
            </h3>
            <h3
              className={wishlist ? "cart-active" : ""}
              type="button"
              onClick={() => {
                setCart(false);
                setWishlist(true);
                fetchUser();
              }}
            >
              <span style={{ color: "#ef5466" }}>
                <i className="fa fa-heart"></i>
              </span>
              &nbsp;&nbsp;Wishlist
            </h3>
          </div>
          {cart ? (
            <div className="cart-bottom">
              {products.length > 0 ? (
                products.map((product) => {
                  return (
                    <div className="cart-item" key={product._id}>
                      <div className="cart-product-main">
                        <Link to={`/product/${product._id}`}>
                          <img
                            loading="lazy"
                            className="cart-product-image"
                            src={product.product.images[0]}
                            alt={product.product.name}
                          />
                        </Link>
                        <div className="cart-product-details">
                          <Link to={`/product/${product._id}`}>
                            <h3>{product.product.name}</h3>
                          </Link>
                          <p>{product.product.brand}</p>
                          <p
                            style={{
                              textDecoration: `${
                                product.product.discount ? "line-through" : ""
                              }`,
                              display: `${
                                product.product.discount
                                  ? "inline-block"
                                  : "none"
                              }`,
                              fontSize: "14px",
                            }}
                          >
                            &#8377; {product.product.price}
                          </p>
                          <p id="cart-product-sp">
                            &nbsp;&nbsp;&#8377;&nbsp;
                            {product.product.discount
                              ? product.product.price -
                                Math.floor(
                                  (product.product.price *
                                    product.product.discount) /
                                    100
                                )
                              : product.product.price}
                            &nbsp;&nbsp;
                            <span style={{ color: "green", fontSize: "14px" }}>
                              {product.product.discount
                                ? `${product.product.discount}% Off`
                                : ""}
                            </span>
                          </p>
                          <p style={{ fontSize: "13px", marginTop: "10px" }}>
                            +&nbsp;&#8377;&nbsp;0 Packaging fee
                          </p>
                        </div>
                      </div>
                      <div className="cart-product-extra">
                        <p className="cart-delivery-text">
                          Delivery by {`${delDay} `}
                          {delDate > 30 ? 5 : delDate + 2}
                          {` ${delMonth}`} |{" "}
                          <span style={{ color: "green", fontWeight: "600" }}>
                            Free
                          </span>
                        </p>
                        <p className="cart-quantity-box">
                          Quantity:&nbsp;&nbsp;
                          <button
                            type="button"
                            onClick={() => {
                              handleIncrease(product, "remove");
                            }}
                            disabled={product.quantity === 1}
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>
                          <span id="cart-item-quantity">
                            {product.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              handleIncrease(product, "add");
                            }}
                            disabled={product.quantity === 10}
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </p>
                        <p className="cart-actions">
                          <button
                            type="button"
                            onClick={() => handleWishlist(product)}
                            className="cart-action-btn"
                          >
                            Wishlist
                          </button>
                          <button
                            type="button"
                            id="remove-product-button"
                            className="cart-action-btn"
                            onClick={() => {
                              setShowModal(true);
                              document.body.style.overflowY = "hidden";
                              setRemove(product);
                            }}
                          >
                            Remove
                          </button>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <img loading="lazy"
                  src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1698686245/gadget-store/m5ue2sqkmvbowrt69iwx.webp"
                  alt="Cart Empty"
                  className="empty-cart-img"
                />
              )}
            </div>
          ) : (
            ""
          )}
          {wishlist ? (
            <div className="cart-bottom">
              {products.length > 0 ? (
                products.map((product) => {
                  return (
                    <div className="cart-item" key={product._id}>
                      <div className="cart-product-main">
                        <Link to={`/product/${product._id}`}>
                          <img loading="lazy"
                            className="cart-product-image"
                            src={product.product.images[0]}
                            alt={product.product.name}
                          />
                        </Link>
                        <div className="cart-product-details">
                          <Link to={`/product/${product._id}`}>
                            <h3>{product.product.name}</h3>
                          </Link>
                          <p>{product.product.brand}</p>
                          <p
                            style={{
                              textDecoration: `${
                                product.product.discount ? "line-through" : ""
                              }`,
                              display: `${
                                product.product.discount
                                  ? "inline-block"
                                  : "none"
                              }`,
                              fontSize: "14px",
                            }}
                          >
                            &#8377; {product.product.price}
                          </p>
                          <p id="cart-product-sp">
                            &nbsp;&nbsp;&#8377;&nbsp;
                            {product.product.discount
                              ? product.product.price -
                                Math.floor(
                                  (product.product.price *
                                    product.product.discount) /
                                    100
                                )
                              : product.product.price}
                            &nbsp;&nbsp;
                            <span style={{ color: "green", fontSize: "14px" }}>
                              {product.product.discount
                                ? `${product.product.discount}% Off`
                                : ""}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="cart-product-extra">
                        <p className="cart-delivery-text">
                          Delivery by {`${delDay} `}
                          {delDate > 30 ? 5 : delDate + 2}
                          {` ${delMonth}`} |{" "}
                          <span style={{ color: "green", fontWeight: "600" }}>
                            Free
                          </span>
                        </p>

                        <p>
                          <button
                            type="button"
                            className="cart-wishlist-btn"
                            onClick={() => handleMove(product)}
                          >
                            Move to cart
                          </button>
                          <button
                            type="button"
                            className="cart-wishlist-btn"
                            id="remove-product-button"
                            onClick={() => {
                              setShowModal(true);
                              document.body.style.overflowY = "hidden";
                              setRemove(product);
                            }}
                          >
                            Remove
                          </button>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <img loading="lazy"
                  src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1698686245/gadget-store/m5ue2sqkmvbowrt69iwx.webp"
                  alt="Cart Empty"
                  className="empty-cart-img"
                />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <Address
          address={address}
          toast={toast}
          token={token}
          host={host}
          width={window.innerWidth < 1000 ? "100%": "70%"}
          setProgress={setProgress}
          setDelivery={setDelivery}
        />
        <Payment
          host={host}
          token={token}
          toast={toast}
          navigate={navigate}
          payment={payment}
          order={order}
          setOrder={setOrder}
        />
        <div className="cart-sum">
          <h3>Cart Summary</h3>
          <hr className="cart-summary-seperator" />
          <p>
            Price (
            {products.length > 0 &&
            products.reduce((count) => {
              let quantity = 1;
              return count + quantity;
            }, 0)
              ? products.length > 0 &&
                products.reduce((count) => {
                  let quantity = 1;
                  return count + quantity;
                }, 0)
              : 0}
            &nbsp;items)
            <span className="cart-sum-right">
              &#8377;&nbsp;
              {products.length > 0 &&
              products.reduce((count, item) => {
                let total = item.product.price;
                return count + total * item.quantity;
              }, 0)
                ? products.length > 0 &&
                  products.reduce((count, item) => {
                    let total = item.product.price;
                    return count + total * item.quantity;
                  }, 0)
                : 0}
            </span>
          </p>
          <p>
            Discount&nbsp;
            <span className="cart-color-green">
              <span className="cart-sum-right">
                -&nbsp;&#8377;&nbsp;
                {products.length > 0 &&
                products.reduce((count, item) => {
                  let discount = 0;
                  if (item.product.discount) {
                    discount = Math.floor(
                      item.product.discount * (item.product.price / 100)
                    );
                  }
                  return count + discount * item.quantity;
                }, 0)
                  ? products.length > 0 &&
                    products.reduce((count, item) => {
                      let discount = 0;
                      if (item.product.discount) {
                        discount = Math.floor(
                          item.product.discount * (item.product.price / 100)
                        );
                      }
                      return count + discount * item.quantity;
                    }, 0)
                  : 0}
              </span>
            </span>
          </p>
          <p>
            Delivery Charges&nbsp;
            <span className="cart-sum-right">
              <span className="cart-line-through">
                &#8377;&nbsp;
                {products.length > 0 && products.length * 50
                  ? products.length > 0 && products.length * 50
                  : 0}
              </span>
              &nbsp;|<span className="cart-color-green">&nbsp;Free</span>
            </span>
          </p>
          <hr className="cart-summary-seperator" />
          <p className="cart-grand-total">
            Total Amount
            <span className="cart-sum-right">
              &#8377;&nbsp;
              {products.length > 0 &&
              products.reduce((total, item) => {
                let price = item.product.price;
                let discount = 0;
                if (item.product.discount) {
                  discount = Math.floor(
                    (item.product.price * item.product.discount) / 100
                  );
                }
                return total + (price - discount) * item.quantity;
              }, 0)
                ? products.length > 0 &&
                  products.reduce((total, item) => {
                    let price = item.product.price;
                    let discount = 0;
                    if (item.product.discount) {
                      discount = Math.floor(
                        (item.product.price * item.product.discount) / 100
                      );
                    }
                    return total + (price - discount) * item.quantity;
                  }, 0)
                : 0}
            </span>
          </p>
          <p style={{ display: !payment ? "block" : "none" }}>
            <button
              style={{ display: `${!address ? "inline-block" : "none"}` }}
              className="cart-place-order"
              onClick={() => {
                if (cart || address) {
                  setAddress(true);
                  setOrder({
                    products: products,
                    total:
                      products.length > 0 &&
                      products.reduce((total, item) => {
                        let price = item.product.price;
                        let discount = 0;
                        if (item.product.discount) {
                          discount = Math.floor(
                            (item.product.price * item.product.discount) / 100
                          );
                        }
                        return total + (price - discount) * item.quantity;
                      }, 0),
                    date: order.date,
                    address: order.address,
                    payment: order.payment,
                  });
                }
              }}
              disabled={wishlist || products.length === 0}
            >
              Place Order
            </button>
            <button
              style={{ display: `${address ? "inline-block" : "none"}` }}
              className="cart-place-order"
              onClick={() => {
                setAddress(false);
                setPayment(true);
                setOrder({
                  products: order.products,
                  total: order.total,
                  date: order.date,
                  address: delivery,
                  payment: order.payment,
                });
              }}
              disabled={
                delivery.name.length <= 0 ||
                delivery.mobile.length < 10 ||
                delivery.pincode.length < 6 ||
                delivery.locality.length <= 0 ||
                delivery.address.length <= 0 ||
                delivery.city.length <= 0 ||
                delivery.state.length <= 0 ||
                delivery.type.length <= 0
              }
            >
              Continue
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Cart;
