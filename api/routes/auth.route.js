import express from "express";
import { googleController, signOutController, signinController, signupController, } from "../controllers/auth.controller.js";

const router = express.Router();

//authentication -> post method
router.post("/signup",signupController);
router.post("/signin",signinController);
router.post('/google', googleController);
router.get("/signout",signOutController);
export default router;