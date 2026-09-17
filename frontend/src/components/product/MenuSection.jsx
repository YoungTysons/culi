import ProductCard from "./ProductCard";

export default function MenuSection({
  products,
  activeFilter,
  onSelectFilter,
  onSelectProduct,
  loading,
}) {
  const tabs = [
    ["all", "Tất cả"],
    ["coffee", "Cà phê"],
    ["milktea", "Trà sữa"],
    ["special", "Đặc sắc"],
  ];

  return (
    <section className="menu-section" id="menu-grid">
      <div className="section-heading menu-heading">
        <div>
          <span className="hot-label">
            ★ MÓN CHẠY NHẤT · YÊU THÍCH NHẤT THÁNG
          </span>
          <h2>Tuyển Chọn Đồ Uống Trứ Danh</h2>
        </div>
        <div className="tabs">
          {tabs.map(([id, title]) => (
            <button
              className={activeFilter === id ? "active" : ""}
              onClick={() => onSelectFilter(id)}
              key={id}
            >
              {title}
            </button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {loading ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px" }}>
            Đang tải thực đơn...
          </p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px" }}>
            Chưa có sản phẩm nào trong danh mục này.
          </p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))
        )}
      </div>
    </section>
  );
}
