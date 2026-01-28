import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const register = async (req,res)=>{
    try {
        const {name, email, password, accountType}= req.body;
        if(!name || !email || !password || !accountType){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(409).json({
                success:false,
                message:"user alredy exists"
            })
            
        }
         const hashedPassword = await bcrypt.hash(password, 10);
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
        return res.status(201).json({
            success:true,
            message:"User registered successfully",
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
