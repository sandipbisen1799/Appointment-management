import express from "express";

import { auth } from "../middlewares/auth.midddleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createService, addSlot, getAllAppointments, deleteSlot, getAllSlots, getService, getDaySlot, updateSlot ,approveAppointment,rejectAppointment ,getnewlyAppointments ,deleteService, updateService, getOrder, getApproveAppointments, sendAllEmailController } from "../controllers/admin.controller.js";

const router = express.Router();
router.get ('/appointments', auth, authorize("admin"), getAllAppointments);
router.get ('/approveappointments', auth, authorize("admin"), getApproveAppointments);
router.get ('/appointment', auth, authorize("admin"), getnewlyAppointments);
router.post('/createservice',auth,authorize("admin"), createService);
router.get('/getservice', auth, authorize('admin'),getService);
router.delete('/service/:id', auth, authorize('admin'),deleteService);
router.put('/service/:id', auth, authorize('admin'),updateService)
router.post('/createslot',auth,authorize("admin"), addSlot);
router.put('/updateslot/:id',auth,authorize("admin"), updateSlot);
router.delete('/deleteslot/:id',auth,authorize("admin"), deleteSlot);
router.get('/getslots',auth,authorize("admin"), getAllSlots);
router.post('/getdayslot',auth,authorize("admin"), getDaySlot);
router.put('/approve-appointment/:appointmentId',auth,authorize("admin"), approveAppointment)
router.put('/reject-appointment/:appointmentId',auth,authorize("admin"), rejectAppointment);
router.get('/getorder', auth, authorize('admin'), getOrder) ;
router.post('/send-all-email', auth, authorize('admin'), sendAllEmailController);



export default router;