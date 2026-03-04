const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

router.get("/:user_id", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update/:cart_item_id", cartController.updateCartQuantity);
router.delete("/remove/:cart_item_id", cartController.removeFromCart);

module.exports = router;