const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const app = express();
const connectToDb = require("./db");
const path = require("path");
const __dirname1 = path.resolve();
const cors = require("cors");

connectToDb();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "*",
    credentials: true,
  })
);

// User Routes
app.use("/api/client", require("./routes/client/client"));
app.use("/api/user/auth", require("./routes/user/auth"));
app.use("/api/user", require("./routes/user/products"));
app.use("/api/user/address", require("./routes/user/address"));
app.use("/api/user/order", require("./routes/user/order"));
app.use("/api/payments", require("./routes/user/payment"));

// Seller Routes
app.use("/api/seller/auth", require("./routes/seller/auth"));
app.use("/api/seller/product", require("./routes/seller/product"));
app.use("/api/client", require("./routes/client/subscribe"));
app.listen(port, () => console.log("Server is running on port:", port));

// ----------------------Deployment-----------------------------
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

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
