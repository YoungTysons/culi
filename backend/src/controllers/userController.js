const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_2026";

// 1. ĐĂNG KÝ
const register = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!fullName || !phoneNumber || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng điền đầy đủ họ tên, số điện thoại và mật khẩu" 
      });
    }

    // Kiểm tra SĐT hoặc Email đã tồn tại chưa
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: phoneNumber },
          ...(email ? [{ email: email }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.phoneNumber === phoneNumber 
          ? "Số điện thoại này đã được đăng ký" 
          : "Email này đã được đăng ký",
      });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới (khớp chuẩn Schema)
    const newUser = await prisma.user.create({
      data: {
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email || null,
        password: hashedPassword,
        role: "CUSTOMER", // Khớp enum: CUSTOMER | ADMIN | STAFF
      },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống",
      error: error.message,
    });
  }
};

// 2. ĐĂNG NHẬP (Hỗ trợ cả SĐT hoặc Email)
const login = async (req, res) => {
  try {
    const { account, email, password } = req.body;
    // Cho phép đăng nhập bằng 'account' (SĐT hoặc Email) hoặc trường 'email'
    const loginIdentifier = account || email;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng nhập tài khoản (SĐT/Email) và mật khẩu" 
      });
    }

    // Tìm user theo email hoặc số điện thoại
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginIdentifier },
          { phoneNumber: loginIdentifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    // So sánh mật khẩu băm
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    // Tạo JWT Token
    const payLoad = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payLoad, JWT_SECRET, { expiresIn: "7d" });

    // Trả về kết quả cho client
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống",
      error: error.message,
    });
  }
};

// 3. LẤY THÔNG TIN CÁ NHÂN (Dùng với authMiddleware)
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
