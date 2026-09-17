const prisma = require('../config/db');
exports.getAllProduct= async (req,res)=>{
    try {
        const products=await prisma.product.findMany({
            where:{isActive:true},
            include:{
                sizes: true,
                toppings:{
                    include:{ topping:true }
                }
            },
            orderBy:{
                createdAt:'desc' 
            }
        });
        return res.status(200).json({
            success:true,
            data:products
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}