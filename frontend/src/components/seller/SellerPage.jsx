import React, { useCallback, useEffect, useState } from "react";
import "../../style/seller/sellerpage.css";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

const SellerPage = (props) => {
  const { setProgress, toast } = props;
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState("");
  const [delId, setDelId] = useState("");
  let token = localStorage.getItem("gadgetstore-seller-token");
  const fetchProducts = useCallback(() => {
    setProgress(30);
    if (!token) {
      setProgress(100);
      return navigate("/seller/login");
    }
    setProgress(50);
    fetch(`${host}/api/seller/product/fetch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData.success) {
          setProgress(70);
          setProducts(jsonData.products);
        } else if (
          jsonData.error === "Please authenticate using a valid token"
        ) {
          navigate("/seller/login");
          console.log("Token Error Occured");
          toast.error("Session expired, Please login again!");
          localStorage.removeItem("gadgetstore-seller-token");
        } else {
          console.log(jsonData.error);
          toast.error("Something went wrong, Please try again later!");
        }
        setProgress(100);
      });
  }, [setProgress, toast, token, navigate, host, setProducts]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const handleDelete = (id) => {
    setDelId(id);
    setOpen("open");
  };
  const handleUpdate = (id) => {
    navigate(`/seller/product/update/${id}`);
  };
  const deleteProduct = async () => {
    const response = await fetch(`${host}/api/seller/product/delete/${delId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    const data = await response.json();
    if (data.success) {
      setOpen("");
      setProducts(products - data.product);
      toast.success("Product deleted")
    } else if(data.error === "Internal Server Error!") {
      console.log(data.error);
      toast.error("Something went wrong");
    }
    else{
      toast.error(data.error);
    }
  };
  const handleLogOut = () => {
    localStorage.removeItem("gadgetstore-seller-token");
    navigate("/seller/login");
  };
  return (
    <div className="seller-homepage">
      <ConfirmModal
        heading="Confirm Delete"
        para="Are you sure you want to delete this product?"
        firstBtn="Delete"
        secBtn="Cancel"
        isOpen={open}
        onCancel={() => setOpen("")}
        onDelete={() => deleteProduct(delId) && setOpen("")}
      />
      <h1>Seller Homepage</h1>
      <button
        className="add-new seller-button"
        onClick={() => navigate("/seller/product")}
      >
        + Add New
      </button>
      <button className="log-out seller-button danger" onClick={handleLogOut}>
        Log Out
      </button>
      <div className="product-list">
        {products.length > 0 &&
          products.map((product) => (
            <div key={product._id} className="product product-seller">
              <div className="product-details">
                <div className="img-div">
                  <img src={product.images[0]} alt={product.name} />
                </div>
                <strong>{product.name}</strong>
                <p>Brand: {product.brand}</p>
                <p>Category: {product.category}</p>
                <p>Description: {product.description}</p>
                <p>Price: &#8377;{product.price}</p>
                <p>Stock Units: {product.stock}</p>
                <div className="product-image">
                  <strong>Images: </strong>
                  {product.images.map((image, index) => (
                    <a
                      key={index}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="image-link"
                    >
                      {`Image ${index + 1}`}
                    </a>
                  ))}
                </div>
                {/* Add more details as needed */}
                <button
                  className="seller-button"
                  onClick={() => handleUpdate(product._id)}
                >
                  <i className="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Edit
                </button>
                <button
                  className="danger seller-button"
                  onClick={() => handleDelete(product._id)}
                >
                  <i className="fa fa-trash-o"></i>&nbsp;&nbsp;Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default SellerPage;
