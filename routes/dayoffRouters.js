const express = require('express');
const router = express.Router();
const DayoffCtrl = require('../controllers/dayoffControllers');
const { protect,admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, DayoffCtrl.createDayoff)
    .get(protect, admin, DayoffCtrl.getUnapproved)

router.route('/:id')
    .get(protect, DayoffCtrl.getDayoff)
    .delete(protect, DayoffCtrl.deleteDayoff)
    .put(protect, DayoffCtrl.updateDayoff)

router.route('/:id/approve').put(protect, admin, DayoffCtrl.approveDayoff)

module.exports = router;