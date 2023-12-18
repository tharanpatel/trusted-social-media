import express from "express";
import { getTotalTrusts, addTotalTrust, deleteTotalTrust, getAllTotalTrusts, updateTotalTrust } from "../controllers/totalTrust.js";

const router = express.Router();

router.get("/all/", getAllTotalTrusts)
router.get("/", getTotalTrusts)
router.post("/", addTotalTrust)
router.put("/", updateTotalTrust)
router.delete("/", deleteTotalTrust)


export default router