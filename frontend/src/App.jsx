import { useMemo, useState } from "react";
import "./App.css";

const products = [
  [
    "Cà phê sữa truyền thống",
    "coffee",
    "45.000đ",
    "Đậm đà Robusta & Arabica phối cùng sữa đặc ngọt dịu.",
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&q=85",
  ],
  [
    "Trà sữa Oolong Nướng",
    "milktea",
    "49.000đ",
    "Trà rang thơm nồng, trân châu hoàng kim dai giòn mật ong.",
    "https://images.unsplash.com/photo-1558857563-b371033873b8?w=700&q=85",
  ],
  [
    "Bạc xỉu Sài Gòn 3 tầng",
    "coffee",
    "50.000đ",
    "Sữa tươi béo ngậy hòa cùng tầng cà phê nồng nàn sóng sánh.",
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=85",
  ],
  [
    "Matcha Latte Kem Cheese",
    "special",
    "55.000đ",
    "Matcha Uji thượng hạng hòa quyện kem cheese dẻo mặn.",
    "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=700&q=85",
  ],
  [
    "Trà Đào Cam Sả Tươi",
    "fruittea",
    "48.000đ",
    "Vị chua ngọt thanh mát cùng miếng đào giòn ngọt.",
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&q=85",
  ],
  [
    "Cà phê Muối Cố Đô",
    "coffee",
    "52.000đ",
    "Kem muối béo mặn tôn lên vị đắng ngọt quyến rũ.",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=85",
  ],
  [
    "Sữa Tươi Trân Châu Đường Đen",
    "milktea",
    "55.000đ",
    "Sữa tươi Đà Lạt hòa cùng trân châu đường đen dẻo.",
    "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=700&q=85",
  ],
  [
    "Cacao Dừa Đá Xay",
    "special",
    "58.000đ",
    "Cacao nguyên chất kết hợp tuyết cốt dừa Bến Tre.",
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=85",
  ],
].map(([name, category, price, description, image], index) => ({
  id: index + 1,
  name,
  category,
  price,
  description,
  image,
}));

const categories = [
  ["coffee", "☕", "Cà phê", "12 món mộc & phin"],
  ["milktea", "◉", "Trà sữa", "16 loại trà lá ủ"],
  ["fruittea", "✦", "Trà trái cây", "Trái cây tươi Đà Lạt"],
  ["special", "❄", "Đá xay Frost", "Cacao béo mượt"],
  ["freshjuice", "◌", "Nước ép tươi", "Ép lạnh giữ vitamin"],
  ["toppings", "✣", "Topping thủ công", "Nấu mới mỗi 4 giờ"],
];
const amount = (text) => Number(String(text).replace(/\D/g, ""));
const money = (value) => `${value.toLocaleString("vi-VN")}đ`;

