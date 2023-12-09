import React, { useCallback, useEffect, useState } from "react";
import "../../style/user/orders.css";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Orders = ({ visible, host, token, toast, setProgress }) => {
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const fetchOrders = useCallback(() => {
    setProgress(30);
    fetch(`${host}/api/user/order/fetch`, {
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
          setSaved(resData.orders);
          setOrders(resData.orders);
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
  const [saved, setSaved] = useState([]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const date = new Date();
  const handleSearch = () => {
    console.log(orders);
  };
  const getDelivery = (delivery) => {
    if (
      Number(date.toString().slice(8, 10)) -
        Number(delivery.toString().slice(8, 10)) >
      2
    ) {
      return (
        <>
          <span
            className="order-status"
            style={{ backgroundColor: "green" }}
          ></span>
          &nbsp;Delivered
        </>
      );
    } else if (
      Number(date.toString().slice(8, 10)) -
        Number(delivery.toString().slice(8, 10)) <=
        2 &&
      !(date.toString().slice(0, 15) == delivery.toString().slice(0, 15))
    ) {
      return (
        <>
          <span
            className="order-status"
            style={{ backgroundColor: "orange" }}
          ></span>
          &nbsp;Shipped
        </>
      );
    } else if (
      date.toString().slice(0, 15) == delivery.toString().slice(0, 15)
    ) {
      return (
        <>
          <span
            className="order-status"
            style={{ backgroundColor: "dodgerblue" }}
          ></span>
          &nbsp;Processing
        </>
      );
    }
    return delivery.slice(0, 15);
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
        <button
          className="order-clear"
          title="Clear"
          style={{ visibility: searchOrder.length > 0 ? "visible" : "hidden" }}
          onClick={() => setSearchOrder("")}
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
        <button
          className="order-search-btn"
          type="submit"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="order-actions">
        <button
          className="order-badge order-selected"
          onClick={() => setOrders(saved)}
        >
          All
        </button>
        <button
          disabled
          className="order-badge"
          onClick={() =>
            setOrders((saved) => {
              return saved.filter((saved) => {
                getDelivery(saved.date) !==
                (
                  <>
                    <span
                      className="order-status"
                      style={{ backgroundColor: "dodgerblue" }}
                    ></span>
                    &nbsp;Processing
                  </>
                ) ||
                  getDelivery(saved.date) !==
                  (
                    <>
                      <span
                        className="order-status"
                        style={{ backgroundColor: "orange" }}
                      ></span>
                      &nbsp;Shipped
                    </>
                  );
              });
            })
          }
        >
          Upcoming
        </button>
        <button
          disabled
          className="order-badge"
          onClick={() =>
            setOrders((saved) => {
              return saved.filter((saved) => {
                getDelivery(saved.date) !==
                (
                  <>
                    <span
                      className="order-status"
                      style={{ backgroundColor: "green" }}
                    ></span>
                    &nbsp;Delivered
                  </>
                );
              });
            })
          }
        >
          Completed
        </button>
        <button className="order-badge" onClick={() => setOrders([])}>
          Canceled
        </button>
      </div>
      <div className="orders-map">
        {orders.length < 0
          ? "No Orders"
          : orders.map((order) => {
              return (
                <div className="order-item" key={order.date}>
                  <img
                    className="order-image"
                    src={order.products[0].images[0]}
                    alt={order.products[0].name}
                  />
                  <p className="order-name">
                    {order.products[0].name}
                    {order.products.length > 1
                      ? ` and ${order.products.length - 1} more`
                      : ""}
                  </p>
                  <p className="order-price">&#8377; {order.total}</p>
                  <p className="order-date-status">{getDelivery(order.date)}</p>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Orders;
