const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");
const CtrlWraper = require("../../helpers/CtrlWraper");

router.get("/", CtrlWraper(ctrl.getList));
router.get("/:id", CtrlWraper(ctrl.getContactById));
router.post("/", CtrlWraper(ctrl.addContact));
router.put("/:id", CtrlWraper(ctrl.updateContact));
router.delete("/:id", CtrlWraper(ctrl.removeContact));

module.exports = router;
