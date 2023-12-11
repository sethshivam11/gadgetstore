const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const app = express();
const connectToDb = require("./db");
const path = require("path");
const __dirname1 = path.resolve();
connectToDb();

app.use(express.json());



// User Routes
app.use("/api/client", require("./routes/client/client"));
app.use("/api/user/auth", require("./routes/user/auth"));
app.use("/api/user", require("./routes/user/products"));
app.use("/api/user/address", require("./routes/user/address"));
app.use("/api/user/order", require("./routes/user/order"));

// Seller Routes
app.use("/api/seller/auth", require("./routes/seller/auth"));
app.use("/api/seller/product", require("./routes/seller/product"));
app.use("/api/client", require("./routes/client/subscribe"));
app.listen(port, () => console.log("Server is running on port:", port));



// ----------------------Deployment-----------------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send(
      "This page is under development mode! We are trying to make some fixes."
    );
  });
}
