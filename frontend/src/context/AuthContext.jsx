import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khởi động: Kiểm tra token trong localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.getProfile();
        if (res && res.success && res.data) {
          setUser(res.data);
        } else if (res && res.id) {
          setUser(res);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.warn("Phiên đăng nhập đã hết hạn:", error.message);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Đăng nhập
  const login = async (account, password) => {
    try {
      const res = await authApi.login({ account, password });
      if (res && res.success && res.token) {
        localStorage.setItem("token", res.token);
        setUser(res.user);
        return { success: true, message: res.message || "Đăng nhập thành công" };
      }
      return {
        success: false,
        message: res.message || "Đăng nhập không thành công",
      };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Không thể kết nối đến máy chủ";
      return { success: false, message: msg };
    }
  };

  // Đăng ký
  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      if (res && res.success) {
        return {
          success: true,
          message: res.message || "Đăng ký tài khoản thành công!",
        };
      }
      return {
        success: false,
        message: res.message || "Đăng ký không thành công",
      };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Đăng ký thất bại, vui lòng thử lại";
      return { success: false, message: msg };
    }
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Cập nhật thông tin user trong state
  const updateUser = async (newData) => {
    try {
      const res = await authApi.updateProfile(newData);
      if (res && res.success) {
        const updated = res.user || newData;
        setUser((prev) => (prev ? { ...prev, ...updated } : updated)); // ✅ Thêm ngoặc tròn bọc ngoài

        return { success: true, message: res.message }
      }
      return { success: false, message: res.message || "Không thể cập nhật profile" }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Không thể kết nối đến máy chủ"
      return { success: false, message: msg }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
