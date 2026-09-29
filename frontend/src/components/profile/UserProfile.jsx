import { useState, useRef, useEffect } from "react";
import logoIcon from "../../assets/logo-icon.png";
import { useAuth } from "../../context/AuthContext";

export default function UserProfile({
  user: propUser,
  onBackToStore,
  onOpenCart,
  onOpenAuth,
  onOpenAdmin,
  cartCount = 0,
}) {
  const { user: authUser, loading, logout, updateUser } = useAuth();
  const user = propUser !== undefined ? propUser : authUser;
  const isAdmin = !!(user && (user.role || "").toUpperCase() === "ADMIN");

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);


      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "addresses" | "orders" | "vouchers" | "cards" | "security" | "notifications"

  // Form states - Basic Info
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [nickname, setNickname] = useState(
    user?.nickname || user?.fullName ? user.fullName.split(" ").slice(-1)[0] : ""
  );
  const [gender, setGender] = useState(user?.gender || "male");
  const [avatar, setAvatar] = useState(
    user?.avatar ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCyFwqFEv3j-svlANanu4HpwcENRviOlSiDYLYuPtyGA7IOJ_SV2MBnCcGqlF7HLqFJqD7ebQXFVpRMn-G4RZaKnGdAMy9Ji8r0diYqqroq-QuU-xpHPjlI8bbVFG1UG9rhx8l-gMcumLQCgEfF9poZv14ZaZ5K1j-WzgG6WGGsTCWwVedS9BIBhTfHCycn6G30X0AtEmNbXUgLpabtcQ-QnV4sxB9Ycpw6etYUQe00P89EvFgaoti1aQ"
  );

  // Contact States
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [googleConnected, setGoogleConnected] = useState(true);
  const [appleConnected, setAppleConnected] = useState(false);

  // States cho 2 khung Modal riêng biệt (Đổi SĐT & Đổi Email)
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhoneInput, setNewPhoneInput] = useState("");

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Address list
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Chung cư Artemis (Nhà riêng)",
      tag: "Địa chỉ mặc định",
      isDefault: true,
      address:
        "Tầng 5, Tòa Nhà Artemis Plaza, 03 Lê Trọng Tấn, P. Khương Mai, Q. Thanh Xuân, Hà Nội",
      recipient: user?.fullName || "Nguyễn Minh Trí",
      phone: user?.phoneNumber || "0903 888 234",
    },
    {
      id: 2,
      title: "Văn phòng Sáng tạo Velvet",
      tag: "Văn phòng làm việc",
      isDefault: false,
      address: "Phòng 402, 124 Phố Huế, P. Hàng Bài, Q. Hoàn Kiếm, Hà Nội",
      recipient:
        (user?.fullName ? user.fullName.split(" ").slice(-1)[0] : "Trí") +
        " (Lễ tân tầng 1)",
      phone: user?.phoneNumber || "0903 888 234",
    },
  ]);

  // Đồng bộ khi dữ liệu user từ backend tải xong
  useEffect(() => {
    if (user) {
      if (user.fullName) {
        setFullName(user.fullName);
        setNickname(user.fullName.split(" ").slice(-1)[0]);
      }
      if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
      if (user.email) setEmail(user.email);
      if (user.avatar) setAvatar(user.avatar);
      if (user.gender) setGender(user.gender)
      if (user.nickname) setNickname(user.nickname)
      if (user.address) {
        setAddresses(user.address.map(addr => {
          const fullAddress = [addr.street, addr.ward, addr.district, addr.city].filter(Boolean).join(', ');
          return {
            id: addr.id,
            title: addr.addressLabel || addr.type,
            tag: "",
            isDefault: addr.isDefault || false,
            address: fullAddress,
            recipient: addr.recipientName,
            phone: addr.recipientPhone,
          }
        }))
      }
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          recipient: addr.id === 1 ? user.fullName || addr.recipient : addr.recipient,
          phone: user.phoneNumber || addr.phone,
        }))
      );
    }
  }, [user]);

  // Saving states & toast
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Avatar upload simulation
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  // Set default address
  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
        tag: addr.id === id ? "Địa chỉ mặc định" : "Văn phòng làm việc",
      }))
    );
  };

  // Delete address
  const handleDeleteAddress = (id) => {
    if (addresses.length <= 1) {
      alert("Cần giữ lại ít nhất 1 địa chỉ để nhận hàng!");
      return;
    }
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  // Add new address prompt
  const handleAddNewAddress = () => {
    const newTitle = prompt("Nhập tên địa chỉ (vd: Nhà bà ngoại, Chi nhánh 2):");
    if (!newTitle) return;
    const newDetail = prompt("Nhập địa chỉ chi tiết:");
    if (!newDetail) return;

    const newAddr = {
      id: Date.now(),
      title: newTitle,
      tag: "Địa chỉ phụ",
      isDefault: false,
      address: newDetail,
      recipient: fullName,
      phone: phoneNumber,
    };
    setAddresses((prev) => [...prev, newAddr]);
  };

  // Save changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setIsSaving(false);
    if (updateUser) {
      try {
        const res = await updateUser({ avatar, fullName, nickname, phoneNumber, email, gender });
        if (res.success) {
          setTimeout(() => setSaveSuccess(false), 2500);
          setSaveSuccess(true);
        } else {
          setTimeout(() => setSaveSuccess(false), 2500);
        }
      }
      catch (error) {
        alert("Đã xảy ra lỗi khi lưu thông tin");
      } finally {
        setIsSaving(false);
      }
    }

  };
  const handleAddnewPhone = async () => {
    const phone = newPhoneInput.trim();
    if (!phone) {
      alert("Vui lòng nhập số điện thoại hợp lệ");
      return;
    }
    setShowPhoneModal(false);
    if (updateUser) {
      try {
        const res = await updateUser({ phoneNumber: phone });
        if (res.success) {
          setPhoneNumber(phone);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2500);
        } else {
          alert(res.message || "Cập nhật số điện thoại thất bại");
        }
      } catch (error) {
        alert("Đã xảy ra lỗi khi kết nối máy chủ");
      }
    }
  };
  const handleReturnHome = () => {
    if (onBackToStore) onBackToStore();
    else window.location.hash = "";
  };

  // 1. Màn hình chờ khi đang tải dữ liệu xác thực
  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
            progress_activity
          </span>
          <p className="font-body-md text-on-surface-variant font-medium">
            Đang tải dữ liệu hồ sơ Velvet & Brew...
          </p>
        </div>
      </div>
    );
  }

  // 2. Khi chưa đăng nhập tài khoản
  if (!user) {
    return (
      <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between">
        <header className="h-20 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
          <div
            className="flex items-center gap-space-sm cursor-pointer"
            onClick={handleReturnHome}
          >
            <img alt="Velvet & Brew Brand Logo" className="h-8 w-auto object-contain" src={logoIcon} />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary leading-tight tracking-tight">
                Velvet & Brew
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                Artisanal Coffee & Tea
              </span>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-space-md py-space-xs rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-semibold border-0 cursor-pointer shadow-sm hover:bg-tertiary-container transition-colors"
            type="button"
          >
            Đăng nhập ngay
          </button>
        </header>

        <div className="max-w-md mx-auto my-auto p-space-xl bg-surface-container-lowest rounded-2xl shadow-md text-center flex flex-col items-center gap-space-md">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[36px]">account_circle</span>
          </div>
          <h2 className="font-title-lg text-title-lg text-primary font-bold m-0">
            Bạn chưa đăng nhập tài khoản
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant m-0">
            Vui lòng đăng nhập để xem thông tin cá nhân của bạn, lịch sử đơn hàng, điểm tích lũy và cập nhật sổ địa chỉ nhận hàng Velvet & Brew.
          </p>
          <div className="flex items-center gap-space-sm w-full mt-2">
            <button
              onClick={handleReturnHome}
              className="flex-1 py-space-xs px-space-md rounded-full bg-surface-container text-on-surface font-label-md font-semibold border-0 cursor-pointer hover:bg-surface-container-high transition-colors"
              type="button"
            >
              ← Về trang chủ
            </button>
            <button
              onClick={onOpenAuth}
              className="flex-1 py-space-xs px-space-md rounded-full bg-primary-container text-on-primary font-label-md font-semibold border-0 cursor-pointer hover:bg-tertiary-container shadow-sm transition-all"
              type="button"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>

        <div className="py-space-md text-center text-on-surface-variant font-body-sm text-[12px]">
          © 2024 Velvet & Brew Artisanal Coffee & Tea.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen">
      {/* 1. HEADER CHUẨN THƯƠNG HIỆU */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-md shadow-[0_1px_8px_rgba(62,39,35,0.06)]">
        <div className="h-20 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-space-sm shrink-0 cursor-pointer"
            onClick={handleReturnHome}
            title="Về Trang Cửa Hàng"
          >
            <img
              alt="Velvet & Brew Brand Logo"
              className="h-8 w-auto object-contain"
              src={logoIcon}
              onError={(e) => {
                e.target.src =
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBRMxOCJJIwhg2mAHon8lvGMa1yym3orqDiRdlg40dBTFx0TvEYfZ71neLTQ8uprX8147qfyIYLJzVxXFz0-7ICt2RDwvn4jZ2tle3rHiJDQ2CKmX2n687yOluhuMxETFM7MOXoF--pdXecPCdu558V282Cl4oqc_UILl-QtvYPqxNgKmGVit_2jgH1wviVhHrNLduF8f-hBJVF13RvckcnmMoRE6pnVYhqI2aR7tzp6m2ScQKt6sznsQ";
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary leading-tight tracking-tight">
                Velvet & Brew
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                Artisanal Coffee & Tea
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-space-xs">
            <button
              onClick={handleReturnHome}
              className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all bg-transparent border-0 cursor-pointer"
            >
              Trang chủ
            </button>
            <button
              onClick={handleReturnHome}
              className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all bg-transparent border-0 cursor-pointer"
            >
              Thực đơn
            </button>
            <button
              onClick={handleReturnHome}
              className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all bg-transparent border-0 cursor-pointer"
            >
              Cà phê
            </button>
            <button
              onClick={handleReturnHome}
              className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all bg-transparent border-0 cursor-pointer"
            >
              Trà sữa
            </button>
            <button
              onClick={handleReturnHome}
              className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all bg-transparent border-0 cursor-pointer"
            >
              Khuyến mãi
            </button>
            <button
              onClick={handleReturnHome}
              className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all bg-transparent border-0 cursor-pointer"
            >
              Giới thiệu
            </button>
            <button
              onClick={handleReturnHome}
              className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all bg-transparent border-0 cursor-pointer"
            >
              Liên hệ
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-space-xs md:gap-space-sm shrink-0">
            <button
              aria-label="Tìm kiếm"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors bg-transparent border-0 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <button
              aria-label="Thông báo"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors bg-transparent border-0 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />
            </button>
            <button
              aria-label="Giỏ hàng"
              onClick={onOpenCart || handleReturnHome}
              className="relative flex items-center gap-space-2xs bg-surface-container-low hover:bg-surface-container-high px-space-sm py-space-xs rounded-full transition-all text-on-surface border-0 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-primary-container">
                local_mall
              </span>
              <span className="font-label-sm text-label-sm bg-primary-container text-on-primary px-space-2xs py-[1px] rounded-full">
                {cartCount || 3}
              </span>
            </button>
            <div className="relative flex items-center pl-space-xs" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                title={`${user.fullName || "Tài khoản của bạn"} (Bấm để xem menu)`}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-[0_2px_8px_rgba(62,39,35,0.2)] border-2 border-primary/20 hover:border-primary-container hover:scale-105 active:scale-95 transition-all cursor-pointer p-0 overflow-hidden outline-none"
              >
                <img
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                  src={avatar}
                  onError={(e) => {
                    e.target.src =
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIuIQH4ntxcCHLQm_B4eLlcpsyZoY-ztnLLrUoHQvuvhcWVL697v9e1qYuXL24xfWixBCb4BcNpdyDf9rtZtY-m81_NLB_tSkCN2O1IlWOV_1ZFsHncKjfwk6Rjx50j_WXLwVKonSWBuo8pXE9BWiAxbzq36FemRBOkxiDC3Dx-jHU6-d9_-gq1JUgZipflE6h9X1FRZCv7yciMd_JqiGJ5n7ELAz5zdTP9mBzsgaFotLvcETCpMaqAA";
                  }}
                />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-12 bg-white rounded-2xl shadow-[0_12px_36px_rgba(43,23,19,0.2),0_0_0_1px_rgba(211,195,192,0.4)] p-3 min-w-[240px] z-50 text-left"
                  style={{
                    animation: "menuDropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="px-2 py-2 border-b border-[#f1ede6] mb-2">
                    <div className="font-bold text-[#271310] text-[13.5px] truncate">
                      {user.fullName || "Khách hàng Velvet"}
                    </div>
                    <div className="text-[11.5px] text-[#756762] truncate mt-0.5">
                      {user.phoneNumber || user.email || "Hội viên Velvet Club"}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${isAdmin
                          ? "bg-[#ffdcc3] text-[#6e3900]"
                          : "bg-[#e6f4ea] text-[#137333]"
                          }`}
                      >
                        {isAdmin ? "Quản trị viên (Admin)" : "Hội viên Velvet Club"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onOpenAdmin) onOpenAdmin();
                          else window.location.hash = "admin";
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#271310] bg-[#f1ede6] hover:bg-[#e6e0d6] transition-colors flex items-center gap-2 border-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px] text-[#3e2723]">
                          dashboard
                        </span>
                        <span>Trang Quản Trị (Admin)</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleReturnHome();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-medium text-[#49454e] hover:bg-[#f1ede6] transition-colors flex items-center gap-2 border-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px] text-[#756762]">
                        storefront
                      </span>
                      <span>Về trang chủ cửa hàng</span>
                    </button>

                    <div className="border-t border-[#f1ede6] my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        if (logout) logout();
                        handleReturnHome();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-semibold text-[#93000a] bg-[#ffdad6] hover:bg-[#ffcdd2] transition-colors flex items-center gap-2 border-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        logout
                      </span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. NỘI DUNG CHÍNH (MAIN BODY) */}
      <main className="w-full pt-20 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-xl lg:py-space-2xl">
            {/* Top Breadcrumb & Status */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-xl">
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                <button
                  onClick={handleReturnHome}
                  className="hover:text-primary transition-colors flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0 font-label-md"
                >
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  Trang chủ
                </button>
                <span className="material-symbols-outlined text-[14px] text-outline">
                  chevron_right
                </span>
                <span className="text-on-surface-variant">Tài khoản</span>
                <span className="material-symbols-outlined text-[14px] text-outline">
                  chevron_right
                </span>
                <span className="text-primary font-medium">Hồ sơ & Tùy chọn</span>
              </div>
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-2xs rounded-full bg-surface-container shadow-sm text-on-surface-variant font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span>
                  Đồng bộ máy chủ: <strong>Trực tuyến</strong> • Lần đăng nhập cuối: 09:42
                  hôm nay
                </span>
              </div>
            </div>

            {/* MAIN 2-COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
              {/* ================= LEFT COLUMN: SIDEBAR (4 cols) ================= */}
              <aside className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-24">
                {/* Member Profile Overview Card */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-tertiary-fixed-dim/20 blur-2xl pointer-events-none" />
                  <div className="flex items-start gap-space-md relative">
                    <div className="relative shrink-0">
                      <img
                        className="w-20 h-20 rounded-full object-cover shadow-md"
                        alt={fullName}
                        src={avatar}
                      />
                      <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary-container text-on-tertiary-container flex items-center justify-center shadow-sm">
                        <span
                          className="material-symbols-outlined text-[14px] text-[#ffdcc3]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          workspace_premium
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-space-2xs">
                        <h2 className="font-title-lg text-title-lg text-primary truncate font-bold m-0">
                          {fullName}
                        </h2>
                        <span
                          className="material-symbols-outlined text-[18px] text-secondary shrink-0"
                          title="Tài khoản đã xác minh"
                        >
                          verified
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Thành viên từ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "Gần đây"}
                      </span>
                      <div className="mt-space-2xs flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-[11px] tracking-wide font-semibold shadow-sm">
                          <span
                            className="material-symbols-outlined text-[12px] text-[#ffdcc3]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            stars
                          </span>
                          {user?.role === "ADMIN" ? "Quản trị viên" : "Hội viên Gold"}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline tracking-wider font-mono">
                          {user?.id ? `VB-MB-${String(user.id).padStart(4, "0")}` : "VB-GOLD-8821"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reward Points Pill Box */}
                  <div className="rounded-lg bg-surface-container-low p-space-sm flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-tertiary-container">
                        <span
                          className="material-symbols-outlined text-[22px] text-on-tertiary-container"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          eco
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                          Hạt tích lũy
                        </span>
                        <span className="font-title-md text-title-md text-primary font-bold">
                          1.450 Hạt Brew
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-full">
                        ~145.000đ đổi món
                      </span>
                    </div>
                  </div>

                  {/* Tier Progress (Platinum Upgrade) */}
                  <div className="flex flex-col gap-space-2xs">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="text-on-surface-variant flex items-center gap-1">
                        Tiến trình lên <strong>Platinum</strong>
                      </span>
                      <span className="text-primary font-bold">85% (Còn 350.000đ)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-container via-on-tertiary-container to-secondary"
                        style={{ width: "85%" }}
                      />
                    </div>
                    <span className="font-body-sm text-[11px] text-on-surface-variant italic">
                      Tích lũy thêm 350k trước 31/12 để nhận ưu đãi Free Upgrade size cả
                      năm.
                    </span>
                  </div>
                </div>

                {/* Vertical Navigation Menu */}
                <nav className="rounded-xl bg-surface-container-lowest p-space-xs shadow-sm flex flex-col gap-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center justify-between px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-all border-0 cursor-pointer ${activeTab === "profile"
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface bg-transparent"
                      }`}
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        badge
                      </span>
                      <span className="truncate">Thông tin cá nhân & Tài khoản</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full flex items-center justify-between px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-colors border-0 cursor-pointer ${activeTab === "addresses"
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface bg-transparent"
                      }`}
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="material-symbols-outlined text-[20px]">
                        home_pin
                      </span>
                      <span className="truncate">Sổ địa chỉ nhận hàng</span>
                    </div>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                      {addresses.length} địa chỉ
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center justify-between px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-colors border-0 cursor-pointer ${activeTab === "orders"
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface bg-transparent"
                      }`}
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="material-symbols-outlined text-[20px]">
                        receipt_long
                      </span>
                      <span className="truncate">Lịch sử đơn & Trực tiếp</span>
                    </div>
                    <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold animate-pulse">
                      1 đơn đang giao
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("vouchers")}
                    className={`w-full flex items-center justify-between px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-colors border-0 cursor-pointer ${activeTab === "vouchers"
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface bg-transparent"
                      }`}
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="material-symbols-outlined text-[20px]">
                        confirmation_number
                      </span>
                      <span className="truncate">Ví Voucher & Ưu đãi</span>
                    </div>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                      4 mã
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("cards")}
                    className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-lg text-label-lg transition-colors bg-transparent border-0 cursor-pointer"
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="material-symbols-outlined text-[20px]">
                        qr_code_2
                      </span>
                      <span className="truncate">Thẻ số & Quét tích điểm</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      arrow_forward
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("security")}
                    className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-lg text-label-lg transition-colors bg-transparent border-0 cursor-pointer"
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="material-symbols-outlined text-[20px]">
                        lock_reset
                      </span>
                      <span className="truncate">Đổi mật khẩu & Bảo mật 2FA</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      arrow_forward
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("notifications")}
                    className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-lg text-label-lg transition-colors bg-transparent border-0 cursor-pointer"
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="material-symbols-outlined text-[20px]">
                        notifications_active
                      </span>
                      <span className="truncate">Cài đặt thông báo & Riêng tư</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      arrow_forward
                    </span>
                  </button>

                  <div className="my-space-2xs h-px bg-surface-container" />

                  <button
                    onClick={() => {
                      if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản?")) {
                        logout();
                        handleReturnHome();
                      }
                    }}
                    className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-error hover:bg-error-container/40 font-label-lg text-label-lg transition-colors text-left bg-transparent border-0 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </nav>

                {/* Digital Membership Pass Mini-Card */}
                <div className="rounded-xl bg-gradient-to-br from-primary-container via-tertiary-container to-primary text-on-primary p-space-md shadow-md relative overflow-hidden flex flex-col justify-between h-44">
                  <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-[160px]">
                      local_cafe
                    </span>
                  </div>
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <p className="font-label-sm text-[10px] uppercase tracking-widest text-[#ffdcc3] m-0">
                        Velvet & Brew Club Pass
                      </p>
                      <h3 className="font-headline-sm text-headline-sm italic text-on-primary m-0 mt-1">
                        Gold Privilege
                      </h3>
                    </div>
                    <span className="material-symbols-outlined text-[28px] text-[#ffdcc3]">
                      contactless
                    </span>
                  </div>
                  <div className="flex items-end justify-between relative z-10">
                    <div>
                      <p className="font-label-sm text-[11px] text-on-primary-container m-0">
                        Chủ thẻ
                      </p>
                      <p className="font-title-md text-title-md font-bold tracking-wide uppercase m-0 mt-0.5">
                        {(fullName || user?.fullName || "KHÁCH HÀNG").toUpperCase()}
                      </p>
                    </div>
                    <div className="bg-surface-container-lowest p-1.5 rounded-lg shadow-sm">
                      <svg
                        className="w-9 h-9 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v4h-2v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 4h4v2h-4v-2zm4-2h2v2h-2v-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </aside>

              {/* ================= RIGHT COLUMN: PROFILE FORMS (8 cols) ================= */}
              <section className="lg:col-span-8 flex flex-col gap-space-lg">
                {/* Header Banner Area */}
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex items-center gap-space-xs text-on-tertiary-container font-label-md text-label-md uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[18px]">
                      manage_accounts
                    </span>
                    <span>Trung tâm quản lý tài khoản</span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif m-0">
                    Hồ Sơ Cá Nhân & Thông Tin Tài Khoản
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed m-0 mt-1">
                    Quản lý thông tin bảo mật, khẩu vị yêu thích và địa chỉ để trải nghiệm
                    đặt món trực tuyến cũng như tại quầy Velvet & Brew luôn chuẩn vị và
                    trọn vẹn nhất.
                  </p>
                </div>

                {/* CARD 1: AVATAR & BASIC DETAILS */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm flex flex-col gap-space-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-2 h-6 rounded-full bg-primary-container" />
                      <h3 className="font-title-lg text-title-lg text-primary font-bold m-0">
                        1. Thông Tin Định Danh & Cá Nhân
                      </h3>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-xs py-1 rounded">
                      Bắt buộc
                    </span>
                  </div>

                  {/* Hidden file input for avatar */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Avatar Uploader Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-space-lg p-space-md rounded-xl bg-surface-container-low">
                    <div className="relative shrink-0 group">
                      <img
                        className="w-24 h-24 rounded-full object-cover shadow-sm group-hover:opacity-90 transition-opacity"
                        alt={fullName}
                        src={avatar}
                      />
                      <button
                        className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform border-0 cursor-pointer"
                        title="Tải ảnh mới"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          photo_camera
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-space-xs">
                        <button
                          className="px-space-md py-space-xs rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-sm border-0 cursor-pointer font-semibold"
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Thay đổi ảnh
                        </button>
                        <button
                          className="px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors border-0 cursor-pointer font-semibold"
                          type="button"
                          onClick={() =>
                            setAvatar(
                              "https://lh3.googleusercontent.com/aida-public/AB6AXuAIuIQH4ntxcCHLQm_B4eLlcpsyZoY-ztnLLrUoHQvuvhcWVL697v9e1qYuXL24xfWixBCb4BcNpdyDf9rtZtY-m81_NLB_tSkCN2O1IlWOV_1ZFsHncKjfwk6Rjx50j_WXLwVKonSWBuo8pXE9BWiAxbzq36FemRBOkxiDC3Dx-jHU6-d9_-gq1JUgZipflE6h9X1FRZCv7yciMd_JqiGJ5n7ELAz5zdTP9mBzsgaFotLvcETCpMaqAA"
                            )
                          }
                        >
                          Xóa ảnh
                        </button>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 m-0">
                        Hỗ trợ định dạng JPG, PNG hoặc WEBP. Dung lượng tối đa 5MB. Kích
                        thước khuyến nghị 400x400px.
                      </p>
                    </div>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Full Name */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-lg text-label-lg text-primary font-semibold">
                        Họ và tên đầy đủ <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#3e2723] outline-none transition-all border border-transparent"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-[20px] text-outline pointer-events-none">
                          person
                        </span>
                      </div>
                    </div>

                    {/* Nickname */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-lg text-label-lg text-primary font-semibold">
                        Tên hiển thị / Biệt danh
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#3e2723] outline-none transition-all border border-transparent"
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-[20px] text-outline pointer-events-none">
                          badge
                        </span>
                      </div>
                    </div>

                    {/* Gender Selector */}
                    <div className="flex flex-col gap-space-2xs md:col-span-2">
                      <label className="font-label-lg text-label-lg text-primary font-semibold">
                        Giới tính
                      </label>
                      <div className="grid grid-cols-3 gap-space-xs pt-1 max-w-md">
                        <label
                          className={`flex items-center justify-center gap-2 p-space-xs rounded-lg font-label-md text-label-md cursor-pointer transition-all ${gender === "male"
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                            }`}
                        >
                          <input
                            checked={gender === "male"}
                            onChange={() => setGender("male")}
                            className="sr-only"
                            name="gender"
                            type="radio"
                            value="male"
                          />
                          <span className="material-symbols-outlined text-[18px]">
                            male
                          </span>
                          <span>Nam</span>
                        </label>
                        <label
                          className={`flex items-center justify-center gap-2 p-space-xs rounded-lg font-label-md text-label-md cursor-pointer transition-all ${gender === "female"
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                            }`}
                        >
                          <input
                            checked={gender === "female"}
                            onChange={() => setGender("female")}
                            className="sr-only"
                            name="gender"
                            type="radio"
                            value="female"
                          />
                          <span className="material-symbols-outlined text-[18px]">
                            female
                          </span>
                          <span>Nữ</span>
                        </label>
                        <label
                          className={`flex items-center justify-center gap-2 p-space-xs rounded-lg font-label-md text-label-md cursor-pointer transition-all ${gender === "other"
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                            }`}
                        >
                          <input
                            checked={gender === "other"}
                            onChange={() => setGender("other")}
                            className="sr-only"
                            name="gender"
                            type="radio"
                            value="other"
                          />
                          <span>Khác</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: CONTACT & SECURITY */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm flex flex-col gap-space-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-2 h-6 rounded-full bg-primary-container" />
                      <h3 className="font-title-lg text-title-lg text-primary font-bold m-0">
                        2. Liên Hệ & Bảo Mật Tài Khoản
                      </h3>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">
                        shield
                      </span>{" "}
                      Bảo vệ 2 lớp đã bật
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Phone Number Verification Box */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between gap-space-sm">
                      <div className="flex flex-col gap-1">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                          Số điện thoại chính
                        </span>
                        <div className="flex items-center gap-space-xs">
                          <span className="font-title-md text-title-md text-primary font-bold tracking-wide">
                            {phoneNumber}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-semibold">
                            <span className="material-symbols-outlined text-[12px]">
                              check_circle
                            </span>{" "}
                            Đã xác thực OTP
                          </span>
                        </div>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 m-0">
                          Dùng để đăng nhập, nhận thông báo đơn hàng và liên hệ khi giao nhận.
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setNewPhoneInput(phoneNumber || "0912 345 678");
                            setShowPhoneModal(true);
                          }}
                          className="px-space-md py-space-xs rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 border-0 cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            phone_iphone
                          </span>
                          Thay đổi số điện thoại
                        </button>
                      </div>
                    </div>

                    {/* Email Verification Box */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between gap-space-sm">
                      <div className="flex flex-col gap-1">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                          Email liên kết
                        </span>
                        <div className="flex items-center gap-space-xs">
                          <span className="font-title-md text-title-md text-primary font-bold truncate">
                            {email}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-semibold shrink-0">
                            <span className="material-symbols-outlined text-[12px]">
                              verified
                            </span>{" "}
                            Đã xác minh
                          </span>
                        </div>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 m-0">
                          Nhận hóa đơn điện tử e-VAT và bảng sao kê điểm thưởng hàng tháng.
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setNewEmailInput(email || "tri.nguyen@craftstudio.vn");
                            setConfirmPasswordInput("");
                            setShowPassword(false);
                            setShowEmailModal(true);
                          }}
                          className="px-space-md py-space-xs rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 border-0 cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            mail
                          </span>
                          Cập nhật email
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Social / SSO Accounts */}
                  <div className="flex flex-col gap-space-xs pt-space-xs">
                    <span className="font-label-lg text-label-lg text-primary font-semibold">
                      Tài khoản liên kết nhanh
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                      {/* Google */}
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                                fill="#FBBC05"
                              />
                              <path
                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                                fill="#EA4335"
                              />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-primary font-semibold">
                              Tài khoản Google
                            </span>
                            <span className="font-body-sm text-[11px] text-secondary">
                              {googleConnected
                                ? "Đã liên kết (tri.design@...)"
                                : "Chưa liên kết"}
                            </span>
                          </div>
                        </div>
                        {googleConnected ? (
                          <button
                            onClick={() => setGoogleConnected(false)}
                            className="text-on-surface-variant hover:text-error font-label-sm text-label-sm underline bg-transparent border-0 cursor-pointer"
                            type="button"
                          >
                            Gỡ
                          </button>
                        ) : (
                          <button
                            onClick={() => setGoogleConnected(true)}
                            className="px-space-sm py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-[12px] border-0 cursor-pointer"
                            type="button"
                          >
                            Liên kết
                          </button>
                        )}
                      </div>

                      {/* Apple ID */}
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
                            <svg
                              className="w-4 h-4 fill-current text-primary"
                              viewBox="0 0 170 170"
                            >
                              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.74-7.98-12.16-14.7-6.2-9.41-11.1-20.2-14.7-32.39-3.6-12.18-5.4-23.75-5.4-34.72 0-14.93 3.65-27.42 10.96-37.47 7.3-10.05 16.73-15.18 28.27-15.4 4.58 0 9.87 1.25 15.86 3.75 5.99 2.5 10.15 3.79 12.49 3.87 1.84 0 6.27-1.39 13.28-4.17 7.02-2.77 12.98-3.95 17.88-3.52 14.15 1.13 25.14 6.78 32.96 16.94-12.63 7.68-18.73 18.23-18.3 31.64.32 10.42 4.29 19.14 11.91 26.17 7.62 7.03 16.63 11.05 27.03 12.06-2.3 7.32-5.4 14.54-9.3 21.66zM119.22 33.15c0-7.39 2.66-14.47 7.98-21.24 5.32-6.77 11.89-11.03 19.71-12.78.33 1.5.49 2.92.49 4.27 0 7.4-2.84 14.65-8.52 21.75-5.68 7.1-12.41 11.23-20.2 12.4-.33-1.42-.49-2.88-.49-4.4z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-primary font-semibold">
                              Apple ID
                            </span>
                            <span className="font-body-sm text-[11px] text-on-surface-variant">
                              {appleConnected ? "Đã liên kết" : "Chưa kích hoạt"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setAppleConnected(!appleConnected)}
                          className="px-space-sm py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-[12px] hover:bg-tertiary-container transition-colors border-0 cursor-pointer"
                          type="button"
                        >
                          {appleConnected ? "Gỡ" : "Liên kết ngay"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: SAVED DELIVERY ADDRESS BOOK */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm flex flex-col gap-space-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-2 h-6 rounded-full bg-primary-container" />
                      <h3 className="font-title-lg text-title-lg text-primary font-bold m-0">
                        3. Sổ Địa Chỉ Nhận Hàng Thường Dùng
                      </h3>
                    </div>
                    <button
                      onClick={handleAddNewAddress}
                      className="flex items-center gap-1 px-space-md py-1.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-sm border-0 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add_location_alt
                      </span>
                      <span>Thêm địa chỉ mới</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-space-md">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start justify-between gap-space-md shadow-sm"
                      >
                        <div className="flex items-start gap-space-sm">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[20px]">
                              {addr.isDefault ? "apartment" : "business_center"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-space-xs">
                              <span className="font-title-md text-title-md text-primary font-bold">
                                {addr.title}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${addr.isDefault
                                  ? "bg-primary text-on-primary"
                                  : "bg-surface-container text-on-surface-variant"
                                  }`}
                              >
                                {addr.tag}
                              </span>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface m-0">
                              {addr.address}
                            </p>
                            <div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-[13px] mt-1">
                              <span>
                                Người nhận: <strong>{addr.recipient}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                SĐT: <strong>{addr.phone}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center gap-2 self-end sm:self-center shrink-0">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-on-tertiary-container hover:underline font-label-sm text-[12px] font-semibold bg-transparent border-0 cursor-pointer"
                              type="button"
                            >
                              Đặt làm mặc định
                            </button>
                          )}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                const newTitle = prompt(
                                  "Đổi tên địa chỉ:",
                                  addr.title
                                );
                                if (newTitle) {
                                  setAddresses((prev) =>
                                    prev.map((a) =>
                                      a.id === addr.id ? { ...a, title: newTitle } : a
                                    )
                                  );
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors border-0 cursor-pointer"
                              title="Chỉnh sửa"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors border-0 cursor-pointer"
                              title="Xóa"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTION FOOTER BAR */}
                <div className="sticky bottom-4 z-20 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-space-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-[12px]">
                    <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                      enhanced_encryption
                    </span>
                    <span>
                      Mọi thay đổi thông tin đều được bảo mật mã hóa SSL 256-bit theo tiêu
                      chuẩn bảo mật dữ liệu khách hàng Velvet & Brew.
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm shrink-0 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleReturnHome}
                      className="px-space-lg py-space-xs rounded-full bg-surface-container text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container-high transition-colors border-0 cursor-pointer"
                      type="button"
                    >
                      Hủy bỏ thay đổi
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className={`px-space-xl py-space-xs rounded-full font-label-lg text-label-lg font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 border-0 cursor-pointer ${saveSuccess
                        ? "bg-secondary text-white"
                        : "bg-primary-container text-on-primary hover:bg-tertiary-container"
                        }`}
                      type="button"
                    >
                      {isSaving ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">
                            progress_activity
                          </span>
                          <span>Đang lưu dữ liệu...</span>
                        </>
                      ) : saveSuccess ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                            done_all
                          </span>
                          <span>Đã lưu thành công!</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px] text-[#ffdcc3]">
                            check_circle
                          </span>
                          <span>Lưu Cập Nhật Thông Tin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER TRANG WEB */}
      <footer className="w-full bg-surface-container-low text-on-surface shadow-[0_-1px_12px_rgba(62,39,35,0.03)] mt-space-3xl">
        <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter-desktop">
            <div className="lg:col-span-2 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <img
                  alt="Velvet & Brew Brand Logo"
                  className="h-8 w-auto object-contain"
                  src={logoIcon}
                  onError={(e) => {
                    e.target.src =
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRMxOCJJIwhg2mAHon8lvGMa1yym3orqDiRdlg40dBTFx0TvEYfZ71neLTQ8uprX8147qfyIYLJzVxXFz0-7ICt2RDwvn4jZ2tle3rHiJDQ2CKmX2n687yOluhuMxETFM7MOXoF--pdXecPCdu558V282Cl4oqc_UILl-QtvYPqxNgKmGVit_2jgH1wviVhHrNLduF8f-hBJVF13RvckcnmMoRE6pnVYhqI2aR7tzp6m2ScQKt6sznsQ";
                  }}
                />
                <span className="font-headline-sm text-headline-sm text-primary leading-tight tracking-tight">
                  Velvet & Brew
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md m-0">
                Nơi nghệ thuật pha chế thủ công hòa quyện cùng xúc cảm đương đại. Từng giọt
                cà phê chắt lọc và lá trà tuyển chọn mang lại trải nghiệm thư thái tuyệt
                mỹ.
              </p>
              <div className="flex flex-col gap-space-2xs mt-2">
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                    schedule
                  </span>
                  <span className="font-body-sm text-body-sm">
                    Thứ Hai - Chủ Nhật: 07:00 - 22:30
                  </span>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                    location_on
                  </span>
                  <span className="font-body-sm text-body-sm">
                    124 Phố Cổ, Quận Hoàn Kiếm, Hà Nội
                  </span>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                    call
                  </span>
                  <span className="font-body-sm text-body-sm">+84 (0) 24 3828 9999</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-title-md text-title-md text-primary font-bold">
                Khám Phá
              </span>
              <div className="flex flex-col gap-space-xs">
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#ca-phe"
                >
                  Cà phê Specialty
                </a>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#tra-sua"
                >
                  Trà Shan Tuyết & Oolong
                </a>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#banh-ngot"
                >
                  Bánh ngọt thủ công
                </a>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#qua-tang"
                >
                  Bộ quà tặng mùa lễ hội
                </a>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#brewclub"
                >
                  Đăng ký hội viên BrewClub
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-title-md text-title-md text-primary font-bold">
                Hỗ Trợ
              </span>
              <div className="flex flex-col gap-space-xs">
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#giao-hang"
                >
                  Chính sách giao hàng
                </a>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#huong-dan"
                >
                  Hướng dẫn đặt đồ uống
                </a>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#bao-mat"
                >
                  Bảo mật thông tin
                </a>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#nhuong-quyen"
                >
                  Hợp tác nhượng quyền
                </a>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline"
                  href="#lien-he"
                >
                  Liên hệ phản hồi
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-title-md text-title-md text-primary font-bold">
                Bản Tin Hương Vị
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant m-0">
                Đăng ký nhận ưu đãi độc quyền và cảm hứng thưởng thức cà phê mỗi tuần.
              </p>
              <div className="flex flex-col gap-space-xs mt-2">
                <div className="flex items-center bg-surface-container-lowest rounded-full p-space-2xs shadow-[0_2px_8px_rgba(62,39,35,0.04)] border border-outline-variant/30">
                  <input
                    className="bg-transparent px-space-sm py-space-xs text-on-surface placeholder:text-outline font-body-sm text-body-sm outline-none w-full"
                    placeholder="Email của bạn..."
                    type="email"
                  />
                  <button
                    className="bg-primary-container text-on-primary hover:bg-tertiary-container rounded-full px-space-md py-space-xs font-label-sm text-label-sm transition-colors shrink-0 border-0 cursor-pointer font-semibold"
                    type="button"
                  >
                    Gửi
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-space-xs pt-space-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] hover:text-primary cursor-pointer transition-colors">
                  local_cafe
                </span>
                <span className="material-symbols-outlined text-[20px] hover:text-primary cursor-pointer transition-colors">
                  photo_camera
                </span>
                <span className="material-symbols-outlined text-[20px] hover:text-primary cursor-pointer transition-colors">
                  share
                </span>
                <span className="material-symbols-outlined text-[20px] hover:text-primary cursor-pointer transition-colors">
                  forum
                </span>
              </div>
            </div>
          </div>

          <div className="mt-space-2xl pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm border-t border-surface-container">
            <p className="m-0">
              © 2024 Velvet & Brew Artisanal Coffee & Tea. Tất cả quyền được bảo
              lưu.
            </p>
            <div className="flex items-center gap-space-md">
              <a
                className="hover:text-primary transition-colors no-underline text-on-surface-variant"
                href="#dieu-khoan"
              >
                Điều khoản dịch vụ
              </a>
              <a
                className="hover:text-primary transition-colors no-underline text-on-surface-variant"
                href="#quyen-rieng-tu"
              >
                Chính sách quyền riêng tư
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= KHUNG 1: MODAL THAY ĐỔI SỐ ĐIỆN THOẠI ================= */}
      {showPhoneModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile md:p-space-xl bg-[#271310]/60 backdrop-blur-sm transition-all duration-300"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPhoneModal(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between px-space-lg py-space-md border-b border-surface-container bg-surface-container-low">
              <div className="flex items-center gap-space-xs">
                <div className="w-9 h-9 rounded-full bg-primary-container text-[#ffdcc3] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                </div>
                <div>
                  <h3 className="font-title-lg text-title-lg text-primary font-bold leading-tight m-0">
                    Thay Đổi Số Điện Thoại
                  </h3>
                  <p className="font-body-sm text-[12px] text-on-surface-variant m-0">
                    Cập nhật số điện thoại nhận thông báo và liên hệ giao nhận
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors border-0 cursor-pointer"
                title="Đóng hộp thoại"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-space-lg overflow-y-auto flex flex-col gap-space-md">
              {/* Số hiện tại */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">
                    Số điện thoại hiện tại
                  </span>
                  <span className="font-title-md text-title-md text-primary font-bold">
                    {phoneNumber || "Chưa thiết lập"}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Đang kích hoạt
                </span>
              </div>

              {/* Ô nhập số mới */}
              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-md text-label-md text-primary font-semibold">
                  Số điện thoại mới <span className="text-error">*</span>
                </label>
                <div className="flex rounded-lg overflow-hidden border border-outline-variant focus-within:border-primary-container focus-within:shadow-[0_0_0_2px_#3e2723] bg-surface-container-low">
                  <div className="flex items-center gap-1 px-space-sm bg-surface-container text-on-surface-variant font-label-md text-label-md border-r border-outline-variant shrink-0">
                    <span className="text-[14px]">🇻🇳</span>
                    <span className="font-bold">+84</span>
                  </div>
                  <input
                    className="w-full px-space-md py-space-xs bg-transparent text-on-surface font-body-md text-body-md outline-none border-0"
                    type="tel"
                    placeholder="09xx xxx xxx"
                    value={newPhoneInput}
                    onChange={(e) => setNewPhoneInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Hộp thông tin ghi chú */}
              <div className="p-space-xs rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-on-tertiary-container shrink-0 mt-0.5">
                  phone_in_talk
                </span>
                <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed m-0">
                  Số điện thoại mới sẽ được dùng để đăng nhập, nhận thông báo đơn hàng và hỗ trợ tài xế liên hệ khi giao hàng.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-space-lg py-space-md border-t border-surface-container bg-surface-container-low">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors border-0 cursor-pointer"
                type="button"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleAddnewPhone}
                className="px-space-lg py-space-xs rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-tertiary-container shadow-sm flex items-center gap-1 transition-all border-0 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-[#ffdcc3]">
                  check_circle
                </span>
                <span>Lưu Số Điện Thoại Mới</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= KHUNG 2: MODAL CẬP NHẬT EMAIL ================= */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile md:p-space-xl bg-[#271310]/60 backdrop-blur-sm transition-all duration-300"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEmailModal(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between px-space-lg py-space-md border-b border-surface-container bg-surface-container-low">
              <div className="flex items-center gap-space-xs">
                <div className="w-9 h-9 rounded-full bg-primary-container text-[#ffdcc3] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <h3 className="font-title-lg text-title-lg text-primary font-bold leading-tight m-0">
                    Cập Nhật Email Liên Kết
                  </h3>
                  <p className="font-body-sm text-[12px] text-on-surface-variant m-0">
                    Xác thực hòm thư điện tử để nhận hóa đơn và thông báo ưu đãi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors border-0 cursor-pointer"
                title="Đóng hộp thoại"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-space-lg overflow-y-auto flex flex-col gap-space-md">
              {/* Email hiện tại */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">
                    Email liên kết hiện tại
                  </span>
                  <span className="font-title-md text-title-md text-primary font-bold truncate max-w-[240px]">
                    {email || "Chưa có email"}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-semibold shrink-0">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  Đã xác minh
                </span>
              </div>

              {/* Ô nhập Email mới */}
              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-md text-label-md text-primary font-semibold">
                  Địa chỉ Email mới <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full px-space-md py-space-xs pr-10 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:border-primary outline-none transition-all"
                    type="email"
                    placeholder="vidu@domain.com"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[20px] text-outline pointer-events-none">
                    mail
                  </span>
                </div>
              </div>

              {/* Ô xác nhận mật khẩu */}
              <div className="flex flex-col gap-space-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-primary font-semibold">
                    Mật khẩu tài khoản hiện tại <span className="text-error">*</span>
                  </label>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">
                    Xác thực bảo vệ tài khoản
                  </span>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-space-md py-space-xs pr-10 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:border-primary outline-none transition-all"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại..."
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  />
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-outline hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Hộp ghi chú */}
              <div className="p-space-xs rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-on-tertiary-container shrink-0 mt-0.5">
                  receipt_long
                </span>
                <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed m-0">
                  Email này sẽ nhận hóa đơn điện tử VAT, thông báo ưu đãi độc quyền hội viên và mã QR đổi quà tích điểm từ hệ thống Velvet &amp; Brew.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-space-lg py-space-md border-t border-surface-container bg-surface-container-low">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors border-0 cursor-pointer"
                type="button"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  if (newEmailInput.trim()) {
                    setEmail(newEmailInput.trim());
                  }
                  setShowEmailModal(false);
                }}
                className="px-space-lg py-space-xs rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-tertiary-container shadow-sm flex items-center gap-1 transition-all border-0 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-[#ffdcc3]">
                  send
                </span>
                <span>Xác nhận &amp; Cập nhật Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
