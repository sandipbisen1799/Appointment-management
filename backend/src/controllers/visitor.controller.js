import User from "../models/user.model.js";
import Slot from "../models/slot.model.js";
import Service from "../models/service.model.js";
import Appointment from "../models/appointementform.model.js";

// export const getAllAdmin = async (req,res)=>{
//     try {
//         const admins = await User.find({accountType:"admin"}).select("-password").select("-accountType").select("-isblock").select("-email");
//         return res.status(200).json({
//             success:true,
//             admins:admins
//         })
        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Error in fetching admins"
//         })

//     }
// }


export const  getAvailableServices = async (req, res) => {
    try {

        const { id } = req.params;
        console.log(id);
        const admin = await User.findOne({name: id});
        if(!admin){
            return res.status(400).json({
                success:false,
                message:"service provider not found"
            })
        }

        const services = await Service.find({admin : admin._id});
        return res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            services: services
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching services",
        });
    }
};
export const bookAppointment = async (req, res) => {
    try {
        const { date, serviceId, slotId, } = req.body;
        const { id } = req.params;
        const admin = await User.findOne({name: id});
        if(!admin){
            return res.status(400).json({
                success:false,  
                message:"admin not found"
            })
        }




        if (!serviceId || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
    
        const appointment = await Appointment.create({
            date,
            service: serviceId,

            slot: slotId,
            admin: admin._id,
            
        });
        await appointment.save();
        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment: appointment,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in booking appointment",
        });
    }
};
export const getAvailableSlots = async (req, res) => {
    try {
        const { id } = req.params;
        const { date2 } = req.query;
        console.log(id);
        const admin = await User.findOne({name: id});

        if(!admin){
            return res.status(400).json({   
                success:false,
                message:"service provider not found"
            })
        }

        
        if (!date2) {
            return res.status(400).json({
                success: false,
                message: "Date is required",
            });
        }
        
        const date1 = new Date(date2);
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayName = days[date1.getDay()];
       console.log(dayName);

        const slots = await Slot.find({ admin: admin._id,date :dayName});
        console.log(slots);
        return res.status(200).json({
            success: true,
            message: "Slots fetched successfully",
            slots: slots,
            dayName
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching slots",
        });
    }
};