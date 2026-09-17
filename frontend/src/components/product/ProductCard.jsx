export default function ProductCard({ product, onSelectProduct }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <span className="tag">
          {product.isBestSeller || product.id === 1
            ? "Best seller"
            : product.id === 4 || product.id === 8
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
          <button onClick={() => onSelectProduct(product)}>
            ＋ Thêm
          </button>
        </div>
      </div>
    </article>
  );
}
