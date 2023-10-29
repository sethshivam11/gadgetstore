import React, { useCallback, useEffect, useState } from "react";
import "../../style/user/accounts.css";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";
import Transactions from "./Transactions";
import Addresses from "./Addresses";

const Accounts = () => {
  const host = process.env.REACT_APP_HOST;
  const token = localStorage.getItem("gadgetstore-user-token");
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState(true);
  const [orders, setOrders] = useState(false);
  const [transactions, setTransactions] = useState(false);
  const [addresses, setAddresses] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkPass, setCheckPass] = useState({ password: "" });
  const [editPassword, setEditPassword] = useState(false);
  const [showMainPassword, setShowMainPassword] = useState(false);
  const [avatar, setAvatar] = useState("GS");
  const [creds, setCreds] = useState({
    name: "",
    email: "",
    password: "123456",
  });
  const fetchAccount = useCallback(() => {
    fetch(`${host}/api/user/auth/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData.success) {
          jsonData.user.password = "123456";
          setCreds(jsonData.user);
          let name = jsonData.user.name;
          let first = name.split(" ")[0].slice(0, 1);
          let second = name.split(" ")[1].slice(0, 1);
          setAvatar(first.concat(second))
        } else {
          console.log(jsonData.error);
          navigate("/login");
        }
      });
  }, [host, token, navigate]);
  const checkPassword = useCallback(() => {
    fetch(`${host}/api/user/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ password: checkPass.password }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData.success) {
          setCreds(jsonData.user);
          setPasswordModal(false);
          setEdit(true);
          setCheckPass({ password: "" });
          document.body.style.overflowY = "";
        } else {
          console.log(jsonData.error);
        }
      });
  }, [host, token, checkPass]);
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`${host}/api/user/auth/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(creds),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setCreds(resData.user);
          setEdit(false);
        } else {
          console.log(resData.error);
        }
      });
  };
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    fetchAccount();
  }, [navigate, token, fetchAccount]);
  const handleConfirmPassword = (e) => {
    e.preventDefault();
    checkPassword();
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const handleShowPasswordMain = () => {
    console.log(showMainPassword);
    setShowMainPassword(!showMainPassword);
  };
  return (
    <section>
      <div id="account-top">
        <div className="account-creds">
          <div className="avatar">{avatar}</div>
          <p id="account-name">{creds.name}</p>
          <p id="account-email">{creds.email}</p>
        </div>
        <button id="account-btn" onClick={() => navigate("/")}>
          <i className="fa-solid fa-chevron-left"></i>&nbsp;&nbsp; Back to Home
        </button>
      </div>
      <ul id="account-menu">
        <li
          className={`${profile ? "account-active" : ""}`}
          onClick={() => {
            setProfile(true);
            setOrders(false);
            setAddresses(false);
            setTransactions(false);
          }}
        >
          Profile
        </li>
        <li
          className={`${orders ? "account-active" : ""}`}
          onClick={() => {
            setProfile(false);
            setOrders(true);
            setTransactions(false);
            setAddresses(false);
          }}
        >
          Orders
        </li>
        <li
          className={`${transactions ? "account-active" : ""}`}
          onClick={() => {
            setProfile(false);
            setOrders(false);
            setTransactions(true);
            setAddresses(false);
          }}
        >
          Transactions
        </li>
        <li
          className={`${addresses ? "account-active" : ""}`}
          onClick={() => {
            setProfile(false);
            setOrders(false);
            setTransactions(false);
            setAddresses(true);
          }}
        >
          Saved Address
        </li>
      </ul>
      {profile && !orders && !transactions && !addresses && (
        <form className="account-bottom" onSubmit={handleUpdate}>
          <label htmlFor="name" className="account-update-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="account-update-input"
            value={creds.name ?? ""}
            onChange={handleChange}
            disabled={!edit}
          />
          <label htmlFor="email" className="account-update-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="account-update-input"
            value={creds.email ?? ""}
            onChange={handleChange}
            disabled={!edit}
          />
          <label htmlFor="password" className="account-update-label">
            Password
          </label>
          <input
            type={`${showMainPassword ? "text" : "password"}`}
            name="password"
            id="password"
            className="account-update-input"
            value={creds.password ?? ""}
            onChange={handleChange}
            disabled={!editPassword}
          />
          <button
            type="button"
            id="inline-password-btn"
            onClick={() => {
              setEditPassword(true);
              setCreds({
                name: creds.name,
                email: creds.email,
                password: "",
              });
            }}
            disabled={!edit}
          >
            {editPassword && edit? "Clear": "Edit"}
          </button>
          <div>
            <input
              type="checkbox"
              name="showpassword"
              id="showpassword"
              onChange={handleShowPasswordMain}
              disabled={!editPassword || !edit}
            />
            <label
              htmlFor="showpassword"
              id="showpassword-label"
              disabled={!editPassword || !edit}
            >
              Show Password
            </label>
          </div>
          <button
            type="button"
            style={{ display: `${edit ? "none" : ""}` }}
            onClick={() => {
              setPasswordModal(true);
              document.body.style.overflowY = "hidden";
            }}
            className="account-update-btn"
          >
            Update
          </button>
          <button
            type="submit"
            style={{
              display: `${edit ? "" : "none"}`,
              backgroundColor: "greenyellow",
              border: "1px solid greenyellow",
            }}
            className="account-update-btn"
          >
            Save
          </button>
          <button
            type="button"
            style={{
              display: `${edit ? "" : "none"}`,
              marginLeft: "20px",
              border: "1px solid grey",
              backgroundColor: "white",
              color: "grey",
            }}
            onClick={() => setEdit(false)}
            className="account-update-btn"
          >
            Cancel
          </button>
        </form>
      )}
      {!profile && orders && !transactions && !addresses && (
        <Orders/>
      )}
      {!profile && !orders && transactions && !addresses && (
        <Transactions/>
      )}
      {!profile && !orders && !transactions && addresses && (
        <Addresses/>
      )}
      <div
        id="password-modal"
        style={{
          transform: `${
            passwordModal ? "translateY(0%)" : "translateY(-100%)"
          }`,
        }}
      >
        <form onSubmit={handleConfirmPassword}>
          <h3>Confirm Password</h3>
          <label htmlFor="cpassword">Password</label>
          <input
            type={`${showPassword ? "text" : "password"}`}
            name="password"
            id="cpassword"
            value={checkPass.password.slice(0, 10) ?? ""}
            onChange={(e) =>
              setCheckPass({ ...checkPass, [e.target.name]: e.target.value })
            }
            placeholder="Enter password to continue"
          />
          <input
            type="checkbox"
            name="show"
            id="show"
            style={{ width: "fit-content", marginLeft: "5px" }}
            onChange={handleShowPassword}
          />
          <label
            htmlFor="show"
            style={{
              display: "inline-block",
              fontWeight: "400",
              fontSize: "18px",
              marginLeft: "10px",
              width: "60%",
              marginTop: "5px",
            }}
          >
            Show Password
          </label>
          <button
            type="button"
            onClick={() => {
              setPasswordModal(false);
              document.body.style.overflowY = "";
            }}
          >
            Cancel
          </button>
          <button type="submit">Continue</button>
        </form>
      </div>
    </section>
  );
};

export default Accounts;
