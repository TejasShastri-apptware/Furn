const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Temp middleware
const injectOrg = (req, res, next) => {
    req.org_id = req.headers['x-org-id'] || req.body.org_id;
    next();
};

router.post("/register", injectOrg, userController.createUser);
router.get("/org", injectOrg, userController.getAllUsersUnderOrg);
router.get("/org/:id", injectOrg, userController.getUserByIdUnderOrg);
router.put("/org/:id", injectOrg, userController.updateUser);
router.delete("/org/:id", injectOrg, userController.deleteUser);

// Global routes don't need the injection
router.get("/global", userController.getAllUsers);

module.exports = router;