const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

const injectContext = (req, res, next) => {
    req.org_id = req.headers['x-org-id'] || req.body.org_id;
    req.user_id = req.headers['x-user-id'] || req.body.user_id;
    next();
};

// Tenant Scoped
router.post("/place", injectContext, orderController.placeOrder);
router.get("/my-history", injectContext, orderController.getUserOrdersByOrg);
router.get("/my-detailed-history", injectContext, orderController.getDetailedOrdersByUser);
router.get("/details/:order_id", injectContext, orderController.getDetailedOrderById);

// Admin Scoped
router.get("/org-all", injectContext, orderController.getAllOrdersByOrg);

// Global Scoped
router.get("/global-all", orderController.getAllOrders);

module.exports = router;