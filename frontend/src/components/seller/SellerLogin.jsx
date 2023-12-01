import React, { useState } from "react";
import "../../style/seller/sellerlogin.css";
import { Link, useNavigate } from "react-router-dom";

function SellerLogin(props) {
  const { setProgress, toast } = props;
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(30);
    const response = await fetch(`${host}/api/seller/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    setProgress(50);
    const tokenResponse = await response.json();
    setProgress(70);
    if (tokenResponse.success) {
      const token = tokenResponse.token;
      localStorage.setItem("gadgetstore-seller-token", token);
      navigate("/seller");
    } else if (tokenResponse.error === "Internal Server Error!") {
      toast.error("Something went wrong, Please try again later");
    } else {
      toast.error(tokenResponse.error);
    }
    setProgress(100);
  };

  return (
    <div id="container">
      <div className="seller-login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <span className="change-mode">
            Don't have an account,&nbsp;
            <Link type="button" to="/seller/signup">
              Signup
            </Link>
          </span>
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default SellerLogin;
