const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts
} = require("../controllers/product.controller");

const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");

router.post("/", auth, admin, createProduct);
router.get("/", auth, admin, getProducts);

module.exports = router;
