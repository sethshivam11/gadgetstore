import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../style/client/login.css";
import "../../style/client/signup.css";

const Signup = (props) => {
  const { setProgress, toast } = props;
  const token = localStorage.getItem("gadgetstore-user-token");
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    name: "",
    email: "",
    password: "",
  });
  const onChange = (e) => {
    e.preventDefault();
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (token) {
      console.log(token);
      localStorage.removeItem("gadgetstore-user-token");
    }
    setProgress(30);
    fetch(`${host}/api/user/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: creds.name,
        email: creds.email,
        password: creds.password,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(50);
        if (resData.success) {
          localStorage.setItem("gadgetstore-user-token", resData.token);
          setProgress(70);
          navigate("/");
        } else if (resData.error === "Internal Server Error!") {
          toast.error("Something went wrong, Please try again later!");
          setProgress(70);
        } else {
          toast.error(resData.error);
          setProgress(70);
          console.log(resData.error);
        }
        setProgress(100);
      });
  };
  return (
    <div className="main">
      <div id="circle1"></div>
      <div id="circle2"></div>
      <div id="circle3"></div>
      <div id="circle4"></div>
      <div id="circle5"></div>
      <div id="box">
        <h1 id="signuptext">SignUp</h1>
        <form onSubmit={handleLogin}>
          <input
            autoCapitalize="on"
            autoComplete="name"
            className="bar"
            name="name"
            type="text"
            placeholder="Name"
            onChange={onChange}
          ></input>
          <input
            autoComplete="email"
            className="bar"
            name="email"
            type="email"
            placeholder="Email"
            onChange={onChange}
          ></input>
          <input
            autoComplete="new-password"
            className="bar"
            name="password"
            type="password"
            placeholder="Password"
            onChange={onChange}
          ></input>
          <button
            type="submit"
            className="bar"
            disabled={creds.email.length < 4 || creds.password.length < 6}
            id="signupbtn"
          >
            SignUp
          </button>
        </form>
        <span id="login">
          Already have an account, &nbsp;
          <Link to="/login" type="button">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
