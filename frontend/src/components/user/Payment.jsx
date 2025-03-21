import React, { useEffect, useState } from "react";
import "../../style/user/cart.css";
import "../../style/user/payment.css";

const Payment = (props) => {
  const { host, token, payment, navigate, toast, order, setOrder } = props;
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const [loading, setLoading] = useState(false);
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);
  const placeOrder = (e) => {
    e.preventDefault();
    if (order.payment !== "cashondelivery") {
      return onPayment();
    }
    setLoading(true);
    const loadingToast = toast.loading("Placing Order");
    fetch(`${host}/api/user/order/create`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
      body: JSON.stringify({
        products: order.products,
        total: order.total,
        address: order.address,
        payment: order.payment,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          toast.success("Order placed");
          navigate("/ordersuccess");
        } else {
          toast.error("Something went wrong, Please try again later");
          console.log(resData.error);
        }
        setLoading(false);
        toast.dismiss(loadingToast);
      })
      .catch((err) => {
        console.log(err);
        toast.dismiss(loadingToast);
        setLoading(false);
      });
  };
  const paymentChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };
  const onPayment = async () => {
    setLoading(true);
    fetch(`${host}/api/payments/createOrder`, {
      method: "POST",
      body: JSON.stringify({
        products: order.products,
        total: order.total,
        address: order.address,
        payment: order.payment,
      }),
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
    })
      .then((parsed) => parsed.json())
      .then((resData) => {
        if (!resData.success) {
          toast.error("Something went wrong, Please try again later");
          return;
        }
        const paymentObject = new window.Razorpay({
          key: razorpayKey,
          order_id: resData.order.id,
          ...resData.order,
          handler: function (res) {
            console.log(res);
            const options = {
              order_id: res.razorpay_order_id,
              payment_id: res.razorpay_payment_id,
              signature: res.razorpay_signature,
              orderDetails: {
                products: order.products,
                total: order.total,
                address: order.address,
                payment: order.payment,
              },
            };
            fetch(`${host}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "token": token,
              },
              body: JSON.stringify(options),
            })
              .then((parsed) => parsed.json())
              .then((resData) => {
                if (resData.success) {
                  toast.success("Payment Successful");
                  navigate("/ordersuccess");
                } else {
                  toast.error("Payment Failed");
                  console.log(resData.error);
                }
              })
              .catch((err) => {
                console.log(err);
                toast.error("Something went wrong, Please try again later");
              });
          },
        });
        paymentObject.open();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, Please try again later");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        setRazorpayAvailable(true);
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  return (
    <div
      className="cart-top"
      style={{ display: `${payment ? "block" : "none"}` }}
    >
      <div className="options">
        <h1 className="address-head">Payments</h1>
      </div>
      <div className="cart-bottom">
        <form onSubmit={placeOrder} className="form-payment">
          <div className="form-container with-razorpay">
            <input
              autoComplete="off"
              onChange={paymentChange}
              type="radio"
              value={"wallets"}
              id="wallets"
              className="payment-input-radio"
              name="payment"
              disabled={!razorpayAvailable}
            />
            <label htmlFor="wallets" className="payment-label-radio">
              <span>Pay using&nbsp;</span>
              <img src="/razorpay-icon.svg" alt="Razorpay Logo" />
            </label>
          </div>
          <div className="form-container">
            <input
              autoComplete="off"
              onChange={paymentChange}
              type="radio"
              id="cash"
              className="payment-input-radio"
              name="payment"
              value={"cashondelivery"}
            />
            <label htmlFor="cash" className="payment-label-radio">
              Cash on Delivery
            </label>
          </div>
          <p className="payment-warning-message">
            Warning: This is just a project, don't expect any product or don't
            pay anyone for this.
          </p>
          <div className="form-container form-button-container">
            <button
              type="submit"
              className="button-payment-confirm"
              disabled={order.payment.length <= 0 || loading}
            >
              Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
