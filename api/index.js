import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDb!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log(`server is running on port 3000!`);
});

//ROUTES
app.use("/api/user", userRouter); //-> http://localhost:3000/api/user/test
app.use("/api/auth", authRouter); //-> http://localhost:3000/api/auth/signup && http://localhost:3000/api/auth/signin

//MIDDLEWARES

//middleware for error handler function works
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
