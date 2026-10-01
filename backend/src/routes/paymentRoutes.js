const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Tạo link QR
router.post("/create-payment-link", paymentController.createPaymentLink);

// Webhook từ PayOS
router.post("/payos-webhook", paymentController.handleWebhook);

// Check trạng thái
router.get("/order-status/:orderCode", paymentController.checkOrderStatus);

module.exports = router;