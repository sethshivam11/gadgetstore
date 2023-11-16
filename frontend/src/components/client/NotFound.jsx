import React from 'react';
import "../../style/client/notfound.css";
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='not-found-main'
    >
      <h1 className='not-found-heading'>404</h1>
      <hr className='not-found-line' />
      <p className='not-found-para'>This page is is not found</p>
      <Link to="/" className="not-found-home" type="button">Home</Link>
    </div>
  );
}

export default NotFound;
