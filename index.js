const express = require("express");
const app = express();
const dotenv = require("dotenv");

const cors = require("cors");
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");
const { verifyToken } = require("./middleware/auth.middleware");

dotenv.config();

async function main() {
  //Connect to database
  await connectDB();

  //MIDDLEWARE
  app.use(express.json());

  // allow CORS for local development (for production, you should configure it properly)
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  const productRoutes = require("./routes/product.route");
  app.use("/api/product", productRoutes);

  const authRoutes = require("./routes/auth.route");
  const protectedRoutes = require("./routes/protected.route");
  const userRoutes = require("./routes/user.route");

  app.use("/api/auth", authRoutes);
  app.use("/api/protected", verifyToken, protectedRoutes);
  app.use("/api/user", userRoutes);

  // START SERVER
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
main();
