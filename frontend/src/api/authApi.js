import axiosClient from "./axiosClient";
const authApi={
    register:async(data)=>{
        const res=await axiosClient.post('/auth/register',data)
        return res.data
    },
    login:async(data)=>{
        const res=await axiosClient.post('/auth/login',data)
        return res.data
    },
    getProfile:async()=>{
        const res=await axiosClient.get('/auth/profile')
        return res.data
    }
}