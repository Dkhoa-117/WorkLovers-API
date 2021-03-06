const express = require("express");
const router = express.Router();
const PayrollCtrl = require("../controllers/payrollControllers");
const { protect, admin } = require("../middleware/authMiddleware");

router
	.route("/")
	.post(protect, admin, PayrollCtrl.createPayroll)
	.get(protect, admin, PayrollCtrl.getAllPayroll);

router.route("/create").post(protect, admin, PayrollCtrl.createPayrolls);

router.route("/mypayroll").get(protect, PayrollCtrl.getMyPayrolls);

router.route("/:id").get(protect, PayrollCtrl.getPayroll);

router
	.route("/:roleId/payrolls")
	.get(protect, admin, PayrollCtrl.getPayrollsByRole);

module.exports = router;
