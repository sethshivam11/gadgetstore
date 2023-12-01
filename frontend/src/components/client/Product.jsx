import React from 'react';
import "../../style/client/product.css";
import { Link } from 'react-router-dom';

const Product = (props) => {
  return (
    <Link to={`product/${props.link}`} className="product">
      <div className="img-div">
        <img loading="eager" src={props.img} alt={props.alt} />
      </div>
      <span className="product-detail">
        <p className="product-name">
          {props.name.length < 16 ? props.name : (props.name.slice(0, 16) + "...")}
        </p>
        {props.detail.length < 20 ? props.detail : (props.detail.slice(0, 20) + "...")}
      </span>
    </Link>
  );
}

export default Product
