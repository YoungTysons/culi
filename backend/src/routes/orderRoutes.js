const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, cancelOrder } = require("../controllers/orderController");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_2026";

// Middleware kiểm tra token nếu có, vẫn cho phép tiếp tục để controller xử lý
const flexibleAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.warn("Token verify failed in flexibleAuth:", err.message);
    }
  }
  next();
};

// Endpoint: POST /api/orders (tạo đơn)
router.post("/", createOrder);

// Endpoint: GET /api/orders/my-orders (lấy danh sách đơn hàng của người dùng)
router.get("/my-orders", flexibleAuth, getMyOrders);

// Endpoint: PUT /api/orders/:id/cancel (hủy đơn hàng)
router.put("/:id/cancel", flexibleAuth, cancelOrder);

module.exports = router;

