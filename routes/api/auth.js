const express = require("express");

const ctrl = require("../../controllers/auth");
const { authenticate, upload } = require("../../middleware");

const router = express.Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

router.get("/current", authenticate, ctrl.current);
router.post("/logout", authenticate, ctrl.logout);
router.patch("/subs", authenticate, ctrl.updateSubscription);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
