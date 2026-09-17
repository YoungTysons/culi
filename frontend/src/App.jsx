import { useState, useEffect, useMemo } from "react";
import "./App.css";

import { fetchProducts } from "./api/productApi";
// 1. Dữ liệu mẫu (Mock data)

import { mockProducts } from "./constants/mockProducts";

// 2. Components chia theo nhóm chức năng
import Header from "./components/layout/Header";
import Notice from "./components/layout/Notice";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import StorySection from "./components/home/StorySection";
import CategorySection from "./components/product/CategorySection";
import MenuSection from "./components/product/MenuSection";
import ProductModal from "./components/product/ProductModal";
import CartDrawer from "./components/cart/CartDrawer";

function App() {
  // Dữ liệu sản phẩm mẫu
  const [products, setProducts] = useState(mockProducts);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [cart, setCart] = useState([
    { ...mockProducts[0], quantity: 1 },
  ]);
  const [custom, setCustom] = useState({
    size: 0,
    sugar: "70%",
    ice: "Chuẩn",
    toppings: [],
  });
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
      })
  }, []);
  const shown = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((item) => item.category === filter),
    [filter, products],
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product) => {
    if (!product) return;
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

  const changeQuantity = (id, change) => {
    setCart((current) =>
      current.flatMap((item) =>
        item.id === id && item.quantity + change < 1
          ? []
          : item.id === id
            ? [{ ...item, quantity: item.quantity + change }]
            : [item],
      ),
    );
  };

  return (
    <div className="app-shell">
      {/* Phần đầu trang */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setDrawer(true)}
      />

      {/* Nội dung chính */}
      <main id="top">
        <Notice />
        <Hero
          featuredProduct={products[0]}
          onAddToCart={addToCart}
        />
        <CategorySection
          activeFilter={filter}
          onSelectFilter={setFilter}
        />
        <MenuSection
          products={shown}
          activeFilter={filter}
          onSelectFilter={setFilter}
          onSelectProduct={setSelected}
        />
        <StorySection />
      </main>

      {/* Chân trang */}
      <Footer />

      {/* Popup tùy chỉnh món */}
      <ProductModal
        product={selected}
        custom={custom}
        setCustom={setCustom}
        onClose={() => setSelected(null)}
        onAddToCart={addToCart}
      />

      {/* Ngăn kéo giỏ hàng */}
      <CartDrawer
        isOpen={drawer}
        cart={cart}
        onClose={() => setDrawer(false)}
        onChangeQuantity={changeQuantity}
      />
    </div>
  );
}

export default App;
