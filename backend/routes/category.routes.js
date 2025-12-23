const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory
} = require("../controllers/category.controller");

const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");

router.post("/", auth, admin, createCategory);
router.get("/", auth, admin, getCategories);
router.delete("/:id", auth, admin, deleteCategory);

module.exports = router;
