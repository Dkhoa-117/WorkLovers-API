const express = require('express');
const router = express.Router();
const NotificationCtrl = require('../controllers/notificationControllers');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, NotificationCtrl.getAllNotifications)
    .post(protect, admin, NotificationCtrl.createNotification)

router.route('/:id')
    .get(protect, NotificationCtrl.getNotification)
    .delete(protect, admin, NotificationCtrl.deleteNotification)

module.exports = router;