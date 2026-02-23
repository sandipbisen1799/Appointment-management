import express from "express";
import { register,login ,logout ,createAdmin , fetchUser, setting,blockAdmin ,unBlockAdmin ,fetchAdmin ,fetchProfile, getSetting} from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { auth } from "../middlewares/auth.midddleware.js";
const router = express.Router();


router.post('/register', register );
router.post('/login', login );
router.post('/logout', logout );
router.get('/me',auth, fetchUser );
router.get('/profile',auth, fetchProfile );
router.post('/setting',auth, setting );
router.get('/getSetting',auth, getSetting );

router.post('/create' ,auth, authorize("superadmin"), createAdmin);
router.get('/admin',auth, authorize("superadmin"), fetchAdmin );
router.put('/block/:id' ,auth, authorize("superadmin"),blockAdmin );
router.put('/unblock/:id' ,auth, authorize("superadmin"),unBlockAdmin );

export default router;