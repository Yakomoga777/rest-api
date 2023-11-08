const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");
const CtrlWraper = require("../../helpers/CtrlWraper");
const { authenticate } = require("../../middleware");

router
  .route("/")
  .get(authenticate, CtrlWraper(ctrl.getList))
  .post(authenticate, CtrlWraper(ctrl.addContact));
router
  .route("/:id")
  .get(authenticate, CtrlWraper(ctrl.getContactById))
  .put(authenticate, CtrlWraper(ctrl.updateContact))
  .delete(authenticate, CtrlWraper(ctrl.removeContact));

router
  .route("/:id/favorite")
  .patch(authenticate, CtrlWraper(ctrl.updateFavorite));

// router.route("?favorite=true");

module.exports = router;
