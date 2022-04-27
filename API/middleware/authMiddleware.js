const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
	protect: async (req, res, next) => {
		let token;
		try {
			if (
				req.headers.authorization &&
				req.headers.authorization.startsWith("Bearer")
			) {
				token = req.headers.authorization.split(" ")[1];
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				req.user = await User.findById(decoded.id).select("-password");
				next();
			}

			if (!token) {
				res.status(401);
				throw new Error("Not authorized, no token");
			}
		} catch (error) {
			console.error(error);
			res.status(401).json({ error: "Not authorized, token failed" });
			//throw new Error('Not authorized, token failed');
		}
	},
	admin: function (req, res, next) {
		try {
			if (req.user && req.user.isBoss) {
				next();
			} else {
				res.status(401);
				throw new Error("Not authorized as an admin");
			}
		} catch (err) {
			console.error(err);
			res.status(401).json({ erorr: "Not authorized, token failed" });
		}
	},
};
