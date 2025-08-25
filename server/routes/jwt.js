import express from "express"
const router = express.Router()

import { createToken } from "../controller/jwtController";
import { verifyToken } from "../controller/jwtController";
router.post("/createtoken", createToken);
router.post("/verifytoken", verifyToken)
export default router