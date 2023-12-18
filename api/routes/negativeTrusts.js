import express from "express";
import { getNegativeTrusts, addNegativeTrust, deleteNegativeTrust, getAllNegativeTrusts } from "../controllers/negativeTrust.js";

const router = express.Router();

router.get("/all/", getAllNegativeTrusts)
router.get("/", getNegativeTrusts)
router.post("/", addNegativeTrust)
router.delete("/", deleteNegativeTrust)


export default router