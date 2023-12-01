import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../style/client/login.css";

function Login(props) {
  const { setProgress, toast } = props;
  const token = localStorage.getItem("gadgetstore-user-token");
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
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
    fetch(`${host}/api/user/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: creds.email,
        password: creds.password,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(50);
        if (resData.success) {
          setProgress(70);
          localStorage.setItem("gadgetstore-user-token", resData.token);
          toast("Successfully Logged In");
          navigate("/");
        } else if (resData.error === "Internal Server Error!") {
          toast.error("Something went wrong, Please try again later!");
          console.log(resData);
          setProgress(70);
        } else {
          toast.error(resData.error);
          setProgress(70);
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
        <h1 id="logintext">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            className="bar"
            name="email"
            autoComplete="email"
            type="email"
            placeholder="Email"
            onChange={onChange}
          />
          <input
            className="bar"
            autoComplete="current-password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={onChange}
          />
          <button
            type="submit"
            className="bar"
            disabled={creds.email.length < 4 || creds.password.length < 6}
            id="loginbtn"
          >
            Login
          </button>
        </form>
        <span id="register">
          Don't have an account,&nbsp;
          <Link to="/signup" type="button">
            Register
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
