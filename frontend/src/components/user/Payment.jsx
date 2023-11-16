import React from "react";
import "../../style/user/cart.css";
import "../../style/user/payment.css";

const Payment = (props) => {
  const { host, token, payment, navigate, toast, order, setOrder } = props;
  const placeOrder = (e) => {
    e.preventDefault();
    fetch(`${host}/api/user/order/create`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({
        products: order.products,
        total: order.total,
        date: order.date,
        address: order.address,
        payment: order.payment
      })
    }).then(res => res.json()).then(resData => {
      if(resData.success){
        toast.success("Order placed");
        navigate("/ordersuccess");
      }
      else{
        toast.error("Something went wrong, Please try again later");
        console.log(resData.error)
      }
    })
  };
  const paymentChange = (e) => {
    setOrder({...order, [e.target.name]: e.target.value});
  }
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
          <div className="form-container">
            <input
            autoComplete="off"
              onChange={paymentChange}
              type="radio"
              value={"wallets"}
              id="wallets"
              className="payment-input-radio"
              name="payment"
              disabled
            />
            <label htmlFor="wallets" className="payment-label-radio">
              Wallets
            </label>
          </div>
          <div className="form-container">
            <input
            autoComplete="off"
              onChange={paymentChange}
              type="radio"
              id="UPI"
              className="payment-input-radio"
              value={"UPI"}
              name="payment"
              disabled
            />
            <label htmlFor="UPI" className="payment-label-radio">
              UPI Apps
            </label>
          </div>
          <div className="form-container">
            <input
            autoComplete="off"
              onChange={paymentChange}
              type="radio"
              id="credit"
              className="payment-input-radio"
              value={"credit"}
              name="payment"
              disabled
            />
            <label htmlFor="credit" className="payment-label-radio">
              Credit Cards
            </label>
          </div>
          <div className="form-container">
            <input
            autoComplete="off"
              onChange={paymentChange}
              type="radio"
              id="debit"
              className="payment-input-radio"
              value={"debit"}
              name="payment"
              disabled
            />
            <label htmlFor="debit" className="payment-label-radio">
              Debit Cards
            </label>
          </div>
          <div className="form-container">
            <input
            autoComplete="off"
              onChange={paymentChange}
              type="radio"
              id="netbanking"
              className="payment-input-radio"
              name="payment"
              value={"netbanking"}
              disabled
            />
            <label htmlFor="netbanking" className="payment-label-radio">
              Net Banking
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
          <p className="payment-warning-message">Warning: This is just a project, don't expect any product or don't pay anyone for this.</p>
          <div className="form-container form-button-container">
            <button
              type="submit"
              className="button-payment-confirm"
              disabled={order.payment.length <= 0}
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
