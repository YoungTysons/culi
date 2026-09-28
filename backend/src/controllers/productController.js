const prisma = require('../config/db');
exports.getAllProduct= async (req,res)=>{
    try {
        const { category } = req.query;
        const where = { isActive: true };
        if (category && category !== "all") {
            where.category = category;
        }

        const products=await prisma.product.findMany({
            where,
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
exports.getById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { sizes: true, toppings: { include: { topping: true } } }
        });
        if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
