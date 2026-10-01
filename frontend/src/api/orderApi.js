import axiosClient from "./axiosClient";

const orderApi = {
  createOrder: (data) => {
    return axiosClient.post("/orders", data);
  },
  getMyOrders: (params) => {
    return axiosClient.get("/orders/my-orders", { params });
  },
  cancelOrder: (id) => {
    return axiosClient.put(`/orders/${id}/cancel`);
  },
};

export default orderApi;

