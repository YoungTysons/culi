export default function Hero({ featuredProduct, onAddToCart }) {
  return (
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
          <button
            onClick={() => featuredProduct && onAddToCart(featuredProduct)}
            title="Thêm vào giỏ hàng"
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}
