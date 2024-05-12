import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

dotenv.config();
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDb!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();


app.listen(3000, () => {
  console.log(`server is running on port 3000!!`);
});



//ROUTES
app.use('/api/user',userRouter) //-> http://localhost:3000/api/user/test