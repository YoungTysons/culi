const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập"
        });
    }
    const role = (req.user.role || "").toUpperCase();
    if (role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền admin"
        });
    }
    next();
};
module.exports = requireAdmin;