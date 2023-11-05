import React, { useCallback, useEffect, useState } from "react";
import "../../style/seller/createproduct.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = (props) => {
  const { setProgress, toast } = props;
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  const token = localStorage.getItem("gadgetstore-seller-token");
  let { productId } = useParams();
  const fetchData = useCallback(() => {
    setProgress(30);
    fetch(`${host}/api/seller/product/fetch/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setProgress(50);
        if (jsonData.success) {
          setProductData({
            oname: jsonData.product.name,
            obrand: jsonData.product.brand,
            ocategory: jsonData.product.category,
            odiscount: jsonData.product.discount,
            ohighlights: jsonData.product.highlights,
            orating: jsonData.product.rating,
            osubCategory: jsonData.product.subCategory,
            odescription: jsonData.product.description,
            oimages: jsonData.product.images,
            oprice: jsonData.product.price,
            ostock: jsonData.product.stock,
            omore: jsonData.product.more,
          });
          setProgress(70);
        } else if (jsonData.error === "Internal Server Error!") {
          toast.error("Something went wrong, Please try again later!");
          console.log(jsonData.error);
        } else {
          toast.error(jsonData.error);
        }
        setProgress(100);
      });
  }, [token, productId, host, setProgress, toast]);
  useEffect(() => {
    if (!token) {
      navigate("/seller/login");
    }
    fetchData();
  }, [fetchData, navigate, token]);
  const [productData, setProductData] = useState({
    oname: "",
    obrand: "",
    ocategory: "",
    odescription: "",
    ohighlights: "",
    orating: "",
    odiscount: "",
    osubCategory: "",
    oimages: [],
    oprice: "",
    ostock: "",
    omore: "",
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
        toast.success("Something went wrong!");
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(30);
    const discountN = Number(productData.odiscount);
    const priceN = Number(productData.oprice);
    const stockN = Number(productData.ostock);
    const ratingN = Number(productData.orating)
    const data = {
      name: productData.oname,
      brand: productData.obrand.toLowerCase(),
      category: productData.ocategory.toLowerCase(),
      discount: discountN,
      rating: ratingN,
      description: productData.odescription,
      highlights: productData.ohighlights,
      subCategory: productData.osubCategory.toLowerCase(),
      images: images.concat(productData.oimages),
      price: priceN,
      stock: stockN,
      more: productData.omore,
    };
    fetch(`${host}/api/seller/product/update/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setProgress(50);
        if (jsonData.success) {
          navigate("/seller");
          setProgress(70);
          toast.success("Product updated successfully");
        } else if (jsonData.error === "Internal Server Error!") {
          console.log("Token Error Occured");
          toast.error("Something went wrong!");
          navigate("/seller");
        } else {
          console.log(jsonData);
          toast.error(jsonData.error);
        }
        setProgress(70);
      });
  };
  const isFormValid =
    productData.oname.length >= 3 &&
    productData.ocategory.length >= 1 &&
    productData.odescription.length >= 10 &&
    productData.oprice > 0 &&
    productData.obrand.length > 0 &&
    productData.ostock > 0;
  return (
    <div className="create-product-main">
      <div className="create-product">
        <h2>Update Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="label-createproduct">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="oname"
              className="input-createproduct"
              value={productData.oname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="brand" className="label-createproduct">
              Brand:
            </label>
            <input
              type="text"
              id="brand"
              name="obrand"
              className="input-createproduct"
              value={productData.obrand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="discount" className="label-createproduct">
              Discount:
            </label>
            <input
              type="number"
              id="discount"
              name="odiscount"
              className="input-createproduct"
              value={productData.odiscount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating" className="label-createproduct">
              Ratings:
            </label>
            <input
              type="number"
              id="rating"
              name="orating"
              className="input-createproduct"
              value={productData.orating}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category" className="label-createproduct">
              Category:
            </label>
            <input
              type="text"
              id="category"
              name="ocategory"
              className="input-createproduct"
              value={productData.ocategory}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subCategory" className="label-createproduct">
              Sub-Category:
            </label>
            <input
              type="text"
              id="subCategory"
              name="osubCategory"
              className="input-createproduct"
              value={productData.osubCategory}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="highlights" className="label-createproduct">
              Highlights:
            </label>
            <textarea
              id="highlights"
              name="ohighlights"
              className="input-createproduct"
              value={productData.ohighlights}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="label-createproduct">
              Description:
            </label>
            <textarea
              id="description"
              name="odescription"
              className="input-createproduct"
              value={productData.odescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image-input" className="label-createproduct">
              Images:
            </label>
            <input
              type="file"
              name="oimages"
              id="image-input"
              className="input-createproduct"
              onChange={handleImageUpload}
              accept="image/*"
              multiple
            />
            <div className="images-glare">
              {productData.oimages &&
                productData.oimages.map((image, index) => {
                  return (
                    <div key={index} className="img-with-btn">
                      <a href={image}>
                        <img
                          className="small-img"
                          alt={image + index}
                          src={image}
                          target="_blank"
                          rel="noreferrer"
                        />
                      </a>
                    </div>
                  );
                })}
              {images &&
                images.map((image, index) => {
                  return (
                    <div key={index} className="img-with-btn">
                      <a href={image}>
                        <img
                          className="small-img"
                          alt={image + index}
                          src={image}
                          target="_blank"
                          rel="noreferrer"
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
            <label htmlFor="price" className="label-createproduct">
              Price:
            </label>
            <input
              type="number"
              id="price"
              name="oprice"
              className="input-createproduct"
              value={productData.oprice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock" className="label-createproduct">
              Stock Units:
            </label>
            <input
              type="number"
              id="stock"
              name="ostock"
              className="input-createproduct"
              value={productData.ostock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="more" className="label-createproduct">
              More:
            </label>
            <input
              type="text"
              id="more"
              name="omore"
              className="input-createproduct"
              value={productData.omore}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="create-product-button"
            disabled={!isFormValid}
          >
            Update Product
          </button>
          <button
            type="button"
            className="remove-btn cancel-btn"
            onClick={() => navigate("/seller")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
