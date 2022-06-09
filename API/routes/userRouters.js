const express = require("express");
const router = express.Router();
const UserCtrl = require("../controllers/userControllers");
const { register, sign_in } = require("../middleware/firebaseMidleware");
const { protect, admin } = require("../middleware/authMiddleware");

router
	.route("/")
	.post(register, UserCtrl.register)
	.get(protect, admin, UserCtrl.getAllUsers);

router.route("/login").post(sign_in, UserCtrl.login);

router
	.route("/profile")
	.get(protect, UserCtrl.getProfile)
	.put(protect, UserCtrl.updateProfile);

router
	.route("/:id")
	.get(UserCtrl.getUserById)
	.delete(protect, admin, UserCtrl.deleteUser);

router.route("/refreshtoken").post(UserCtrl.refreshToken);

module.exports = router;
