
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/google", userController.googleLogin);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.get("/address", authMiddleware, userController.getAddress);
router.post("/address/create", authMiddleware, userController.createAddress);
router.put("/address/:addressId", authMiddleware, userController.updateAddress);
router.delete("/address/:addressId", authMiddleware, userController.deleteAddress);
module.exports = router;