import { categories } from "../../constants/categories";

export default function CategorySection({ activeFilter, onSelectFilter }) {
  return (
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
            className={activeFilter === id ? "selected" : ""}
            key={id}
            onClick={() => {
              onSelectFilter(id);
              document
                .querySelector("#menu-grid")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>{icon}</span>
            <strong>{title}</strong>
            <small>{desc}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
