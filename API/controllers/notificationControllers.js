const Notification = require('../models/Notification');

exports.getAllNotifications = async(req,res) =>{
    try{
        const notifications = await Notification.find().sort({create_at: -1});
        res.status(200).json(notifications);
    }catch(error){
        res.status(500).json({error: "Something went wrong"});
        console.log(error);
    }
};

exports.deleteNotification = async(req,res)=>{
    try{
        const notification = await Notification.findById(req.params.id);
        if(!notification){
            res.status(404);
            throw new Error("Notification not found");
        }
        await notification.remove();
        res.status(204);
    }catch(error){
        res.status(500).json({error: "Something went wrong"});
    }
}

exports.createNotification = async(req, res)=>{
    try{
        const notification = new Notification({
            content: req.body.content,
            priority: req.body.priority
        });
        const newNotification = await notification.save();
        res.status(201).json(newNotification);
    }catch(error){
        res.status(500).json({error: "Something went wrong"});
    }
};

exports.getNotification = async(req,res)=>{
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { $inc: { view: 1 } }
        );
        if(!notification){
            res.status(404);
            throw new Error("Notification not found");
        }
        res.status(200).json(notification);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Something went wrong"});
    }
};