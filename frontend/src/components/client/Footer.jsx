import React, { useState } from "react";
import "../../style/client/footer.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const host = process.env.REACT_APP_HOST;
  const [sub, setSub] = useState({email: ""});
  const [subBtn, setSubBtn] = useState("Subscribe");
    const subscribe = (e) => {
      e.preventDefault();
      if(sub.email.length <= 4){
        return;
      }
      fetch(`${host}/api/client/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sub.email}),
      }).then(res => res.json()).then(resData => {
        console.log(resData);
        if(resData.success){
          setSubBtn(" Success");
          setTimeout(() => {
            setSubBtn("Subscribed");
          }, 10000)
        }
        else if(!resData.success && resData.error === "Email is already subscribed!"){
          setSubBtn("Subscribed");
        }
        else{
          setSubBtn(" Error");
        }
      })
      // subscribe this email
    }
    const handleChange = (e) => {
      setSub({...sub, [e.target.name]: e.target.value});
    }
  return (
    <footer>
      <form id="mid" onSubmit={subscribe}>
        <span>Subscribe to Get Latest Offers & Deals</span>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            id="subscribe"
            onChange={handleChange}
            required
          />
          <button id="footer-btn">{subBtn === " Success" ? (<i class="fa-solid fa-check fa-beat"></i>): ""}{subBtn}</button>
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
              <img src={logo} alt="logo" />
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
            <Link to="https://instagram.com/_seth_shivam" rel="noreferrer" target="_blank">
              <i className="fa fa-instagram"></i>&nbsp;&nbsp;&nbsp;&nbsp;Instagram
            </Link>
          </li>
          <li className="footer-nav">
            <Link
              to="https://www.facebook.com/people/Shivam-Soni/pfbid0CadrrAFrFQvjYw7wNBk5xqSHr36d4B8JJ2pp9CPGgC3PgHAVw8GFUfeswuFbbopGl/"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa fa-facebook"></i>&nbsp;&nbsp;&nbsp;&nbsp;Facebook
            </Link>
          </li>
          <li className="footer-nav">
            <Link to="https://www.linkedin.com/in/shivam-soni-20531a28b" rel="noreferrer" target="_blank">
              <i className="fa fa-linkedin"></i>&nbsp;&nbsp;&nbsp;&nbsp;LinkedIn
            </Link>
          </li>
          <li className="footer-nav">
            <Link to="https://twitter.com/shivam700216" rel="noreferrer" target="_blank">
              <i className="fa fa-twitter"></i>&nbsp;&nbsp;&nbsp;&nbsp;Twitter
            </Link>
          </li>
        </ul>
        <span>
          <i className="fa fa-copyright"></i>
          &nbsp;All Rights Reserved. Developer:&nbsp;
          <a
            href="https://www.linkedin.com/in/shivam-soni-20531a28b"
            target="_blank"
            rel="noreferrer"
          >
            Shivam Soni
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;