const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

const injectOrg = (req, res, next) => {
    req.org_id = req.headers['x-org-id'] || req.body.org_id;
    next();
};

// Scoped Tenant
router.post("/", injectOrg, CategoryController.createCat);
router.get("/", injectOrg, CategoryController.getAllCategories);
router.get("/:id", injectOrg, CategoryController.getCategoryById);
router.put("/:id", injectOrg, CategoryController.updateCategory);
router.delete("/:id", injectOrg, CategoryController.deleteCategory);

module.exports = router;