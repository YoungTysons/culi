import { useState, useEffect, useMemo } from "react";
import "./App.css";

import { fetchProducts } from "./api/productApi";
import { mockProducts } from "./constants/mockProducts";

import Header from "./components/layout/Header";
import Notice from "./components/layout/Notice";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import StorySection from "./components/home/StorySection";
import CategorySection from "./components/product/CategorySection";
import MenuSection from "./components/product/MenuSection";
import ProductModal from "./components/product/ProductModal";
import CartDrawer from "./components/cart/CartDrawer";
import AuthModal from "./components/auth/AuthModal";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CheckoutModal from "./components/checkout/CheckoutModal";
import AdminDashboard from "./components/admin/AdminDashboard";

function MainApp() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState(
    window.location.hash === "#admin"
      ? "admin"
      : window.location.hash === "#checkout"
        ? "checkout"
        : "store"
  );
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // Dữ liệu sản phẩm mẫu
  const [products, setProducts] = useState(mockProducts);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
      });
  }, []);

  const shown = useMemo(() => {
    let list = products;
    if (filter !== "all") {
      list = list.filter((item) => item.category === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, products, searchQuery]);

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

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#admin") {
        setCurrentView("admin");
      } else if (window.location.hash === "#checkout") {
        setCurrentView("checkout");
      } else {
        setCurrentView("store");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 1. Màn hình chờ khi đang kiểm tra token cũ
  if (loading) {
    return (
      <div className="auth-loading-splash">
        <div className="auth-spinner" />
        <p style={{ fontSize: "15px", letterSpacing: "1px" }}>
          Đang khởi tạo Velvet &amp; Brew...
        </p>
      </div>
    );
  }

  // 2. KHI CHƯA ĐĂNG NHẬP: Bắt buộc hiện giao diện Đăng nhập / Đăng ký (Không vào trang chủ)
 

  // 3. KHI CHUYỂN SANG GIAO DIỆN ADMIN DASHBOARD
  if (currentView === "admin") {
    if (!user) {
      return (
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <h3>Khu vực dành riêng cho Quản trị viên</h3>
          <p>Vui lòng đăng nhập để tiếp tục.</p>
          <button
            className="button primary"
            onClick={() => setAuthModalOpen(true)}
            style={{ marginTop: "1rem" }}
          >
            Đăng nhập ngay
          </button>
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => {
              setAuthModalOpen(false);
              window.location.hash = "";
              setCurrentView("store");
            }}
          />
        </div>
      );
    }if (user.role !== "ADMIN") {
      return (
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <h2 style={{ color: "#dc2626" }}>Truy cập bị từ chối (403)</h2>
          <p>Tài khoản {user.fullName} không có quyền Quản trị viên.</p>
          <button
            className="button primary"
            style={{ marginTop: "1rem" }}
            onClick={() => {
              window.location.hash = "";
              setCurrentView("store");
            }}
          >
            ← Quay về cửa hàng
          </button>
        </div>
      );
    }
    return (
      <AdminDashboard
        user={user}
        onBackToStore={() => {
          window.location.hash = "";
          setCurrentView("store");
        }}
      />
    );
  }

  // 4. KHI CHUYỂN SANG GIAO DIỆN THANH TOÁN (CHECKOUT)
  if (currentView === "checkout" || checkoutOpen) {
    return (
      <CheckoutModal
        isOpen={true}
        cart={cart}
        user={user}
        onClearCart={() => setCart([])}
        onClose={() => {
          setCheckoutOpen(false);
          if (window.location.hash === "#checkout") {
            window.location.hash = "";
          }
          setCurrentView("store");
        }}
        onBackToStore={() => {
          setCheckoutOpen(false);
          if (window.location.hash === "#checkout") {
            window.location.hash = "";
          }
          setCurrentView("store");
        }}
      />
    );
  }

  // 5. KHI Ở GIAO DIỆN MUA HÀNG (STOREFRONT)
  return (
    <div className="app-shell">
      {/* Phần đầu trang */}

      <Header
        cartCount={cartCount}
        onOpenCart={() => setDrawer(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdmin={() => {
          window.location.hash = "admin";
          setCurrentView("admin");
        }}
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
          searchQuery={searchQuery}
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
        onOpenCheckout={() => {
          setDrawer(false);
          setCheckoutOpen(true);
          window.location.hash = "checkout";
          setCurrentView("checkout");
        }}
        onChangeQuantity={changeQuantity}
      />
      {/* Popup đăng nhập / đăng ký */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
    
  );
 
      
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
