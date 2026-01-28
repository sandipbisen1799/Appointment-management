import express from "express";

import { auth } from "../middlewares/auth.midddleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createService ,addSlot ,getAllAppointments ,deleteSlot,getAllSlots} from "../controllers/admin.controller.js";

const router = express.Router();
router.get ('/get/appointments', auth, authorize("admin"), getAllAppointments);
router.post('/service',auth,authorize("admin"), createService);
router.post('/slot',auth,authorize("admin"), addSlot);
router.delete('/deleteslot/:id',auth,authorize("admin"), deleteSlot);
router.get('/getslots',auth,authorize("admin"), getAllSlots);

export default router;