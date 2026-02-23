import express from "express";
import { createOrder, verifyPayment, handlePaymentFailure } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.post("/failed", handlePaymentFailure);

export default router;
