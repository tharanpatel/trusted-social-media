import express from "express";
import { getAllUsers, getUser, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/find/allUsers", getAllUsers)
router.get("/find/:userId", getUser)
router.put("/", updateUser)


export default router