import axiosClient from "./axiosClient";

export const fetchProducts = async () => {
  try {
    const data = await axiosClient.get("/product");
    if (data.success && Array.isArray(data.data)) {
      return data.data.map((item) => ({
        ...item,
        price: `${Number(item.basePrice).toLocaleString("vi-VN")}đ`,
        category: item.category || "coffee",
      }));
    }
    return [];
  } catch (error) {
    console.error("Lỗi fetchProducts:", error);
    return [];
  }
};

export const getProducts = fetchProducts;

export const getProductById = (id) => {
  return axiosClient.get(`/product/${id}`);
};
