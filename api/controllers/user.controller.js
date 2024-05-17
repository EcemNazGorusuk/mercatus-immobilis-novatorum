import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";


//UPDATE USER
export const updateUserController = async (req, res, next) => {
  //req.params.id ----> router.post("/update/:id",verifyUserToken,updateUserController)
  //req.user.id   ----> jwt verify in verifyUser.js
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      //bcrypt password
      req.body.password = bcryptjs.hashSync(req.body.password, 12);
    }

    //update user&save
     //set ile diğer user parametreleri de değişse değişmese de update olabilsin
     const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            photoURL: req.body.photoURL,
          },
        },
        { new: true }
      );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
