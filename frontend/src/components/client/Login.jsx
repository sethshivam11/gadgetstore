import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";
import "../../style/client/login.css";

function Login() {
  const host = process.env.REACT_APP_HOST;
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
    fetch(`${host}/api/user/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: creds.email,
        password: creds.password,
      }),
    }).then(res => res.json()).then(resData => {
      if(resData.success){
        localStorage.setItem("gadgetstore-user-token", resData.token);
        navigate("/");
      }else{
        console.log(resData);
      }
    });
    
  };
  const app = useRef();
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from("#circle1", {
        x: -800,
        duration: 2,
      });
      gsap.from("#circle2", {
        x: 100,
        y: 100,
        duration: 2,
      });
      gsap.from("#circle3", {
        x: -100,
        y: -100,
        duration: 2,
      });
      gsap.from("#circle4", {
        x: 800,
        duration: 2,
      });
      gsap.from("#circle5", {
        y: -200,
        duration: 2,
      })
    }, app);

    return () => ctx.revert();
  }, []);

  return (
    <div className="main" ref={app}>
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
            type="email"
            placeholder="Email"
            onChange={onChange}
          />
          <input
            className="bar"
            name="password"
            type="password"
            placeholder="Password"
            onChange={onChange}
          />
          <button
            type="submit"
            className="bar"
            disabled={creds.email.length < 4 || creds.password.length < 5}
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
