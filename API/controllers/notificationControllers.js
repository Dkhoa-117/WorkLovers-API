const Notification = require("../models/Notification");
const firebase = require("firebase-admin");
const sanitize = require("mongo-sanitize");
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
		console.log({ title: req.body });
		//const {title, content, }
		const title = req.body.title;
		const content = req.body.content;
		const priority = req.body.priority;
		console.log({ title: title });

		const notification = await new Notification({
			title: title,
			content: content,
			priority: priority,
		});
		let message = {
			android: {
				priority: "High",
				notification: {
					channel_id: "thong_bao",
				},
			},
			notification: {
				title: title,
				body: content,
			},
			data: {
				title: title,
				body: content,
			},
			token: req.body.tokenDevice, // token của thiết bị muốn push notification
		};
		//console.log(message);
		firebase
			.messaging()
			.send(message)
			.then(async (response) => {
				// Response is a message ID string.
				const newNotification = await notification.save();
				res
					.status(201)
					.json({ newNotification, message: "Successfully sent message!" });
			})
			.catch((error) => {
				//return error
				throw new Error("Error sending message!");
			});
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

exports.sendNotification = (req, res) => {
	try {
		const data = req.body.notificationData;
		console.log(data);
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
				body: "bang luon thang 6/2022",
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
			})
			.catch((error) => {
				//return error
				res.status(500).json({ message: "Error sending message!" });
			});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};
