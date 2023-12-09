import React from "react";
import Fireworks from "./Fireworks";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  document.title = "Order Successul | Gadget Store";
  setTimeout(() => {
    navigate("/");
  }, 5000);
  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "black",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        textAlign: "center"
      }}
    >
      <Fireworks />
      <img
        src="https://res.cloudinary.com/dv3qbj0bn/image/upload/v1699165818/gadget-store/cxxjv0grgnrmuenb65ke.svg"
        alt="success"
        style={{ width: "200px" }}
      />
      <h3
        style={{
          fontSize: "50px",
          color: "white",
          fontFamily: "Didact Gothic",
          marginTop: "40px",
        }}
      >
        Order Placed Sucessfully
      </h3>
    </section>
  );
};

export default OrderSuccess;
