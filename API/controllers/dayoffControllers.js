const Dayoff = require("../models/Dayoff");

exports.createDayoff = async (req, res) => {
	try {
		const dayoff = await Dayoff({
			staff_id: req.user._id,
			reason: req.body.reason,
			period: req.body.period,
		});
		const newDayoff = await dayoff.save();
		res.status(201).json(newDayoff);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.deleteDayoff = async (req, res) => {
	try {
		const dayoff = await Dayoff.findById(req.params.id);
		if (!dayoff) {
			res.status(404);
			throw new Error("Dayoff not found");
		}
		if (req.user._id.toString() != dayoff.staff_id.toString()) {
			res.status(401);
			throw new Error("Not authorization to access");
		} else {
			await dayoff.remove();
			res.status(204);
		}
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.updateDayoff = async (req, res) => {
	try {
		const dayoff = await Dayoff.findById(req.params.id);
		if (!dayoff) {
			res.status(404);
			throw new Error("Dayoff not found");
		}
		if (req.user._id.toString() != dayoff.staff_id.toString()) {
			res.status(401);
			throw new Error("Not authorization to access");
		} else {
			dayoff.reason = req.body.reason;
			dayoff.period = req.body.period;
			const updatedDayoff = await dayoff.save();
			res.status(200).json(updatedDayoff);
		}
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.approveDayoff = async (req, res) => {
	try {
		const dayoff = await Dayoff.findById(req.params.id);
		if (!dayoff) {
			res.status(404);
			throw new Error("Dayoff not found");
		}
		dayoff.isApproved = true;
		const approvedDayoff = await dayoff.save();
		res.status(200).json(approvedDayoff);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.getDayoff = async (req, res) => {
	try {
		const dayoff = await Dayoff.findById(req.params.id).populate(
			"staff_id",
			"fullname avatar email phoneNumber"
		);
		if (!dayoff) {
			res.status(404);
			throw new Error("Dayoff not found");
		}
		res.status(200).json(dayoff);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.getUnapproved = async (req, res) => {
	try {
		const dayoffs = await Dayoff.find({
			isApproved: false,
		})
			.sort({ create_at: -1 })
			.populate("staff_id", "fullname avatar email phoneNumber maxDateOff");
		if (!dayoffs) {
			res.status(404);
			throw new Error("Dayoff not found");
		}
		res.status(200).json(dayoffs);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};
