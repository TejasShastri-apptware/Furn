const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

const injectContext = (req, res, next) => {
    // Priority: Header > Body
    req.org_id = req.headers['x-org-id'] || req.body.org_id;
    req.user_id = req.headers['x-user-id'] || req.body.user_id;
    next();
};

// Scope - organization and user
router.get("/", injectContext, cartController.getCart);
router.post("/add", injectContext, cartController.addToCart);
router.put("/update/:cart_item_id", injectContext, cartController.updateCartQuantity);
router.delete("/remove/:cart_item_id", injectContext, cartController.removeFromCart);

module.exports = router;