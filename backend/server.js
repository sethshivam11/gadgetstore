require("dotenv").config();

const express = require("express");
const port = process.env.PORT;
const app = express();
const connectToDb = require("./db");
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

app.get("/health", (_, res) => {
  res.json({ success: true, message: "Server is running" });
});

function reloadWebsite() {
  fetch(process.env.PUBLIC_URL || "https://shopgadgetstore.onrender.com")
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toLocaleString("en-IN")}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => {
      console.error(
        `Error reloading at ${new Date().toLocaleString("en-IN")}:`,
        error.message
      );
    });
}

if (process.env.NODE_ENV === "production") {
  setInterval(
    reloadWebsite,
    parseInt(process.env.RELOAD_INTERVAL) || 1000 * 60 * 5
  );
}
