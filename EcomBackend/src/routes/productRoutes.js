const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct); // Admin only later

module.exports = router;