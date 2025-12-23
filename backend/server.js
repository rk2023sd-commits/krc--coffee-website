const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// DB
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");

// CONFIG
dotenv.config();
connectDB();

// APP INIT  ✅ YAHI SABSE IMPORTANT HAI
const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES USE (app ke baad hi)
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
