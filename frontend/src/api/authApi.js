
// import { getAddress } from "../../../backend/src/controllers/userController";
import axiosClient from "./axiosClient";

const authApi = {
  register: async (data) => {
    return await axiosClient.post("/auth/register", data);
  },
  login: async (data) => {
    return await axiosClient.post("/auth/login", data);
  },
  getProfile: async () => {
    return await axiosClient.get("/auth/profile");
  },
  updateProfile: async (data) => {
    return await axiosClient.put("/auth/profile", data);
  },
  googleLogin: async(data)=>{
    return await axiosClient.post("/auth/google",data);
  },
    // Lấy danh sách toàn bộ địa chỉ của user hiện tại
  getAddress: async () => {
    return await axiosClient.get("/auth/address");
  },
  createAddress: async (data) => {
    return await axiosClient.post("/auth/address/create", data);
  },
  updateAddress: async (addressId, data) => {
    return await axiosClient.put(`/auth/address/${addressId}`, data);
  },
  deleteAddress: async (addressId) => {
    return await axiosClient.delete(`/auth/address/${addressId}`);
  },

};

export default authApi;
export { authApi };