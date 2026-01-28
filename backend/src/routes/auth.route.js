import express from "express";
import { register,login ,logout ,createAdmin ,blockAdmin ,unBlockAdmin } from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { auth } from "../middlewares/auth.midddleware.js";
const router = express.Router();


router.post('/register', register );
router.post('/login', login );
router.post('/logout', logout );
router.get('/me',auth, (req,res)=>{
    return res.status(200).json({
        success:true,
        message:"User fetched successfully",
        user:req.user
    });
});

router.post('/create' ,auth, authorize("superadmin"), createAdmin);
router.put('/block/:id' ,auth, authorize("superadmin"),blockAdmin );
router.put('/unblock/:id' ,auth, authorize("superadmin"),unBlockAdmin );

export default router;