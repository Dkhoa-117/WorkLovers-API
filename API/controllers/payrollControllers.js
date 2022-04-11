const Payroll = require('../models/Payroll');

exports.createPayroll = async(req, res) => {
    try {
        const payroll = new Payroll({
            staff_id: req.body.staff_id,
            wage: req.body.wage,
            role: req.body.role,
            dateoff_count: req.body.dayoff_count,
            detail: req.body.detail
        });
        const newPayroll = await payroll.save();
        res.status(201).json(newPayroll);
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
        console.log(error);
    }
};

exports.getPayroll = async(req, res) => {
    try {
        const payroll = await Payroll.findById(
            req.params.id
        ).populate('staff_id', 'fullname avatar email phoneNumber');
        if(!payroll){
            res.status(404);
            throw new Error('Payroll not found');
        }
        res.json(payroll);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.getMyPayrolls = async(req, res) => {
    try {
        const payrolls = await Payroll.find({staff_id: req.user._id});
        if(!payrolls){
            res.status(404);
            throw new Error('No Payroll found');
        }
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.getAllPayroll = async(req, res) =>{
    try {
        const payrolls = await Payroll.find()
        .sort({create_at: -1})
        .populate('staff_id', 'fullname avatar email phoneNumber');
        if(payrolls){
            res.status(200).json(payrolls);
        }else{
            res.status(404).json("No Payroll found");
        }
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.getPayrollsByRole = async(req, res) => {
    try {
        const payrolls = await Payroll.find({
            role: req.params.roleId
        }).sort({create_at: -1}).populate('staff_id', 'fullname avatar email phoneNumber');
        if(!payrolls){
            res.status(404);
            throw new Error('No Payroll found');
        }
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
};