const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");
const CtrlWraper = require("../../helpers/CtrlWraper");

router
  .route("/")
  .get(CtrlWraper(ctrl.getList))
  .post(CtrlWraper(ctrl.addContact));
router
  .route("/:id")
  .get(CtrlWraper(ctrl.getContactById))
  .put(CtrlWraper(ctrl.updateContact))
  .delete(CtrlWraper(ctrl.removeContact));

router.route("/:id/favorite").patch(CtrlWraper(ctrl.updateFavorite));

module.exports = router;
