const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

// Temp middleware
const injectOrg = (req, res, next) => {
    req.org_id = req.headers['x-org-id'] || req.body.org_id || req.query.org_id;
    next();
};

// Public Browsing - Org Scoped
router.get("/", injectOrg, productController.getAllProductsUnderOrg);
router.get("/search", injectOrg, productController.searchProduct);
router.get("/tags", injectOrg, productController.getProductByTags);
router.get("/:id", injectOrg, productController.getProductByIdUnderOrd);

// Management - Org Scoped
router.post("/", injectOrg, productController.createProductWithTags);
router.put("/:id", injectOrg, productController.updateProduct);
router.put("/updateStock/:id", injectOrg, productController.updateStock);
router.delete("/delete/:id", injectOrg, productController.deleteProduct);

// Global
router.get("/global/all", productController.getAllProductsGlobal);
//! Will add global searches and stuff as well

module.exports = router;