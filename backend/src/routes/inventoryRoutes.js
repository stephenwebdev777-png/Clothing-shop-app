
const express = require('express');
const { getInventory, updateStock, getLowStock } = require('../controllers/inventoryController');

const router = express.Router();

router.get('/', getInventory);
router.post('/update', updateStock);
router.get('/low-stock', getLowStock);

module.exports = router;