function App() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [cart, setCart] = useState([
    { ...products[0], quantity: 1 },
    { ...products[1], quantity: 2 },
  ]);
  const [custom, setCustom] = useState({
    size: 0,
    sugar: "70%",
    ice: "Chuẩn",
    toppings: [],
  });
  const shown = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((item) => item.category === filter),
    [filter],
  );
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + amount(item.price) * item.quantity,
    0,
  );
  const customTotal = selected
    ? amount(selected.price) +
      custom.size +
      custom.toppings.reduce((sum, item) => sum + item.price, 0)
    : 0;

  const addToCart = (product) => {
    setCart((current) =>
      current.some((item) => item.id === product.id)
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { ...product, quantity: 1 }],
    );
    setSelected(null);
    setDrawer(true);
  };
  const changeQuantity = (id, change) =>
    setCart((current) =>
      current.flatMap((item) =>
        item.id === id && item.quantity + change < 1
          ? []
          : item.id === id
            ? [{ ...item, quantity: item.quantity + change }]
            : [item],
      ),
    );

  return (
    <div className="app-shell">
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
            {[
              "Trang chủ",
              "Thực đơn",
              "Cà phê",
              "Trà sữa",
              "Khuyến mãi",
              "Giới thiệu",
              "Liên hệ",
            ].map((item, index) => (
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
            <button className="cart-button" onClick={() => setDrawer(true)}>
              ♧ <b>{count}</b>
            </button>
            <span className="avatar">VB</span>
          </div>
        </div>
      </header>
      <main id="top">
        <div className="notice">
          <span>
            ✦ <strong>Giao hỏa tốc 20 phút</strong> · Cam kết nguyên vẹn lớp bọt
            kem và độ lạnh chuẩn vị
          </span>
          <span>
            ♧ Freeship đơn từ 99k &nbsp; | &nbsp; <b>CODE: VELVETNEW (-20%)</b>
          </span>
        </div>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <i /> THỦ CÔNG · CHUẨN VỊ MỘC <b>Freeship từ 99k</b>
            </span>
            <h1>
              Hương vị yêu thích,
              <br />
              <em>giao tận nơi trong 20 phút.</em>
            </h1>
            <p>
              Thưởng thức từng giọt cà phê Arabica Cầu Đất rang mộc đậm đà cùng
              trà Ô long sữa thượng hạng, được chắt lọc tỉ mỉ từ những đồn điền
              cao nguyên sương mờ Việt Nam.
            </p>
            <div className="hero-buttons">
              <a className="button primary" href="#menu-grid">
                Đặt hàng ngay →
              </a>
              <a className="button secondary" href="#categories-section">
                Xem thực đơn ▦
              </a>
            </div>
            <div className="metrics">
              <div>
                <strong>100%</strong>
                <span>Hạt Arabica Cầu Đất</span>
              </div>
              <div>
                <strong>20m</strong>
                <span>Giao nóng & mát lạnh</span>
              </div>
              <div>
                <strong>4.9★</strong>
                <span>Trên 18.000 đánh giá</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1498804103079-a6351b050096?w=900&q=90"
              alt="Đồ uống thủ công"
            />
            <span className="image-badge badge-one">
              🌿 <b>Trà Ô Long Shan</b>
              <small>Thu hái mộc hữu cơ</small>
            </span>
            <span className="image-badge badge-two">
              🔥 <b>Rang Chậm Fresh</b>
              <small>Cầu Đất, Đà Lạt</small>
            </span>
            <div className="signature">
              <small>SIGNATURE DUO</small>
              <strong>Caramel Macchiato & Oolong Cheese</strong>
              <b>
                99.000đ <del>115.000đ</del>
              </b>
              <button onClick={() => addToCart(products[1])}>+</button>
            </div>
          </div>
        </section>
        <section className="category-section" id="categories-section">
          <div className="section-heading">
            <div>
              <small>THỰC ĐƠN ĐẶC SẮC</small>
              <h2>Danh Mục Thức Uống</h2>
            </div>
            <p>
              Từ cà phê phin mộc mạc tới trà sữa hoa quả thanh nhã, chọn ngay gu
              vị yêu thích của bạn hôm nay.
            </p>
          </div>
          <div className="categories">
            {categories.map(([id, icon, title, desc]) => (
              <button
                className={filter === id ? "selected" : ""}
                key={id}
                onClick={() => {
                  setFilter(id);
                  document
                    .querySelector("#menu-grid")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>{icon}</span>
                <strong>{title}</strong>
                <small>{desc}</small>
              </button>
            ))}
          </div>
        </section>
        <section className="menu-section" id="menu-grid">
          <div className="section-heading menu-heading">
            <div>
              <span className="hot-label">
                ★ MÓN CHẠY NHẤT · YÊU THÍCH NHẤT THÁNG
              </span>
              <h2>Tuyển Chọn Đồ Uống Trứ Danh</h2>
            </div>
            <div className="tabs">
              {[
                ["all", "Tất cả"],
                ["coffee", "Cà phê"],
                ["milktea", "Trà sữa"],
                ["special", "Đặc sắc"],
              ].map(([id, title]) => (
                <button
                  className={filter === id ? "active" : ""}
                  onClick={() => setFilter(id)}
                  key={id}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
          <div className="product-grid">
            {shown.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="tag">
                    {product.id === 4 || product.id === 8
                      ? "Mới ra mắt"
                      : "Best seller"}
                  </span>
                  <span className="rating">
                    ★ 4.9 <small>(1.2k)</small>
                  </span>
                </div>
                <div className="product-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                  <div className="product-bottom">
                    <span>
                      <small>Giá từ</small>
                      <strong>{product.price}</strong>
                    </span>
                    <button onClick={() => setSelected(product)}>
                      ＋ Thêm
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="story-section">
          <div className="story-images">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=85"
              alt="Pha cà phê thủ công"
            />
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=85"
              alt="Không gian quán"
            />
          </div>
          <div className="story-copy">
            <small>✓ TRIẾT LÝ PHA CHẾ THỦ CÔNG</small>
            <h2>Tôn vinh hạt ngọc đất mẹ và nghệ thuật thưởng trà đương đại</h2>
            <p>
              Tại Velvet & Brew, chúng tôi không phục vụ món đồ uống đóng sẵn.
              Từng giọt cà phê được chắt lọc qua phin mộc hoặc máy nén áp suất
              chuẩn Ý, từng búp trà Oolong được ủ nở ở nhiệt độ 88°C để giữ trọn
              tầng hương thanh khiết nhất.
            </p>
            <div className="coupon">
              <span>🎁</span>
              <div>
                <strong>MUA 2 TẶNG 1 HÔM NAY</strong>
                <small>Áp dụng cho dòng Cà phê phin & Trà Oolong</small>
              </div>
              <button
                onClick={() => navigator.clipboard?.writeText("VELVETNEW")}
              >
                Lấy mã: VELVETNEW
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div>
          <strong>Velvet & Brew</strong>
          <p>Cà phê và trà thủ công, giao tận nơi với tất cả sự chăm chút.</p>
        </div>
        <div>
          <b>Khám phá</b>
          <a href="#menu-grid">Thực đơn</a>
          <a href="#categories-section">Danh mục</a>
        </div>
        <div>
          <b>Liên hệ</b>
          <span>📍 24 Nguyễn Huệ, Đà Lạt</span>
          <span>☎ 0909 888 999</span>
        </div>
        <small>© 2024 Velvet & Brew. Crafted with care.</small>
      </footer>
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>
              ×
            </button>
            <div className="modal-product">
              <img src={selected.image} alt={selected.name} />
              <div>
                <span className="tag">BEST SELLER</span>
                <h2>{selected.name}</h2>
                <p>{selected.description}</p>
                <strong>{money(customTotal)}</strong>
              </div>
            </div>
            <Choice title="1. Chọn kích cỡ">
              <div>
                {[
                  ["Size S", 0],
                  ["Size M", 6000],
                  ["Size L", 12000],
                ].map(([label, value]) => (
                  <button
                    className={custom.size === value ? "active" : ""}
                    onClick={() => setCustom({ ...custom, size: value })}
                    key={label}
                  >
                    {label}
                    <small>{value ? `+${money(value)}` : "Tiêu chuẩn"}</small>
                  </button>
                ))}
              </div>
            </Choice>
            <Choice title="2. Độ ngọt">
              <div className="compact">
                {["0%", "30%", "50%", "70%", "100%"].map((value) => (
                  <button
                    className={custom.sugar === value ? "active" : ""}
                    onClick={() => setCustom({ ...custom, sugar: value })}
                    key={value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </Choice>
            <Choice title="3. Lượng đá">
              <div className="compact">
                {["Không đá", "Ít đá", "Chuẩn", "Nhiều đá"].map((value) => (
                  <button
                    className={custom.ice === value ? "active" : ""}
                    onClick={() => setCustom({ ...custom, ice: value })}
                    key={value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </Choice>
            <Choice title="4. Thêm topping">
              <div className="toppings">
                {[
                  ["Trân châu đen mật mía", 5000],
                  ["Trân châu hoàng kim dai giòn", 7000],
                  ["Kem Cheese dẻo", 10000],
                ].map(([label, price]) => (
                  <label key={label}>
                    <input
                      type="checkbox"
                      onChange={(event) =>
                        setCustom({
                          ...custom,
                          toppings: event.target.checked
                            ? [...custom.toppings, { label, price }]
                            : custom.toppings.filter(
                                (item) => item.label !== label,
                              ),
                        })
                      }
                    />
                    {label}
                    <strong>+{money(price)}</strong>
                  </label>
                ))}
              </div>
            </Choice>
            <button className="add-modal" onClick={() => addToCart(selected)}>
              Thêm vào giỏ · {money(customTotal)}
            </button>
          </div>
        </div>
      )}
      {drawer && (
        <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
          <aside
            className="drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="close" onClick={() => setDrawer(false)}>
              ×
            </button>
            <h2>
              Giỏ hàng <span>{count} món</span>
            </h2>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.price}</span>
                  <div className="quantity">
                    <button onClick={() => changeQuantity(item.id, -1)}>
                      −
                    </button>
                    {item.quantity}
                    <button onClick={() => changeQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="drawer-total">
              <span>Tạm tính</span>
              <b>{money(subtotal)}</b>
              <span>Phí giao hàng</span>
              <b className="free">Miễn phí</b>
              <hr />
              <strong>Tổng cộng</strong>
              <strong>{money(subtotal)}</strong>
            </div>
            <button className="checkout">Tiến hành thanh toán →</button>
          </aside>
        </div>
      )}
    </div>
  );
}

function Choice({ title, children }) {
  return (
    <div className="choice">
      <b>{title}</b>
      {children}
    </div>
  );
}
export default App;
