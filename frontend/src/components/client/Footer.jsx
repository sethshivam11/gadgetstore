import React, { useState } from "react";
import "../../style/client/footer.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTwitter, faLinkedin, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";

const Footer = (props) => {
  const { setProgress, toast } = props;
  const host = import.meta.env.VITE_HOST;
  const [sub, setSub] = useState({ email: "" });
  const [subBtn, setSubBtn] = useState(false);
  const subscribe = (e) => {
    e.preventDefault();
    if (sub.email.length <= 4) {
      return;
    }
    setProgress(30);
    fetch(`${host}/api/client/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: sub.email }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setProgress(50);
        if (resData.success) {
          setProgress(70);
          setSubBtn(true);
          toast.success("Subscribe successful");
          setProgress(100);
        } else if (resData.error === "Internal Server Error!") {
          setProgress(70);
          setSubBtn(false);
          setProgress(100);
          toast.error("Something went wrong, Please try again later!");
        } else {
          toast.success(resData.error);
          setProgress(70);
          setSubBtn(true);
          setProgress(100);
        }
      });
    // subscribe this email
  };
  const handleChange = (e) => {
    setSub({ ...sub, [e.target.name]: e.target.value });
  };
  return (
    <footer>
      <form id="mid" onSubmit={subscribe}>
        <span>Subscribe to Get Latest Offers & Deals</span>
        <div>
          <input
            type="email"
            autoComplete="email"
            name="email"
            placeholder="Enter your email address"
            id="subscribe"
            onChange={handleChange}
            required
          />
          <button id="footer-btn">
            {subBtn ? "Subscribed" : "Subscribe"}
            {subBtn}
          </button>
        </div>
      </form>
      <div id="end">
        <ul className="footer-list">
          <li className="footer-nav">
            <Link to="/mobiles">Mobiles</Link>
          </li>
          <li className="footer-nav">
            <Link to="/pc">PCs</Link>
          </li>
          <li className="footer-nav" id="footer-logo">
            <Link to="/">
              <img loading="lazy" src={logo} alt="logo" />
            </Link>
          </li>
          <li className="footer-nav">
            <Link to="/electronics">Electronics</Link>
          </li>
          <li className="footer-nav">
            <Link to="/accessories">Accessories</Link>
          </li>
        </ul>
        <hr id="only-mobile" />
        <ul className="footer-list no">
          <li className="footer-nav">
            <Link
              to="https://instagram.com/_seth_shivam"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={faInstagram} />
              &nbsp;&nbsp;&nbsp;&nbsp;Instagram
            </Link>
          </li>
          <li className="footer-nav">
            <Link
              to="https://www.facebook.com/people/Shivam-Soni/pfbid0CadrrAFrFQvjYw7wNBk5xqSHr36d4B8JJ2pp9CPGgC3PgHAVw8GFUfeswuFbbopGl/"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={faFacebook} />
              &nbsp;&nbsp;&nbsp;&nbsp;Facebook
            </Link>
          </li>
          <li className="footer-nav">
            <Link
              to="https://www.linkedin.com/in/shivam-soni-20531a28b"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              &nbsp;&nbsp;&nbsp;&nbsp;LinkedIn
            </Link>
          </li>
          <li className="footer-nav">
            <Link
              to="https://twitter.com/shivam700216"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={faTwitter} />
              &nbsp;&nbsp;&nbsp;&nbsp;Twitter
            </Link>
          </li>
        </ul>
        <span>
          <div className="developer">
            <FontAwesomeIcon icon={faCopyright} />
            &nbsp;All Rights Reserved. Developer:&nbsp;
            <a
              href="https://www.linkedin.com/in/shivam-soni-20531a28b"
              target="_blank"
              rel="noreferrer"
            >
              Shivam Soni
            </a>
          </div>
          <Link to="/seller" style={{ position: "relative", right: "50px" }}>
            Seller Section
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
