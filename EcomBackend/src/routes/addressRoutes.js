const express = require("express");
const router = express.Router();
const addressController = require("../controllers/AddressController");

// Temporary middleware to inject context for testing
const injectContext = (req, res, next) => {
    req.org_id = req.headers['x-org-id'] || req.body.org_id;
    // I have lost track of ts, man. The logic seems okay but the headers...
    req.user_id = req.headers['x-user-id'] || req.body.user_id;
    next();
};


// Scope - User and Org
router.get("/user/:user_id", injectContext, addressController.getUserAddresses);
router.post("/", injectContext, addressController.addAddress);
router.put("/set-default/:address_id", injectContext, addressController.setDefaultAddress);
router.delete("/:address_id", injectContext, addressController.deleteAddress);

module.exports = router;