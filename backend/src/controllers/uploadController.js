const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const prisma = require('../config/db');

cloudinary.config({
    cloud_name: 'kicwczh4',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const changeAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Chưa có file nào được tải lên!'
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'avatars',
            transformation: [
                {
                    width: 250,
                    height: 250,
                    crop: 'fill',
                    gravity: 'face'
                }
            ]
        });

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        const avatarUrl = result.secure_url;

        const userId = req.user.id;
        await prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl }
        });


        res.json({
            success: true,
            message: 'Cập nhật avatar thành công!',
            avatarUrl: avatarUrl
        });

    } catch (error) {
        console.error(error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: 'Upload thất bại!'
        });
    }
};

module.exports = {
    changeAvatar
};