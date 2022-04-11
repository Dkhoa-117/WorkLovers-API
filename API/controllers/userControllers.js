const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async(req, res) =>{
    try {
        const {
            username, 
            password,
            email,
            address,
            cccd,
            fullname,
            phoneNumber,
            role,
            dob,
            gender
        } = req.body;
        const userCheck = await User.findOne({email});

        if(userCheck){
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            username,
            password,
            email,
            address,
            cccd,
            fullname,
            phoneNumber,
            role,
            dob,
            gender,
            isBoss: true
        });

        if(user){
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                address: user.address,
                cccd: user.cccd,
                fullname: user.fullname,
                phoneNumber: user.phoneNumber,
                role: user.role,
                maxDayoff: user.maxDayoff,
                dob: user.dob,
                gender: user.gender,
                isBoss: user.isBoss,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        }else{
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.login = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(user && (await user.matchPassword(password))){
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                address: user.address,
                cccd: user.cccd,
                fullname: user.fullname,
                phoneNumber: user.phoneNumber,
                role: user.role,
                maxDayoff: user.maxDayoff,
                dob: user.dob,
                gender: user.gender,
                isBoss: user.isBoss,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        }else{
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if(user){
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                address: user.address,
                cccd: user.cccd,
                fullname: user.fullname,
                phoneNumber: user.phoneNumber,
                role: user.role,
                maxDayoff: user.maxDayoff,
                dob: user.dob,
                gender: user.gender,
                isBoss: user.isBoss,
                avatar: user.avatar
            });
        }else{
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.updateProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(user){
            user.username = req.body.username || user.username;
            user.address = req.body.address || user.address;
            user.cccd = req.body.cccd || user.cccd;
            user.fullname = req.body.fullname || user.fullname;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
            user.role = req.body.role || user.role;
            user.dob = req.body.dob || user.dob,
            user.gender = req.body.gender || user.gender;

            if(req.body.password){
                user.password = req.body.password;
            }

            const updateUser = await user.save();
            res.json({
                _id: updateUser._id,
                username: updateUser.username,
                email: updateUser.email,
                address: updateUser.address,
                cccd: updateUser.cccd,
                fullname: updateUser.fullname,
                phoneNumber: updateUser.phoneNumber,
                role: updateUser.role,
                maxDayoff: updateUser.maxDayoff,
                dob: updateUser.dob,
                gender: updateUser.gender,
                isBoss: updateUser.isBoss,
                avatar: updateUser.avatar
            })
        }else{
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.remove();
            res.status(204);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

//lay user co kem theo password
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};