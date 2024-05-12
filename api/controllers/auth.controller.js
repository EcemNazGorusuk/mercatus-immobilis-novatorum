import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signupController = async (req, res, next) => {
  console.log("signup request : ", req.body);

  const { username, email, password } = req.body;
  //hash password
  const hashedPassword = await bcryptjs.hashSync(password, 12);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("user created successfully!"); //201-> created
  } catch (error) {
    //res.status(500).json(error.message); //500-> error
    next(errorHandler(500,error.message));
  }
};
