const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

router.post("/place", orderController.placeOrder);
router.get("/history/:user_id", orderController.getUserOrders);
router.get("/all", orderController.getAllOrders);
router.get("/user/:user_id", orderController.getDetailedOrdersByUser);

module.exports = router;