import axiosClient from "./axiosClient";

const orderApi = {
  createOrder: (data) => {
    return axiosClient.post("/orders", data);
  },
  getMyOrders: (params) => {
    return axiosClient.get("/orders/my-orders", { params });
  },
  getAllOrders: (params) => {
    return axiosClient.get("/orders", { params });
  },
  updateOrderStatus: (id, status) => {
    return axiosClient.put(`/orders/${id}/status`, { status });
  },
  cancelOrder: (id) => {
    return axiosClient.put(`/orders/${id}/cancel`);
  },
};

export default orderApi;

