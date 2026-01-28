import AppointmentForm from "../models/appointementform.model.js";
import Service from "../models/service.model.js";
import Slot from "../models/slot.model.js";
import getTimeSlot from "../utils/getTimeslot.js";
export const createService = async (req,res)=>{
    try {
        const {serviceName, description}= req.body;
        if(!serviceName  ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const admin = req.user._id;
        const service= await  Service.create({
            serviceName,
            description,
            admin
        });
        await service.save();
        return res.status(201).json({
            success:true,
            message:"service created successfully",
            service:service
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in creating service",
        })
    }
}

export const addSlot = async (req, res) => {
  try {
    const { date, startTime,  } = req.body;
    if (!date || !startTime  ) {
        return res.status(400).json({

            success: false,
            message: "All fields are required",
        });
    }  
    const admin = req.user._id; 
  const { startTimes, endTimes } = getTimeSlot(startTime);
console.log(startTimes, endTimes);
//     if(endTime == 13){
//         endTime = 1;
//     }
//     else if(endTime == 14){
//        startTime =1
//         endTime = 2;
//     }
//     else if(endTime == 15){
//         endTime = 3;
//         startTime =2
//     }
//    else if(endTime == 16){
//         endTime = 4;
//         startTime =3
//     }
//     else if(endTime == 17){
//         endTime = 5;
//         startTime =4
//     }
//     else if(endTime == 18){
//         endTime = 6;
//         startTime =5
//     }
//    else if(endTime == 19){
//         startTime =6
//         endTime = 7;
//     }
//     else if(endTime == 20){
//         endTime = 8;
//         startTime =7
//     }
//    else if(endTime == 21){
//         endTime = 9;
//         startTime =8
//     }
//     else if(endTime == 22){
//         endTime = 10;
//         startTime =9
//     }
//     else if(endTime == 23){
//         endTime = 11;
//         startTime =10
//     }
//        else if(endTime == 24){
//         startTime =11
//         endTime = 12;
//     }
//     else if(endTime == 25){
//         endTime = 1;
//         startTime =
//     }
//    else if(endTime == 16){
//         endTime = 9;
//         startTime =8
//     }
//     else if(endTime == 17){
//         endTime = 10;
//         startTime =9
//     }
//     else if(endTime == 18){
//         endTime = 11;
//         startTime =10
//     }

    const slot = await Slot.create({
      date,
      startTime: startTimes,
        endTime: endTimes,
        admin
    });
    await slot.save();
    return res.status(201).json({
      success: true,
        message: "Slot created successfully",
        slot: slot,
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in creating slot",
        });
    }
};
export const  deleteSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const slot = await Slot.findByIdAndDelete(id);
        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Slot deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({

            success: false,
            message: "Error in deleting slot",
        });
    }   
};

export const getAllSlots = async (req,res)=>{
    try {
        const slots = await Slot.find({ admin: req.user._id});
        if (!slots) {
            return res.status(404).json({
                success: false,
                message: "No slots found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Slots fetched successfully",
            slots: slots
        });
    } catch (error) {
        
    }
}

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await AppointmentForm.find({});
        if (!appointments) {
            return res.status(404).json({
                success: false,
                message: "No appointments found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            appointments: appointments
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching appointments",
        });
    }   
};


