const express = require("express");
const router = express.Router();
const orgController = require("../controllers/OrgController");

router.post("/", orgController.createOrganization);
router.get("/", orgController.getAllOrganizations);
router.get("/:id", orgController.getOrganizationById);

// Unimplemented:
router.get("/resolve/:slug", orgController.getOrgBySlug);

module.exports = router;