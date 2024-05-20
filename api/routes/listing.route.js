import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//attention: controllers need to authorized before all listing process 
router.post('/create',verifyToken,createListing);



export default router;