const router = require('express').Router();
const { demoPayment } = require('../controllers/payment.controller');

router.post('/demo', demoPayment);

module.exports = router;

