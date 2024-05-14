import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//register
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
    next(errorHandler(500, error.message));
  }
};

//login
export const signinController = async (req, res, next) => {
  console.log("signin request : ", req.body);

  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email }); //Check user exists.
    //can access this property like this-> validUser.email || validUser.password

    if (!validUser) {
      return next(errorHandler(404, "User not found!")); //404-> not found
    }
    //hash & compare password
    const hashedValidPassword =  bcryptjs.compareSync(
      password,
      validUser.password
    );

    if (!hashedValidPassword) {
      return next(errorHandler(401, "Wrong credential - invalid password!")); //401-> not match || invalid
    }
    //token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    //hide bcrypted password after post process 
    const { password: pass, ...rest } = validUser._doc;
    //generate cookie
    res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);

  } catch (error) {
    next(errorHandler(500, error.message)); //500-> error
  }
};
