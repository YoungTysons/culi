const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/',productController.getAllProduct)
// router.get('/', productController.getAll);
router.get('/:id', productController.getById);
// router.post("/",authMiddleware,)


module.exports = router;