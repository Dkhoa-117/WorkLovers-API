const Notification = require("../models/Notification");
const firebase = require("firebase-admin");
const configJsonFirebase = require("../config/keys/workmanager-4955d-firebase-adminsdk-td42m-3d113eb1a0.json");

exports.getAllNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find().sort({ create_at: -1 });
		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
		console.log(error);
	}
};

exports.deleteNotification = async (req, res) => {
	try {
		const notification = await Notification.findById(req.params.id);
		if (!notification) {
			res.status(404);
			throw new Error("Notification not found");
		}
		await notification.remove();
		res.status(204);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.createNotification = async (req, res) => {
	try {
		const notification = new Notification({
			content: req.body.content,
			priority: req.body.priority,
		});
		const newNotification = await notification.save();
		res.status(201).json(newNotification);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.getNotification = async (req, res) => {
	try {
		const notification = await Notification.findByIdAndUpdate(req.params.id, {
			$inc: { view: 1 },
		});
		if (!notification) {
			res.status(404);
			throw new Error("Notification not found");
		}
		res.status(200).json(notification);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

var defaultAppConfig = {
	credential: firebase.credential.cert(configJsonFirebase),
};
// Initialize the default app
firebase.initializeApp(defaultAppConfig);

exports.sendNotification = (req, res) => {
	try {
		const data = req.body.notificationData;
		const time = req.body.time;
		let message = {
			android: {
				priority: "High",
				notification: {
					channel_id: "bang_luong",
				},
			},
			notification: {
				title: data.title,
				body: "bang luon thang ../2022",
			},
			data: {
				_id: data.content._id,
				create_at: new Date(data.content.create_at).toLocaleDateString(),
				dayoff_count: data.content.dayoff_count.toString(),
				detail: data.content.detail,
				role: data.content.role,
				staff_id: data.content.staff_id,
				wage: data.content.wage.toString(),
			},
			token: req.body.tokenDevice, // token của thiết bị muốn push notification
		};
		console.log(message);
		firebase
			.messaging()
			.send(message)
			.then((response) => {
				// Response is a message ID string.
				res.status(200).json({ message: "Successfully sent message!" });
				console.log("Successfully sent message:", response);
			})
			.catch((error) => {
				//return error
				res.status(500).json({ message: "Error sending message!" });
				console.log("Error sending message:", error);
			});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};
