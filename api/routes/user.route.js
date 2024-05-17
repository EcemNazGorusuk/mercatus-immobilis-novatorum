import express from "express";
import {verifyToken} from "../utils/verifyUser.js";
import { deleteUserController, updateUserController ,} from "../controllers/user.controller.js";


const router = express.Router();
//before all crud operations, we need to control user is authenticate successfully -verifyUser.js
router.post("/update/:id",verifyToken,updateUserController) //for updating user
router.delete("/delete/:id",verifyToken,deleteUserController) //for deleting user


export default router;
