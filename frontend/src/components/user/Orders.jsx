import React, { useCallback, useEffect, useState } from "react";
import "../../style/user/orders.css";

const Orders = ({ visible, host, token, toast, setProgress }) => {
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const fetchOrders = useCallback(() => {
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
          setProgress(70);
          setOrders(resData.user.orders);
        } else if (resData.error === "Internal Server Error!") {
          toast.error("Something went wrong, Please try again later!");
        } else {
          toast.error("Something went wrong, Please try again later!");
          console.log(resData.error);
        }
        setProgress(100);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, Please try again later!");
      });
  }, [setProgress, host, toast, token, setOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    console.log(orders);
  };
  return (
    <div
      className="account-bottom order-bottom"
      style={{ display: visible ? "flex" : "none" }}
    >
      <div className="order-search-box">
        <input
          type="text"
          value={searchOrder}
          id="search-orders"
          name="search"
          onChange={(e) => setSearchOrder(e.target.value)}
          placeholder="Search your Orders here"
        />
        <button type="submit" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="orders-map">
        {orders.map((order) => {
            return (
              <div className="order-item" key={order.date}>
                {order.date}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Orders;
