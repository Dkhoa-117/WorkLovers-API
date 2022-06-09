const User = require("../models/User");
const Role = require("../models/Role");
const Dayoff = require("../models/Dayoff");
const Payroll = require("../models/Payroll");

exports.createPayroll = async (req, res) => {
	try {
		const payroll = new Payroll({
			staff_id: req.body.staff_id,
			wage: req.body.wage,
			role: req.body.role,
			dateoff_count: req.body.dayoff_count,
			detail: req.body.detail,
		});
		const newPayroll = await payroll.save();
		res.status(201).json(newPayroll);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
		console.log(error);
	}
};

exports.createPayrolls = async (req, res) => {
	try {
		//chua tinh tru ngay nghi
		const { staff_id, time } = req.body;
		console.log(req.body);
		const basic_salary = 200;
		let result = new Array();
		for (let i = 0; i < staff_id.length; i++) {
			const user = await User.findById(staff_id[i]);
			const role = await Role.findOne({ roleName: user.role });

			let date1 = new Date(time.to);
			let date2 = new Date(time.from);
			const dayoffs = await Dayoff.find({
				"period.to": {
					$lte: date1,
					$gte: date2,
				},
				"period.from": {
					$lte: date1,
					$gte: date2,
				},
				staff_id: staff_id[i],
			});
			let num_days =
				(date1.getTime() - date2.getTime()) / (1000 * 24 * 3600) + 1;
			let num_dayoffs = 0;
			let wage = 1;
			let detail = "";
			for (let j = 0; j < dayoffs.length; j++) {
				date1 = new Date(dayoffs[j].period.from);
				date2 = new Date(dayoffs[j].period.to);
				detail = detail.concat(
					"- nghi ngay: " +
						date1.toLocaleDateString() +
						" den " +
						date2.toLocaleDateString() +
						". \n"
				);
				let temp = (date2.getTime() - date1.getTime()) / (1000 * 24 * 3600) + 1;
				num_dayoffs = num_dayoffs + temp;
			}
			if (num_dayoffs === 0) {
				detail = "- Di lam day du. Rat tot!";
			}
			wage = basic_salary * role.corfficient * (num_days - num_dayoffs);
			const payroll = new Payroll({
				staff_id: staff_id[i],
				wage: wage,
				role: role._id,
				dayoff_count: num_dayoffs,
				detail: detail,
			});

			if (payroll) {
				result.push(payroll);
			} else {
				throw new Error("something went wrong");
			}
		}
		Payroll.insertMany(result);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
		console.log(error);
	}
};

exports.getPayroll = async (req, res) => {
	try {
		const payroll = await Payroll.findById(req.params.id).populate(
			"staff_id",
			"fullname avatar email phoneNumber"
		);
		if (!payroll) {
			res.status(404);
			throw new Error("Payroll not found");
		}
		res.json(payroll);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.getMyPayrolls = async (req, res) => {
	try {
		const payrolls = await Payroll.find({ staff_id: req.user._id });
		if (!payrolls) {
			res.status(404);
			throw new Error("No Payroll found");
		}
		res.status(200).json(payrolls);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.getAllPayroll = async (req, res) => {
	try {
		const payrolls = await Payroll.find()
			.sort({ create_at: -1 })
			.populate("staff_id", "fullname avatar email phoneNumber");
		if (payrolls) {
			res.status(200).json(payrolls);
		} else {
			res.status(404).json("No Payroll found");
		}
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.getPayrollsByRole = async (req, res) => {
	try {
		const payrolls = await Payroll.find({
			role: req.params.roleId,
		})
			.sort({ create_at: -1 })
			.populate("staff_id", "fullname avatar email phoneNumber");
		if (!payrolls) {
			res.status(404);
			throw new Error("No Payroll found");
		}
		res.status(200).json(payrolls);
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
};
