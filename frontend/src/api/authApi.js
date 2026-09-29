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
};

export default authApi;
export { authApi };