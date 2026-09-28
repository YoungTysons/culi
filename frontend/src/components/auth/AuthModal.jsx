import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AuthModal.css";
import logoImg from "./logo.png";

export default function AuthModal({ isOpen = true, onClose, isFullPage = false }) {
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Loading state
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({
    account: "",
    password: "",
    rememberMe: true,
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
    receivePromo: true,
  });

  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text: '' }

  if (!isOpen && !isFullPage) return null;

  // Xử lý Đăng Nhập
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!loginData.account.trim() || !loginData.password) {
      setMessage({ type: "error", text: "Vui lòng nhập tài khoản (SĐT/Email) và mật khẩu" });
      return;
    }

    setSubmitting(true);
    const res = await login(loginData.account.trim(), loginData.password);
    setSubmitting(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Đăng nhập thành công!" });
      if (onClose) {
        setTimeout(onClose, 600);
      }
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  // Xử lý Đăng Ký
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!registerData.fullName.trim() || !registerData.phoneNumber.trim() || !registerData.password) {
      setMessage({ type: "error", text: "Vui lòng điền họ tên, số điện thoại và mật khẩu" });
      return;
    }

    if (registerData.password.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu phải có ít nhất 6 ký tự" });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }

    if (!registerData.agreeTerms) {
      setMessage({ type: "error", text: "Vui lòng đồng ý với Điều khoản dịch vụ" });
      return;
    }

    setSubmitting(true);
    const res = await register({
      fullName: registerData.fullName.trim(),
      phoneNumber: registerData.phoneNumber.trim(),
      email: registerData.email.trim() || null,
      password: registerData.password,
    });
    setSubmitting(false);

    if (res.success) {
      setMessage({
        type: "success",
        text: "Đăng ký thành công! Hãy đăng nhập bằng tài khoản mới tạo.",
      });
      // Điền sẵn số điện thoại vừa đăng ký sang form login
      setLoginData((prev) => ({
        ...prev,
        account: registerData.phoneNumber.trim(),
        password: "",
      }));
      setTimeout(() => {
        setActiveTab("login");
      }, 1400);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const cardContent = (
    <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
      {/* Nút đóng modal (chỉ hiện khi mở dạng popup modal, ẩn khi là trang đăng nhập chính) */}
      {!isFullPage && onClose && (
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
          type="button"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}

      {/* LEFT PANEL: Visual Storytelling & Club Privileges */}
      <div className="auth-left-panel">
        <div className="auth-left-glow-1" />
        <div className="auth-left-glow-2" />

        {/* Top Brand Presentation */}
        <div>
          <div className="auth-brand-badge">
            <div className="auth-brand-logo-box">
              <img
                src={logoImg}
                alt="Velvet & Brew Logo"
              />
            </div>
            <div className="auth-brand-titles">
              <span className="auth-brand-title">Velvet &amp; Brew</span>
              <span className="auth-brand-sub">Artisanal Coffee &amp; Tea Guild</span>
            </div>
          </div>

          <div className="auth-hero-headline">
            <h1>
              Thưởng thức từng giọt <span>tinh hoa</span> cà phê &amp; trà ủ lạnh.
            </h1>
            <p>
              Hương vị nguyên bản từ những đồn điền cao nguyên chọn lọc, hòa quyện với phong cách pha chế thủ công đương đại.
            </p>
          </div>
        </div>

        {/* Member Privileges Card */}
        <div className="auth-privileges-box">
          <div className="auth-privileges-header">
            <span className="material-symbols-outlined">verified</span>
            <span>Đặc Quyền Hội Viên Velvet Club</span>
          </div>
          <div className="auth-privileges-list">
            <div className="auth-privilege-item">
              <div className="auth-privilege-icon">
                <span className="material-symbols-outlined">stars</span>
              </div>
              <div className="auth-privilege-text">
                <strong>Tích điểm đổi thức uống</strong>
                <small>1.000đ = 1 Hạt Brew tích lũy</small>
              </div>
            </div>
            <div className="auth-privilege-item">
              <div className="auth-privilege-icon">
                <span className="material-symbols-outlined">redeem</span>
              </div>
              <div className="auth-privilege-text">
                <strong>Voucher giảm 20% mỗi tháng</strong>
                <small>Dành riêng các dòng Cold Brew thượng hạng</small>
              </div>
            </div>
            <div className="auth-privilege-item">
              <div className="auth-privilege-icon">
                <span className="material-symbols-outlined">cake</span>
              </div>
              <div className="auth-privilege-text">
                <strong>Quà sinh nhật bất ngờ</strong>
                <small>Tặng 01 ly nước miễn phí tùy chọn cỡ lớn</small>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="auth-testimonial-box">
          <div className="auth-testimonial-avatar">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8wGON1JQ0k_DfiXimIyGgkIp2nk5O6V_m-gXqcBzkzRZShKU-kYQ3XcbcMdnqunljb3gV3bzeELQ_Nv75z4LyWtzjzWpjmBb2jYKaSYMl9ZP7LhG9om7o7CCoJyV_fn3bAoCIIFYdPAiNoMvKXU4Cm4kB7FcwL3V6ELyE4T5RPop4vl2y5wSA2iwvcVTztK6A3em8Se04dKEAdC0o2QMnKm8RZaGHrjR9Ez9lk0f9bSgtPKuYPeHkig"
              alt="Minh Châu portrait"
            />
          </div>
          <div className="auth-testimonial-text">
            <p>
              &ldquo;Trà ô long sữa nướng ở đây có vị ngậy êm dịu, không gian luôn cho cảm giác thư thái tuyệt đối.&rdquo;
            </p>
            <span>Minh Châu — VIP Member Gold</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Card with Dual Tabs */}
      <div className="auth-right-panel">
        {/* Tab Controller Buttons */}
        <div className="auth-tab-pill">
          <button
            className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setMessage(null);
            }}
            type="button"
          >
            <span className="material-symbols-outlined">login</span>
            <span>Đăng Nhập</span>
          </button>
          <button
            className={`auth-tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("register");
              setMessage(null);
            }}
            type="button"
          >
            <span className="material-symbols-outlined">person_add</span>
            <span>Đăng Ký</span>
          </button>
        </div>

        {/* Alert Message */}
        {message && (
          <div className={`auth-msg ${message.type}`}>
            <span className="material-symbols-outlined">
              {message.type === "error" ? "error" : "check_circle"}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === "login" && (
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Chào mừng bạn trở lại!</h2>
              <p className="auth-form-subtitle">
                Đăng nhập để vào cửa hàng và nhận ưu đãi hội viên độc quyền.
              </p>
            </div>

            {/* Social Login Stack */}
            <div className="auth-social-row">
              <button className="auth-social-btn" type="button">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button className="auth-social-btn" type="button">
                <svg viewBox="0 0 170 170" width="16" height="16" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.73-7.9-12.08-14.48-6.19-9.35-11.05-19.9-14.59-31.65-3.53-11.75-5.3-22.95-5.3-33.6 0-14.04 3.63-25.79 10.88-35.25 7.26-9.46 16.5-14.24 27.73-14.36 5.2 0 10.65 1.34 16.36 4.02 5.71 2.68 9.5 4.09 11.37 4.22 1.45-.2 5.48-1.74 12.08-4.63 6.6-2.88 12.35-4.14 17.25-3.77 13.06.87 23.47 5.63 31.22 14.28-11.45 6.94-17.06 16.63-16.83 29.08.26 9.69 4.04 17.75 11.36 24.18 7.32 6.43 15.86 10.15 25.62 11.16-2.18 6.78-4.8 13.43-7.86 19.95zM119.22 33.15c0-7.38 2.64-14.15 7.92-20.31 5.29-6.16 11.79-10.08 19.51-11.76.32 1.02.48 2.05.48 3.09 0 7.4-2.73 14.27-8.19 20.61-5.46 6.34-12.02 10.14-19.68 11.4-.21-1-.31-2-.31-3.03z"/>
                </svg>
                <span>Apple ID</span>
              </button>
            </div>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">hoặc tài khoản</span>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="auth-fields-stack">
                <div className="auth-field-group">
                  <label className="auth-field-label">Email hoặc Số điện thoại</label>
                  <div className="auth-input-wrapper">
                    <span className="material-symbols-outlined input-icon">
                      alternate_email
                    </span>
                    <input
                      className="auth-input"
                      type="text"
                      placeholder="090xxxxxxx hoặc email@domain.com"
                      value={loginData.account}
                      onChange={(e) =>
                        setLoginData({ ...loginData, account: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <div className="auth-field-label">
                    <span>Mật khẩu</span>
                    <a href="#forgot" className="auth-forgot-link">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="auth-input-wrapper">
                    <span className="material-symbols-outlined input-icon">lock</span>
                    <input
                      className="auth-input"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="auth-pwd-toggle"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showLoginPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) =>
                      setLoginData({ ...loginData, rememberMe: e.target.checked })
                    }
                  />
                  <span className="auth-checkbox-text">
                    Ghi nhớ đăng nhập trên thiết bị này
                  </span>
                </label>

                <button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={submitting}
                  style={{ opacity: submitting ? 0.7 : 1 }}
                >
                  <span>{submitting ? "Đang xử lý..." : "Đăng Nhập Vào Cửa Hàng"}</span>
                  <span className="material-symbols-outlined">east</span>
                </button>
              </div>
            </form>

            <p className="auth-switch-text">
              Chưa có tài khoản Velvet Club?
              <button
                className="auth-switch-btn"
                onClick={() => {
                  setActiveTab("register");
                  setMessage(null);
                }}
                type="button"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        )}

        {/* TAB 2: REGISTER */}
        {activeTab === "register" && (
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <div className="auth-form-badge">
                <span className="material-symbols-outlined">celebration</span>
                <span>Tặng ngay Voucher 50.000đ cho đơn đầu tiên</span>
              </div>
              <h2 className="auth-form-title">Tạo Tài Khoản Velvet Club</h2>
              <p className="auth-form-subtitle">
                Gia nhập cộng đồng người sành cà phê &amp; trà thủ công.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div className="auth-fields-stack">
                <div className="auth-field-group">
                  <label className="auth-field-label">Họ và tên của bạn</label>
                  <div className="auth-input-wrapper">
                    <span className="material-symbols-outlined input-icon">person</span>
                    <input
                      className="auth-input"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={registerData.fullName}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="auth-grid-2">
                  <div className="auth-field-group">
                    <label className="auth-field-label">Số điện thoại *</label>
                    <div className="auth-input-wrapper">
                      <span className="material-symbols-outlined input-icon">call</span>
                      <input
                        className="auth-input"
                        type="tel"
                        placeholder="0912 345 678"
                        value={registerData.phoneNumber}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phoneNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="auth-field-group">
                    <label className="auth-field-label">Địa chỉ Email</label>
                    <div className="auth-input-wrapper">
                      <span className="material-symbols-outlined input-icon">mail</span>
                      <input
                        className="auth-input"
                        type="email"
                        placeholder="ban@gmail.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-grid-2">
                  <div className="auth-field-group">
                    <label className="auth-field-label">Mật khẩu *</label>
                    <div className="auth-input-wrapper">
                      <span className="material-symbols-outlined input-icon">key</span>
                      <input
                        className="auth-input"
                        type={showRegPassword ? "text" : "password"}
                        placeholder="Tối thiểu 6 ký tự"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="auth-pwd-toggle"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showRegPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="auth-field-group">
                    <label className="auth-field-label">Xác nhận mật khẩu *</label>
                    <div className="auth-input-wrapper">
                      <span className="material-symbols-outlined input-icon">
                        lock_reset
                      </span>
                      <input
                        className="auth-input"
                        type={showRegConfirm ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="auth-pwd-toggle"
                        onClick={() => setShowRegConfirm(!showRegConfirm)}
                      >
                        <span className="material-symbols-outlined">
                          {showRegConfirm ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    checked={registerData.agreeTerms}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        agreeTerms: e.target.checked,
                      })
                    }
                  />
                  <span className="auth-checkbox-text">
                    Tôi đồng ý với{" "}
                    <a href="#terms">Điều khoản dịch vụ</a> &amp;{" "}
                    <a href="#privacy">Chính sách bảo mật</a> của Velvet &amp; Brew.
                  </span>
                </label>

                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    checked={registerData.receivePromo}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        receivePromo: e.target.checked,
                      })
                    }
                  />
                  <span className="auth-checkbox-text">
                    Nhận thông báo ưu đãi độc quyền hội viên và quà tặng qua Email/Zalo.
                  </span>
                </label>

                <button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={submitting}
                  style={{ opacity: submitting ? 0.7 : 1 }}
                >
                  <span>{submitting ? "Đang xử lý..." : "Tạo Tài Khoản Velvet Club"}</span>
                  <span className="material-symbols-outlined">loyalty</span>
                </button>
              </div>
            </form>

            <p className="auth-switch-text">
              Đã có tài khoản?
              <button
                className="auth-switch-btn"
                onClick={() => {
                  setActiveTab("login");
                  setMessage(null);
                }}
                type="button"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        )}

        {/* Bottom Trust Indicators */}
        <div className="auth-trust-row">
          <div className="auth-trust-item secure">
            <span className="material-symbols-outlined">verified_user</span>
            <span>Dữ liệu bảo mật 256-bit SSL</span>
          </div>
          <div className="auth-trust-item delivery">
            <span className="material-symbols-outlined">local_shipping</span>
            <span>Giao hỏa tốc 30 phút</span>
          </div>
          <div className="auth-trust-item hotline">
            <span className="material-symbols-outlined">support_agent</span>
            <span>Hotline: 1900 8822</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Nếu là chế độ Full Page (Màn hình đăng nhập bắt buộc khi chưa vào web)
  if (isFullPage) {
    return (
      <div className="auth-page-wrapper">
        <header className="auth-page-header">
          <div className="auth-page-brand">Velvet &amp; Brew</div>
          <div className="auth-page-badge">
            <span className="material-symbols-outlined">verified_user</span>
            <span>Cổng Khách Hàng &amp; Hội Viên</span>
          </div>
        </header>

        <main className="auth-page-main">
          {cardContent}
        </main>

        <footer className="auth-page-footer">
          <div className="auth-page-footer-inner">
            <span>© 2026 Velvet &amp; Brew Coffee &amp; Tea Co. Toàn bộ quyền được bảo lưu.</span>
            <div className="auth-page-footer-links">
              <a href="#terms">Điều khoản dịch vụ</a>
              <a href="#privacy">Bảo mật thông tin</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Nếu là chế độ Popup Modal
  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      {cardContent}
    </div>
  );
}
