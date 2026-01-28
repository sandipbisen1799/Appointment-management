import express from "express";
import { getAvailableServices, bookAppointment ,getAvailableSlots } from "../controllers/visitor.controller.js";

const router = express.Router();
router.get('/slots/:id',getAvailableSlots)
router.get('/services/:id', getAvailableServices);
router.post('/book/:id', bookAppointment);


export default router;