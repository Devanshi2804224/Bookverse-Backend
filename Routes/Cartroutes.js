import express from "express";
import protect from "../Middleware/Auth.js";
import { addToCart } from "../Controller/Cartcontroller.js";

const router = express.Router();
router.post("/add", protect, addToCart);
export default router;
