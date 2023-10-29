import React, { useEffect, useState } from "react";
import "../../style/seller/createproduct.css";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  const token = localStorage.getItem("gadgetstore-seller-token");
  useEffect(() => {
    if(!token){
      navigate("/seller/login");
    }
  });
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    subCategory: "",
    brand: "",
    discount: "",
    description: "",
    images: [],
    price: "",
    stock: "",
    more: "",
  });
  const [images, setImages] = useState([]);
  const [delTokens, setDelTokens] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };
  const handleRemoveImage = async (fileToRemove) => {
    const index = images.indexOf(fileToRemove);
    const data = new FormData();
    data.append("token", delTokens[index]);
    fetch("https://api.cloudinary.com/v1_1/dv3qbj0bn/delete_by_token", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((jsonData) => {
        if(jsonData.result === "ok"){
        const updatedImages = images.filter((file) => file !== fileToRemove);
        setImages(updatedImages);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleImageUpload = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "gadget-store");
      fetch("https://api.cloudinary.com/v1_1/dv3qbj0bn/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((resData) => {
          const url = resData.url;
          const token = resData.delete_token;
          setImages(images => [...images, url]);
          setDelTokens(delTokens => [...delTokens, token]);
          const file = document.getElementById('image-input');
          file.value = '';
        })
        .catch((err) => console.log(err));
    });}
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: productData.name,
      brand: productData.brand.toLowerCase(),
      category: productData.category.toLowerCase(),
      subCategory: productData.subCategory.toLowerCase(),
      discount: productData.discount,
      description: productData.description,
      images: images,
      price: productData.price,
      stock: productData.stock,
      more: productData.more
    }
    fetch(`${host}/api/seller/product/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify(data)
    }).then((res) => res.json()).then((jsonData) => {
      if(jsonData.success){
        navigate("/seller");
      }
    })
  }
  const isFormValid =
  productData.name.length >= 3 &&
    productData.category.length >= 1 &&
    productData.description.length >= 10 &&
    productData.price > 0 &&
    productData.brand.length > 0 &&
    productData.stock > 0;
  return (
    <div className="create-product">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="label-createproduct">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="input-createproduct"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand" className="label-createproduct">Brand:</label>
          <input
            type="text"
            name="brand"
            id="brand"
            className="input-createproduct"
            value={productData.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount" className="label-createproduct">Discount:</label>
          <input
            type="text"
            id="discount"
            name="discount"
            className="input-createproduct"
            value={productData.discount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category" className="label-createproduct">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            className="input-createproduct"
            value={productData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="subCategory" className="label-createproduct">Sub-Category:</label>
          <input
            type="text"
            id="subCategory"
            name="subCategory"
            className="input-createproduct"
            value={productData.subCategory}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="label-createproduct">Description:</label>
          <textarea
            name="description"
            id="description"
            className="input-createproduct"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image-input" className="label-createproduct">Images:</label>
          <input
            type="file"
            name="images"
            className="input-createproduct"
            multiple
            id="image-input"
            onChange={handleImageUpload}
            accept="image/*"
          />
          <div className="images-glare">
            {images.map((image, index) => {
              return (
                <div key={index} className="img-with-btn">
                  <a href={image} target="_blank" rel="noreferrer">
                    <img
                      className="small-img"
                      alt={image + index}
                      src={image}
                    />
                  </a>
                  <button
                    className="create-product-button remove-btn"
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="price" className="label-createproduct">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            className="input-createproduct"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock" className="label-createproduct">Stock Units:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            className="input-createproduct"
            value={productData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="more" className="label-createproduct">More:</label>
          <input
            type="text"
            id="more"
            className="input-createproduct"
            name="more"
            value={productData.more}
            onChange={handleChange}
          />
        </div>
        <button
          className="create-product-button"
          type="submit"
          disabled={!isFormValid}
        >
          Create Product
        </button>
        <button
          type="button"
          className="create-product-button remove-btn cancel-btn"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
