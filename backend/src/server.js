const express = require("express");
const cors = require("cors");
const productRouter = require("./routes/productRouter");

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/product", productRouter);

// Lắng nghe cổng (đặt ở cuối)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
