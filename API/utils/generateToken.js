const jwt = require("jsonwebtoken");

module.exports = {
	generateToken: (id) => {
		return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
			expiresIn: "15m", // 15 minutes
			algorithm: "HS256",
		});
	},
	generateRefeshToken: (id) => {
		return jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
			expiresIn: "1d", // 1 day
			algorithm: "HS256",
		});
	},
};
