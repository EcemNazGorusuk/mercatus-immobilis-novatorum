import express from "express";
import { createListing, deleteListing, updateListing ,getListing} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

//attention: controllers need to authorized before all listing process 
router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing)
router.post('/update/:id',verifyToken,updateListing)
router.get('/get/:id',getListing)

export default router;
