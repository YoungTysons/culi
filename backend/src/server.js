const express = require("express");
const cors = require("cors");
const productRouter = require("./routes/productRouter");
const userRoutes = require("./routes/userRoutes");
const prisma = require("./config/db");

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/product", productRouter);
app.use("/api/auth", userRoutes);

// Lắng nghe cổng (đặt ở cuối)
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully! (MySQL: cafe_db)");
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
    }
});

