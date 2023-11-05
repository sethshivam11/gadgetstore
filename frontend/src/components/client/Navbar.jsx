import React from "react";
import "../../style/client/navbar.css";
import user from "../../img/user.svg";
import search from "../../img/search.svg";
import cart from "../../img/cart.svg";
import search2 from "../../img/search.png";
import logo from "../../img/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

const Navbar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const Ref = useRef();
  const handleSearch = (e) => {
    e.preventDefault();
    props.setQuery(e.target.search.value);
    navigate("/search");
  };
  const showSearch = () => {
    if (Ref.current.style.transform === "translateY(50px)") {
      Ref.current.style.transform = "translateY(-60px)";
    } else {
      Ref.current.style.transform = "translateY(50px)";
    }
  };
  const [nav, setNav] = useState(-100);
  const [backdrop, setBackdrop] = useState("d-none");
  const handleNav = () => {
    if (nav === -100) {
      // not hidden
      setNav(0);
      setBackdrop("d-block");
      document.body.style.overflowY = "hidden";
    } else {
      // hidden
      setBackdrop("d-none");
      setNav(-100);
      document.body.style.overflowY = "unset";
    }
  };
  const handleBackdrop = (link) => {
    navigate(link);
    handleNav();
  };
  return (
    <div style={{marginBottom: "-25px"}}>
      {/* backdrop filter */}
      <div id="backdrop" className={backdrop} onClick={() => handleBackdrop(location.pathname)}></div>
      {/* button for mobile nav */}
      <button
        id="nav-mobile"
        onClick={handleNav}
        style={{ color: `${nav === 0 ? "white" : "black"}` }}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      {/* main nav */}
      <nav id="navbar">
        <img src={logo} loading="eager" alt="Gadget Store" title="Home" id="logo" onClick={() => navigate("/")} />
        <span id="nav-list">
          <Link
            to="/mobiles"
            className={`nav-item ${
              location.pathname === "/mobiles" ? "active" : ""
            }`}
          >
            Mobiles
          </Link>
          <Link
            to="/pc"
            className={`nav-item ${
              location.pathname === "/pc" ? "active" : ""
            }`}
          >
            PCs
          </Link>
          <Link
            to="/electronics"
            className={`nav-item ${
              location.pathname === "/electronics" ? "active" : ""
            }`}
          >
            Electronics
          </Link>
          <Link
            to="/accessories"
            className={`nav-item ${
              location.pathname === "/accessories" ? "active" : ""
            }`}
          >
            Accessories
          </Link>
        </span>
        <span id="nav-user">
          <button id="search-toggle" title="Search" className="user-item" onClick={showSearch}>
            <img src={search} alt="search" />
          </button>
          <Link to="/account" title="Account" className="user-item">
            <img src={user} alt="user" />
          </Link>
          <Link to="/cart" title="Cart" className="user-item">
            <img src={cart} alt="cart" />
          </Link>
        </span>
      </nav>
      {/* search nav */}
      <nav id="sec-nav" ref={Ref}>
        <form id="search-bar" onSubmit={handleSearch}>
          <button id="search-btn" type="submit">
            <img src={search2} alt="search" />
          </button>
          <input
            type="text"
            placeholder="Search"
            autoCapitalize="on"
            name="search"
            id="search-input"
          />
        </form>
      </nav>
      {/* navbar for mobiles */}
      <nav
        id="third-nav"
        style={{
          transition: "transform 0.3s ease",
          transform: `translateX(${nav}%)`,
        }}
      >
        <span className="third-nav-list">
          <span className="coloured"></span>
          <button onClick={() => handleBackdrop("/")} className="nav-dep home">
            Home
          </button>
          <span className="nav-dep">Top Departments</span>
          <button
            className="nav-item"
            onClick={() => handleBackdrop("/mobiles")}
          >
            Mobiles
          </button>
          <button
            className="nav-item"
            to="/pc"
            onClick={() => handleBackdrop("/pc")}
          >
            PCs
          </button>
          <button
            to="/electronics"
            className="nav-item"
            onClick={() => handleBackdrop("/electronics")}
          >
            Electronics
          </button>
          <button
            to="/accessories"
            className="nav-item"
            onClick={() => handleBackdrop("/accessories")}
          >
            Accessories
          </button>
        </span>
      </nav>
    </div>
  );
};

export default Navbar;
