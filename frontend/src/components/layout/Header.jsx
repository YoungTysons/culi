import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import logoIcon from "../../assets/logo-icon.png";

export default function Header({
  cartCount,
  onOpenCart,
  searchQuery = "",
  onSearchChange,
  onOpenAdmin,
}) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState(searchQuery || "");
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Đồng bộ search query nếu có prop truyền vào
  useEffect(() => {
    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  // Tự động focus vào ô nhập khi mở thanh tìm kiếm
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Đóng thanh tìm kiếm khi bấm ra ngoài nếu ô tìm kiếm đang trống
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        if (!query.trim()) {
          setIsSearchOpen(false);
        }
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, query]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClearOrClose = () => {
    if (query) {
      setQuery("");
      if (onSearchChange) onSearchChange("");
      if (searchInputRef.current) searchInputRef.current.focus();
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    } else if (e.key === "Enter") {
      const menuSection = document.getElementById("menu-grid");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navItems = [
    "Trang chủ",
    "Thực đơn",
    "Cà phê",
    "Trà sữa",
    "Khuyến mãi",
    "Giới thiệu",
    "Liên hệ",
  ];

  // Lấy 2 chữ cái viết tắt của họ tên
  const initials = user?.fullName
    ? user.fullName
        .trim()
        .split(" ")
        .map((n) => n[0])
        .slice(-2)
        .join("")
        .toUpperCase()
    : "VB";

  return (
    <header>
      <div className="header-inner">
        <a className="brand" href="#top">
          <img src={logoIcon} alt="Velvet & Brew" className="brand-logo-img" />
          <span>
            <strong>Velvet &amp; Brew</strong>
            <small>ARTISANAL COFFEE &amp; TEA</small>
          </span>
        </a>
        <nav>
          {navItems.map((item, index) => (
            <a
              className={index === 0 ? "active" : ""}
              href={index === 1 ? "#menu-grid" : "#top"}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          {/* Thanh tìm kiếm mở rộng khi click icon */}
          <div className="header-search-wrap" ref={searchContainerRef}>
            {!isSearchOpen ? (
              <button
                className="search-toggle-btn"
                onClick={handleOpenSearch}
                title="Tìm kiếm đồ uống"
                type="button"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            ) : (
              <div className="header-search-bar">
                <span className="material-symbols-outlined header-search-icon">
                  search
                </span>
                <input
                  ref={searchInputRef}
                  className="header-search-input"
                  type="text"
                  placeholder="Tìm kiếm đồ uống..."
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="header-search-close-btn"
                  onClick={handleClearOrClose}
                  title={query ? "Xóa từ khóa" : "Đóng tìm kiếm"}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>
          <button className="notification" title="Thông báo" type="button">
            <span className="material-symbols-outlined">notifications</span>
            <i />
          </button>
          <button className="cart-button" onClick={onOpenCart} title="Giỏ hàng" type="button">
            <span className="material-symbols-outlined">shopping_bag</span>
            <b>{cartCount}</b>
          </button>

          {/* Nút truy cập nhanh Admin Portal */}
          <button
            onClick={onOpenAdmin}
            title="Mở Trang Quản Trị Hệ Thống (Admin Portal)"
            type="button"
            style={{
              width: "auto",
              padding: "0 11px",
              height: "36px",
              borderRadius: "18px",
              background: "#3e2723",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 2px 8px rgba(62, 39, 35, 0.15)",
              transition: "transform 0.15s ease, opacity 0.15s ease",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              admin_panel_settings
            </span>
            <span>Admin</span>
          </button>

          {/* Menu thông tin tài khoản & Đăng xuất */}
          <div style={{ position: "relative" }}>
            <button
              className="avatar-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              title={user ? `${user.fullName} (Bấm để mở menu)` : "Tài khoản"}
              type="button"
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span className="avatar">{initials}</span>
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "42px",
                  background: "#ffffff",
                  borderRadius: "14px",
                  boxShadow: "0 10px 30px rgba(43, 23, 19, 0.18), 0 0 0 1px rgba(211, 195, 192, 0.5)",
                  padding: "12px",
                  minWidth: "200px",
                  zIndex: 100,
                  animation: "authScaleUp 0.18s ease-out",
                }}
              >
                <div
                  style={{
                    padding: "4px 6px 10px 6px",
                    borderBottom: "1px solid #f1ede6",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: "700",
                      color: "#271310",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.fullName || "Khách hàng"}
                  </div>
                  <div style={{ color: "#756762", fontSize: "11.5px", marginTop: "2px" }}>
                    {user?.phoneNumber || user?.email || "Hội viên Velvet Club"}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (onOpenAdmin) onOpenAdmin();
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    background: "#f1ede6",
                    color: "#271310",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                    transition: "background 0.2s",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "#3e2723" }}>
                    dashboard
                  </span>
                  <span>Trang Quản Trị (Admin)</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    background: "#ffdad6",
                    color: "#93000a",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background 0.2s",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>
                    logout
                  </span>
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
