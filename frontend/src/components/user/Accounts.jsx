import React, { useCallback, useEffect, useState } from "react";
import "../../style/user/accounts.css";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";
import Address from "./Address";

const Accounts = (props) => {
  const { setProgress, toast } = props;
  const host = process.env.REACT_APP_HOST;
  const token = localStorage.getItem("gadgetstore-user-token");
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  // eslint-disable-next-line
  const[delivery, setDelivery] = useState({});
  const [profile, setProfile] = useState(true);
  const [orders, setOrders] = useState(false);
  const [addresses, setAddresses] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkPass, setCheckPass] = useState({ password: "" });
  const [editPassword, setEditPassword] = useState(false);
  const [showMainPassword, setShowMainPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("GS");
  const [creds, setCreds] = useState({
    name: "",
    email: "",
    password: "123456",
  });
  const fetchAccount = useCallback(() => {
    setProgress(50);
    fetch(`${host}/api/user/auth/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setProgress(70);
        if (jsonData.success) {
          jsonData.user.password = "123456";
          setCreds(jsonData.user);
          let name = jsonData.user.name;
          if(name.includes(" ")){
          let first = name.split(" ")[0].slice(0, 1);
          let second = name.split(" ")[1].slice(0, 1);
          setAvatar(first.concat(second));
          }
          else{
            let first = name.slice(0,2);
            setAvatar(first);
          }
          setName(jsonData.user.name)
          setEmail(jsonData.user.email)
          setProgress(100);
        } else {
          setProgress(70);
          console.log(jsonData.error);
          navigate("/login");
          setProgress(100);
        }
      });
  }, [host, token, navigate, setProgress]);
  const checkPassword = useCallback(() => {
    setProgress(50);
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
        setProgress(70);
        if (jsonData.success) {
          setCreds(jsonData.user);
          setPasswordModal(false);
          setEdit(true);
          setCheckPass({ password: "" });
          document.body.style.overflowY = "";
          setProgress(100);
        } else {
          setProgress(70);
          console.log(jsonData.error);
          setProgress(100);
        }
      });
  }, [host, token, checkPass, setProgress]);
  const handleUpdate = (e) => {
    e.preventDefault();
    setProgress(30);
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
        setProgress(50);
        if (resData.success) {
          setProgress(70);
          setCreds({
            name: creds.name,
            email: creds.email,
            password: creds.password.slice(0, 6),
          });
          setName(creds.name)
          setEmail(creds.email)
          setEdit(false);
          setEditPassword(false);
          setShowMainPassword(false);
          setProgress(100);
          toast.success("Account updated successfully");
        } else {
          setProgress(70);
          console.log(resData.error);
          setProgress(100);
          toast.error("Something went wrong, Please try again later!");
        }
      });
  };
  useEffect(() => {
    setProgress(30);
    if (!token) {
      setProgress(70);
      navigate("/login");
      setProgress(100);
    }
    fetchAccount();
  }, [navigate, token, fetchAccount, setProgress]);
  const handleConfirmPassword = (e) => {
    e.preventDefault();
    setProgress(30);
    checkPassword();
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const handleShowPasswordMain = () => {
    setShowMainPassword(!showMainPassword);
  };
  return (
    <section>
      <div id="account-top">
        <div className="account-creds">
          <div className="avatar">{avatar}</div>
          <p id="account-name">{name}</p>
          <p id="account-email">{email}</p>
        </div>
        <button id="account-btn" type="button" onClick={() => navigate("/")}>
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
          }}
        >
          Profile
        </li>
        <li
          className={`${orders ? "account-active" : ""}`}
          onClick={() => {
            setProfile(false);
            setOrders(true);
            setAddresses(false);
          }}
        >
          Orders
        </li>
        <li
          className={`${addresses ? "account-active" : ""}`}
          onClick={() => {
            setProfile(false);
            setOrders(false);
            setAddresses(true);
          }}
        >
          Saved Address
        </li>
      </ul>
      {profile && !orders && !addresses && (
        <form className="account-bottom" onSubmit={handleUpdate}>
          <label htmlFor="name" className="account-update-label">
            Name
          </label>
          <input
          autoComplete="name"
          autoCapitalize="on"
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
            autoComplete="email"
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
            autoComplete="new-password"
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
            {editPassword && edit ? "Clear" : "Edit"}
          </button>
          <div>
            <input
              type="checkbox"
              autoComplete="off"
              name="showpassword"
              id="showpassword"
              onChange={handleShowPasswordMain}
              disabled={!editPassword || !edit}
              checked={showMainPassword}
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
              toast("Enter Password to continue", {
                style: {
                  background: "orange",
                  color: "white",
                },
              });

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
      {!profile && orders && !addresses && <Orders />}
      {!profile && !orders && addresses && <Address width={"100%"} address={true} setDelivery={setDelivery} host={host} token={token} toast={toast} setProgress={setProgress} />}
      <div
        id="password-modal"
        style={{
          transform: `${
            passwordModal ? "translateY(0%)" : "translateY(-110%)"
          }`,
        }}
      >
        <form onSubmit={handleConfirmPassword}>
          <h3>Confirm Password</h3>
          <label htmlFor="cpassword">Password</label>
          <input
          autoComplete="current-password"
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
            autoComplete="off"
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
