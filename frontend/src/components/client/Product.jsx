import React from 'react';
import "../../style/client/product.css";
import { Link } from 'react-router-dom';

const Product = (props) => {
  return (
    <Link to={`product/${props.link}`} className="product">
        <div className="img-div">
          <img src={props.img} alt={props.alt} />
        </div>
        <span className="product-detail">
          <p className="product-name">{props.name}</p>
          {props.detail}
        </span>
    </Link>
  );
}

export default Product
