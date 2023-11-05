const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const dotenv = require("dotenv").config();
const { body, validationResult } = require("express-validator");
const fetchSeller = require("../../middlewares/fetchSeller");

// Route 1: Create a new product: POST "/api/seller/product/create"
router.post(
  "/create",
  fetchSeller,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("category", "Enter a valid category").isLength({ min: 1 }),
    body("images", "Enter a valid image link").notEmpty(),
    body("price", "Enter a valid price").notEmpty(),
    body("stock", "Enter a valid stock").notEmpty(),
    body("brand", "Enter a valid brand").notEmpty(),
    body("description", "Enter a valid description").isLength({ min: 10 }),
    body("brand", "Enter a valid brand").notEmpty(),
    body("highlights", "Enter valid highlights").notEmpty(),
    body("rating", "Enter a valid rating").notEmpty()
  ],
  async (req, res) => {
    let success = false;
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }
      const { name, category, brand, subCategory, highlights, rating, discount, images, price, stock, description, more } =
        req.body;
      const sellerId = req.seller;
        const product = new Product({
          name,
          seller: sellerId,
          category,
          brand,
          subCategory,
          discount,
          highlights,
          rating,
          images,
          price,
          stock,
          description,
          more,
        });
        const savedProduct = await product.save();
        success = true;
        res.status(200).json({ success, product: savedProduct });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success, error: "Internal Server Error!" });
    }
  }
);

// Route 2: Fetch all products sold by a seller: POST "/api/seller/product/fetch"
router.get("/fetch", fetchSeller, async (req, res) => {
  const sellerId = req.seller;
  let success = false;
  try{
  const products = await Product.find({seller: sellerId});
  success = true;
  res.status(200).json({success, products});
  }catch(err){
    console.log(err);
    res.status(500).json({success, error: "Internal Server Error!"});
  }
});

// Route 3: Update a product: PUT "/api/seller/product/update/:id"
router.put("/update/:id", fetchSeller, async (req, res) => {
  const { name, brand, category, subCategory, highlights, rating, images, price, stock, description, more } = req.body;
  const sellerId = req.seller;
  const productId = req.params.id;
  if(!productId){
    return res.status(400).json({success, error: "Please provide a valid product!"});
  }
  let success = false;
  const newProduct = {};
  if(name){
    newProduct.name = name;
  }
  if(brand){
    newProduct.brand = brand;
  }
  if(category){
    newProduct.category = category;
  }
  if(subCategory){
    newProduct.subCategory = subCategory;
  }
  if(images){
    newProduct.images = images;
  }
  if(price){
    newProduct.price = price;
  }
  if(stock){
    newProduct.stock = stock;
  }
  if(description){
    newProduct.description = description;
  }
  if(more){
    newProduct.more = more;
  }
  if(highlights){
    newProduct.highlights = highlights;
  }
  if(rating){
    newProduct.rating = rating;
  }
  try{
    let product = await Product.findById(productId);
    if(!product){
      return res.status(400).json({success, error: "Product not found!"});
    }
    if(product.seller.toString() != sellerId){
      return res.status(401).json({success, error: "Not allowed"});
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: newProduct },
      { new: true }
    );
    success = true;
    res.status(200).json({success, product: updatedProduct});
  }
  catch(err){
    console.log(err);
    res.status(500).json({success, error: "Internal Server Error!"});
  }
});

// Route 4: Delete a product: PUT "/api/seller/product/delete/:id"
router.delete("/delete/:id", fetchSeller, async(req, res) => {
  let success = false;
  const sellerId = req.seller;
  const productId = req.params.id;
  if(!productId){
    return res.status(400).json({success, error: "Please provide a valid product id"});
  }
  try{
    const product = await Product.findById(productId);
    if(!product){
      return res.status(400).json({success, error: "Product not found!"});
    }
    if(product.seller.toString() != sellerId){
      return res.status(401).json({success, error: "Not allowed!"});
    }
    const deleted = await Product.findByIdAndDelete(productId);
    success = true;
    res.status(200).json({ success, product: deleted });
  }catch(err){
    console.log(err);
    res.status(500).json({success, error: "Internal Server Error!"});
  }
});

// Route 5: Fetching a single product details: GET "/api/seller/product/fetch:id"
router.get("/fetch/:id", fetchSeller, async (req, res) => {
  const sellerId = req.seller;
  let success = false;
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if(!product){
      res.status(400).json({ success, error: "Product not found!" });
    }
    if(product.seller.toString() != sellerId){
      res.status(401).json({success, error: "Not Allowed!"});
    }
    success = true;
    res.status(200).json({success, product});
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: "Internal Server Error!" });
  }
})

module.exports = router;