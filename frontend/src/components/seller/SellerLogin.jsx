import React, { useState } from "react";
import "../../style/seller/sellerlogin.css";
import { useNavigate } from "react-router-dom";

function SellerLogin() {
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
    const [credentials, setCredentials] = useState({email: "", password: ""});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({...credentials, [name]: value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}/api/seller/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email: credentials.email, password: credentials.password})
    })
    const tokenResponse = await response.json();
    if(tokenResponse.success){
        const token = tokenResponse.token;
        localStorage.setItem("gadgetstore-seller-token", token);
        navigate("/seller");
    }
  };

  return (
    <div id="container">
      <div className="login-form">
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default SellerLogin;
