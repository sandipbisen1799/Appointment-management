import express from "express";

import { auth } from "../middlewares/auth.midddleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createService, addSlot, getAllAppointments, deleteSlot, getAllSlots, getService, getDaySlot, updateSlot ,approveAppointment,rejectAppointment } from "../controllers/admin.controller.js";

const router = express.Router();
router.get ('/appointments', auth, authorize("admin"), getAllAppointments);
router.post('/createservice',auth,authorize("admin"), createService);
router.get('/getservice', auth, authorize('admin'),getService)
router.post('/createslot',auth,authorize("admin"), addSlot);
router.put('/updateslot/:id',auth,authorize("admin"), updateSlot);
router.delete('/deleteslot/:id',auth,authorize("admin"), deleteSlot);
router.get('/getslots',auth,authorize("admin"), getAllSlots);
router.post('/getdayslot',auth,authorize("admin"), getDaySlot);
router.put('/approve-appointment/:appointmentId',auth,authorize("admin"), approveAppointment)
router.put('/reject-appointment/:appointmentId',auth,authorize("admin"), rejectAppointment);



export default router;