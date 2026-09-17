export default function Header({ cartCount, onOpenCart }) {
  const navItems = [
    "Trang chủ",
    "Thực đơn",
    "Cà phê",
    "Trà sữa",
    "Khuyến mãi",
    "Giới thiệu",
    "Liên hệ",
  ];

  return (
    <header>
      <div className="header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark">
            V<span>&</span>B
          </span>
          <span>
            <strong>Velvet & Brew</strong>
            <small>ARTISANAL COFFEE & TEA</small>
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
          <button>⌕</button>
          <button className="notification">
            ♧<i />
          </button>
          <button className="cart-button" onClick={onOpenCart}>
            ♧ <b>{cartCount}</b>
          </button>
          <span className="avatar">VB</span>
        </div>
      </div>
    </header>
  );
}
