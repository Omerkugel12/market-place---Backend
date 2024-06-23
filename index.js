const express = require("express");
const app = express();

const cors = require("cors");
const PORT = process.env.PORT || 3000;

//MIDDLEWARE
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const productRoutes = require("./routes/product.route");
app.use("/api/product", productRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
