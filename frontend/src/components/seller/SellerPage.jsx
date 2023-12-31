import React, { useCallback, useEffect, useState } from "react";
import "../../style/client/product.css";
import "../../style/seller/sellerpage.css";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { faHome, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SellerPage = (props) => {
  const { setProgress, toast } = props;
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState("");
  const [delId, setDelId] = useState("");
  let token = localStorage.getItem("gadgetstore-seller-token");
  const fetchProducts = useCallback(() => {
    document.title = "Gadget Store";
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
      }).catch(err => {
        setProgress(100);
        console.log(err);
        toast.error("Something went wrong, Please try again later!");
      })
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
      console.log(data.product)
      setProducts(products.filter(product => product._id !== data.product._id));
      toast.success("Product deleted");
    } else if (data.error === "Internal Server Error!") {
      console.log(data.error);
      toast.error("Something went wrong");
    } else {
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
      <button className="seller-button home-btn" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHome} />
        &nbsp;&nbsp;Home
      </button>
      <div className="product-list">
        {products.length > 0 &&
          products.map((product) => (
            <div key={product._id} className="product product-seller">
              <div className="product-details">
                <div className="img-div">
                  <img src={product.images[0]} alt={product.name} />
                </div>
                <strong className="product-capitalize">{product.name}</strong>
                <p className="product-capitalize">Brand: {product.brand}</p>
                <p className="product-capitalize">
                  Category: {product.category}
                </p>
                <p>Description: {product.description.slice(0, 120) + "..."}</p>
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
                  <FontAwesomeIcon icon={faPencil} />&nbsp;&nbsp;Edit
                </button>
                <button
                  className="danger seller-button"
                  onClick={() => handleDelete(product._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  &nbsp;&nbsp;Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default SellerPage;
