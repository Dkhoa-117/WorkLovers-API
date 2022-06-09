const admin = require("firebase-admin");
const {
	getAuth,
	sendEmailVerification,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} = require("firebase/auth");

const auth = getAuth();
auth.setPersistence();
module.exports = {
	register: async (req, res, next) => {
		try {
			createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
				.then(async (userCredential) => {
					if (userCredential) {
						await sendEmailVerification(auth.currentUser).then(() => {
							auth.signOut();
							next();
						});
					}
				})
				.catch((error) => {
					res.json({ error: error.code });
				});
		} catch (error) {
			res.json({ error: error.code });
		}
	},
	sign_in: async (req, res, next) => {
		try {
			await signInWithEmailAndPassword(auth, req.body.email, req.body.password)
				.then(({ user }) => {
					if (user.emailVerified) {
						next();
					} else {
						res.status("401").json({ message: "Please Check Your Email" });
					}
				})
				.catch((error) => {
					res.status(500).json({ message: error.code });
				});
		} catch (error) {
			res.json(error);
		}
	},
};
