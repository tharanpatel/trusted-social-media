import express from "express";
import { getPositiveTrusts, addPositiveTrust, deletePositiveTrust, getAllPositiveTrusts } from "../controllers/positiveTrust.js";

const router = express.Router();

router.get("/all/", getAllPositiveTrusts)
router.get("/", getPositiveTrusts)
router.post("/", addPositiveTrust)
router.delete("/", deletePositiveTrust)


export default router