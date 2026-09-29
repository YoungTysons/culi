const express = require('express')
const router = express.Router()
const multer = require('multer');
const uploadController = require('../controllers/uploadController')
const authMiddleware = require('../middlewares/authMiddleware');
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file định dạng hình ảnh!'), false);
        }
    }
});


router.post(
    '/change-avatar',
    authMiddleware,
    upload.single('avatar'),
    uploadController.changeAvatar
);


module.exports = router