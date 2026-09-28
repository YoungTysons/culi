const requireAdmin =(req,res,next)=>{
    if(!req.user){
        return res.status(401).json({
            success: false,
            massage: "vui long dang nhap"
        });
    }
    if(req.user!=="admin"){
        return res.status(403).json({
            success: false,
            massage: "ban khong co quyen admin"
        });
    }
    next();
};
module.exports =requireAdmin;