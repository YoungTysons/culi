const prisma = require("../config/db");
const { PayOS } = require("@payos/node");

// Khởi tạo PayOS để sẵn sàng tạo link QR nếu khách chọn thanh toán online
const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

// API: Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      shippingAddress,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      note,
      items, // Mảng các món trong giỏ hàng
    } = req.body;

    // 1. Sinh mã đơn hàng (PayOS yêu cầu orderCode dạng số nguyên dương)
    const numericOrderCode = Number(String(Date.now()).slice(-6));
    const orderCodeString = `CF-${numericOrderCode}`;

    // Kiểm tra userId có tồn tại trong database không (nếu không hoặc là khách vãng lai thì để null)
    let validUserId = null;
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      if (userExists) {
        validUserId = userExists.id;
      }
    }

    // Lấy sản phẩm mặc định để làm fallback phòng khi id sản phẩm không hợp lệ
    const defaultProduct = await prisma.product.findFirst();
    const fallbackProductId = defaultProduct ? defaultProduct.id : 1;

    // 2. Lưu đơn hàng vào MySQL qua Prisma
    const newOrder = await prisma.order.create({
      data: {
        orderCode: orderCodeString,
        userId: validUserId,
        shippingAddress: shippingAddress || "Lấy tại quán",
        subtotal: Number(subtotal) || 0,
        shippingFee: Number(shippingFee) || 0,
        totalAmount: Number(totalAmount) || 0,
        paymentMethod: paymentMethod || "COD",
        status: "PENDING",
        isPaid: false,
        note: note || "",
        items: {
          create: (items || []).map((item) => ({
            productId: Number(item.productId) && Number(item.productId) > 0 ? Number(item.productId) : fallbackProductId,
            quantity: Number(item.quantity) || 1,
            sizeName: item.sizeName || "Size M",
            sizePrice: Number(item.sizePrice) || 0,
            sweetness: item.sweetness || "100%",
            ice: item.ice || "100%",
            unitPrice: Number(item.unitPrice) || 0,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 3. Xử lý trường hợp khách chọn thanh toán online PayOS / VietQR
    let payosData = null;
    if (paymentMethod === "vietqr" || paymentMethod === "PAYOS") {
      try {
        const paymentRes = await payOS.paymentRequests.create({
          orderCode: numericOrderCode,
          amount: Math.round(Number(totalAmount)),
          description: `Don hang ${numericOrderCode}`.slice(0, 25),
          returnUrl: "http://localhost:5173/#checkout",
          cancelUrl: "http://localhost:5173/#checkout",
        });

        payosData = {
          orderCode: numericOrderCode,
          checkoutUrl: paymentRes.checkoutUrl,
          qrCode: paymentRes.qrCode,
        };
      } catch (payosErr) {
        console.error("Lỗi tạo mã QR PayOS:", payosErr.message);
        // Đơn hàng vẫn được lưu ở Database, chỉ thông báo lỗi sinh QR nếu có
      }
    }

    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công!",
      order: newOrder,
      payos: payosData, // Chứa qrCode & checkoutUrl nếu chọn VietQR
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Không thể tạo đơn hàng",
    });
  }
};

// API: Lấy danh sách đơn hàng của người dùng hiện tại
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.query?.userId;
    if (!userId) {
      return res.status(200).json({
        success: true,
        orders: [],
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Không thể lấy danh sách đơn hàng",
    });
  }
};

// API: Hủy đơn hàng (nếu đang ở trạng thái PENDING hoặc PREPARING)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const existingOrder = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!existingOrder) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (userId && existingOrder.userId && existingOrder.userId !== Number(userId)) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền hủy đơn hàng này" });
    }

    if (existingOrder.status === "COMPLETED" || existingOrder.status === "DELIVERING") {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng đang trên đường giao hoặc đã hoàn tất, không thể hủy!",
      });
    }

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: "CANCELLED" },
    });

    return res.status(200).json({
      success: true,
      message: "Đã hủy đơn hàng thành công!",
      order: updated,
    });
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Không thể hủy đơn hàng",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  cancelOrder,
};

