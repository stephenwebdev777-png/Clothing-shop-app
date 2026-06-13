
const express = require('express');
const { getBills, getBillById, createBill } = require('../controllers/billingController');

const router = express.Router();

router.get('/', getBills);
router.get('/:id', getBillById);
router.post('/', createBill);

module.exports = router;
