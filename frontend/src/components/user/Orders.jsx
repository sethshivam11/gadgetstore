import React, { useCallback, useEffect, useState } from "react";
import "../../style/user/orders.css";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Orders = ({ visible, host, token, toast, setProgress }) => {
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const [action, setAction] = useState("all");
  const fetchOrders = useCallback(() => {
    setProgress(30);
    fetch(`${host}/api/user/order/fetch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(50);
        if (resData.success) {
          setProgress(70);
          const sortedOrders = resData.orders.sort((a, b) => {
            return new Date(a.date) < new Date(b.date) ? 1 : -1;
          });
          setSaved(sortedOrders);
          setOrders(sortedOrders);
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
    setAction("search");
    saved.filter((order) => {
      order.products.map((item) => {
        if (item.name === searchOrder) {
          return setOrders([order]);
        }
      });
    });
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
          onClick={() => {
            setSearchOrder("");
            setOrders(saved);
            setAction("all");
          }}
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
          className={`order-badge ${action === "all" ? "order-selected" : ""}`}
          onClick={() => {
            setOrders(saved);
            setAction("all");
            setSearchOrder("");
          }}
        >
          All
        </button>
        <button
          className={`order-badge ${
            action === "upcoming" ? "order-selected" : ""
          }`}
          onClick={() => {
            setOrders(() => {
              return saved.filter((saved) => {
                if (
                  Number(date.toString().slice(8, 10)) -
                    Number(saved.date.toString().slice(8, 10)) <=
                    2 ||
                  date.toString().slice(0, 15) ==
                    saved.date.toString().slice(0, 15)
                ) {
                  return saved;
                }
              });
            });
            setAction("upcoming");
            setSearchOrder("");
          }}
        >
          Upcoming
        </button>
        <button
          className={`order-badge ${
            action === "completed" ? "order-selected" : ""
          }`}
          onClick={() => {
            setOrders(() => {
              return saved.filter((saved) => {
                if (
                  Number(date.toString().slice(8, 10)) -
                    Number(saved.date.toString().slice(8, 10)) >
                  2
                ) {
                  return saved;
                }
              });
            });
            setAction("completed");
            setSearchOrder("");
          }}
        >
          Completed
        </button>
        <button
          className={`order-badge ${
            action === "cancelled" ? "order-selected" : ""
          }`}
          onClick={() => {
            setOrders([]);
            setAction("cancelled");
            setSearchOrder("");
          }}
        >
          Cancelled
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
                  <div className="order-details">
                    <p className="order-name">
                      {order.products[0].name}
                      {order.products.length > 1
                        ? ` and ${order.products.length - 1} more`
                        : ""}
                    </p>
                    <p className="order-price">&#8377; {order.total}</p>
                    <p className="order-date-status">
                      {getDelivery(order.date)}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Orders;
