import express from "express"
const router = express.Router()

import { createToken } from "../controller/jwtController.js";
import { verifyToken } from "../controller/jwtController.js";
router.post("/createtoken", (req, res, next) => {
  console.log("HIT /api/jwt/createtoken");
  next();
}, createToken);
router.post("/verifytoken", verifyToken)
export default router