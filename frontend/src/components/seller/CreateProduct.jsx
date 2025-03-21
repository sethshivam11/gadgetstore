import React, { useEffect, useState } from "react";
import "../../style/seller/createproduct.css";
import { useNavigate } from "react-router-dom";

const CreateProduct = (props) => {
  const { setProgress, toast } = props;
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const token = localStorage.getItem("gadgetstore-seller-token");
  const [preset, setPreset] = useState("");
  useEffect(() => {
    if (!token) {
      navigate("/seller/login");
    }
    fetch("/api/seller/product/get-preset", {
      headers: {
        token,
      },
    })
      .then((parsed) => parsed.json())
      .then((jsonData) => {
        setPreset(jsonData.code);
      });
  }, []);
  const [productData, setProductData] = useState({
    name: "",
    category: "mobiles",
    subCategory: "",
    brand: "",
    discount: "",
    rating: "",
    highlights: "",
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
        if (jsonData.result === "ok") {
          const updatedImages = images.filter((file) => file !== fileToRemove);
          setImages(updatedImages);
          toast.success("Image removed");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };
  const handleImageUpload = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", preset);
      fetch("https://api.cloudinary.com/v1_1/dv3qbj0bn/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((resData) => {
          const url = resData.url;
          const token = resData.delete_token;
          setImages((images) => [...images, url]);
          setDelTokens((delTokens) => [...delTokens, token]);
          const file = document.getElementById("image-input");
          file.value = "";
          toast.success("Image uploaded");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong!");
        });
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(productData.discount) > 99) {
      toast.error("Discount cannot be greater than 99%");
      return;
    }
    if (parseInt(productData.rating) > 5) {
      toast.error("Rating cannot be greater than 5");
      return;
    }
    setProgress(30);
    const data = {
      name: productData.name,
      brand: productData.brand.toLowerCase(),
      category: productData.category.toLowerCase(),
      subCategory: productData.subCategory.toLowerCase(),
      discount: productData.discount,
      description: productData.description,
      highlights: productData.highlights,
      rating: productData.rating,
      images: images,
      price: productData.price,
      stock: productData.stock,
      more: productData.more,
    };
    fetch(`${host}/api/seller/product/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setProgress(50);
        if (jsonData.success) {
          setProgress(70);
          navigate("/seller");
        } else if (jsonData.error === "Internal Server Error!") {
          toast.error("Something went wrong!");
          console.log(jsonData);
        } else {
          toast.error(jsonData.error);
        }
        setProgress(100);
      })
      .catch((err) => {
        setProgress(100);
        console.log(err);
        toast.error("Something went wrong, Please try again later!");
      });
  };
  const isFormValid =
    productData.name.length >= 3 &&
    productData.category.length >= 1 &&
    productData.description.length >= 10 &&
    productData.price > 0 &&
    productData.brand.length > 0 &&
    productData.stock > 0;
  return (
    <div className="create-product-main">
      <div className="create-product">
        <h2>Create Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="create-product-form-group">
            <label htmlFor="name" className="label-createproduct">
              Name:
            </label>
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
          <div className="create-product-form-group">
            <label htmlFor="brand" className="label-createproduct">
              Brand:
            </label>
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
          <div className="create-product-form-group">
            <label htmlFor="price" className="label-createproduct">
              Price:
            </label>
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
          <div className="create-product-form-group">
            <label htmlFor="discount" className="label-createproduct">
              Discount:
            </label>
            <input
              type="number"
              max={100}
              maxLength={2}
              id="discount"
              name="discount"
              className="input-createproduct"
              value={productData.discount}
              onChange={handleChange}
            />
          </div>
          <div className="create-product-form-group">
            <label htmlFor="rating" className="label-createproduct">
              Ratings:
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              className="input-createproduct"
              value={productData.rating}
              onChange={handleChange}
              required
            />
          </div>
          <div className="create-product-form-group">
            <label htmlFor="category" className="label-createproduct">
              Category:
            </label>
            <select
              name="category"
              className="input-createproduct"
              defaultValue={"mobiles"}
              onChange={handleChange}
              id="category"
              required
            >
              <option value="mobiles">Mobiles</option>
              <option value="pc">PCs</option>
              <option value="electronics">Electronics</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div className="create-product-form-group">
            <label htmlFor="subCategory" className="label-createproduct">
              Sub-Category:
            </label>
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
          <div className="create-product-form-group">
            <label htmlFor="highlights" className="label-createproduct">
              Highlights:
            </label>
            <textarea
              name="highlights"
              id="highlights"
              className="input-createproduct"
              value={productData.highlights}
              onChange={handleChange}
              required
            />
          </div>
          <div className="create-product-form-group">
            <label htmlFor="description" className="label-createproduct">
              Description:
            </label>
            <textarea
              name="description"
              id="description"
              className="input-createproduct"
              value={productData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="create-product-form-group">
            <label htmlFor="image-input" className="label-createproduct">
              Images:
            </label>
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
          <div className="create-product-form-group">
            <label htmlFor="stock" className="label-createproduct">
              Stock Units:
            </label>
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
          <div className="create-product-form-group">
            <label htmlFor="more" className="label-createproduct">
              More:
            </label>
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
            // disabled={!isFormValid}
          >
            Create Product
          </button>
          <button
            type="button"
            className="create-product-button remove-btn cancel-btn"
            onClick={() => navigate("/seller")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
