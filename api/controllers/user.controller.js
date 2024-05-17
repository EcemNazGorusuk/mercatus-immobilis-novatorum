import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

//UPDATE USER
export const updateUserController = async (req, res, next) => {
  //req.params.id ----> router.post("/update/:id",verifyUserToken,updateUserController)
  //req.user.id   ----> jwt verify in verifyUser.js
  if (req.user.id !== req.params.id)
    //token control
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      //bcrypt password
      req.body.password = bcryptjs.hashSync(req.body.password, 12);
    }

    //update user&save
    //With set, other user parameters can be updated regardless of whether they change or not
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



//DELETE USER
export const deleteUserController = async (req, res, next) => {
  //req.params.id ----> router.post("/delete/:id",verifyToken,deleteUserController)
  //req.user.id   ----> jwt verify in verifyUser.js
  if (req.user.id !== req.params.id)
    //token control
    return next(errorHandler(401, "You can only delete your own account!"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token'); //need it
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};
