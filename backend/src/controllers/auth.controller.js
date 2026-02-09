import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import{ generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import AppointmentForm from "../models/appointementform.model.js";

export const register = async (req,res)=>{
    try {
        const {name, email, password}= req.body;
        if(!name || !email || !password ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const existinguser = await User.findOne({ $or: [
    { email: email },
    { name: name },        
  ]});
        if(existinguser){
            return res.status(409).json({
                success:false,
                message:"user allready exists"
            })
            
        }
         const hashedPassword = await bcrypt.hash(password, 10);
         const accountType = 'admin';
        const user= await  User.create({
            name,
            email,
            password: hashedPassword,
            accountType
        });
            const token = generateToken({
      _id: user._id,
      accountType: user.accountType,
    });

        await user.save();
        return res.cookie("token", token, {
    
             httpOnly: true,
  secure: true,        // ⭐ REQUIRED on HTTPS (Vercel)
  sameSite: "none", 
            maxAge: 24 * 60 * 60 * 1000,
        }).status(201).json({
            success:true,
            message:"admin registered successfully",
            user:user,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in registering user",

        })
    }
}
export const login = async (req,res)=>{
    try {
        const {email,password}= req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        if(user.isblock){
            return res.status(403).json({
                success:false,
                message:"user is blocked, contact superadmin"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token = generateToken({
        _id: user._id,
        accountType: user.accountType,
    });
    if(user.accountType == 'admin'){
        return res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        }).status(200).json({
            success:true,
            message:"admin logged in successfully",
            user:user,
            token
        })}
        else if(user.accountType == 'superadmin'){
               return res.cookie("token", token, {
              sameSite:'none'  ,
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        }).status(200).json({
            success:true,
            message:"superadmin logged in successfully",
            user:user,
            token
        })}

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in logging in user"
        })
    }
}
export const logout =  async(req, res) => {
     res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(200).json({
    success: true,
    message: "logout successfuly",
  });
};
export const fetchUser = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        return res.status(200).json({
            success:true,
            user:user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in fetching user"
        })
    }
}

export const createAdmin = async (req,res)=>{
    try{
        const {name,email,password}= req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(409).json({
                success:false,
                message:"user already exists"
            })
        }
            const hashedPassword = await bcrypt.hash(password, 10);
        const accountType = 'admin';
        const user= await  User.create({
            name,
            email,
            password: hashedPassword,
            accountType
        });
        return res.status(201).json({
            success:true,
            message:"admin created successfully",
            user:user
        }); }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in creating admin"
        })
    }
}
export const fetchAdmin = async (req, res) => {
  try {
    const admins = await User.aggregate([
      {
        $match: { accountType: "admin" }
      },
      {
        $lookup: {
          from: "appointmentforms", // collection name (IMPORTANT)
          localField: "_id",
          foreignField: "admin",
          as: "appointments"
        }
      },
      {
        $addFields: {
          appointmentCount: { $size: "$appointments" }
        }
      },
      {
        $project: {
          password: 0,
          appointments: 0
        }
      }
    ]);
    const appointments = await AppointmentForm.find();

    return res.status(200).json({
      success: true,
      admins,
      appointments
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching admin dashboard data"
    });
  }
};

export const blockAdmin = async (req,res)=>{
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isblock: true }, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User blocked successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in blocking user"
        });

    }
}
export const unBlockAdmin = async (req,res)=>{
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isblock: false }, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User unblocked successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in unblocking user"
        });
        
    }
}