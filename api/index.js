import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js"
import cors from 'cors';

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
app.use(cookieParser());
app.use(cors());

app.listen(3000, () => {
  console.log(`server is running on port 3000!`);
});

//ROUTES
app.use("/api/user", userRouter);
/*  -> http://localhost:3000/api/user/update/:id 
    -> http://localhost:3000/api/user/delete/:id 
    -> http://localhost:3000/api/user/listings/:id 
*/
app.use("/api/auth", authRouter);
/* -> http://localhost:3000/api/auth/signup 
    -> http://localhost:3000/api/auth/signin
    -> http://localhost:3000/api/auth/google
    -> http://localhost:3000/api/auth/signout
 */
app.use("/api/listing", listingRouter);
/*  -> http://localhost:3000/api/listing/create
    -> http://localhost:3000/api/listing/delete/:id
    -> http://localhost:3000/api/listing/update/:id
    -> http://localhost:3000/api/listing/get/:id
 */

//MIDDLEWARES

//middleware for error handler function works
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
