import User from "../models/user.model.js";
import Slot from "../models/slot.model.js";
import Service from "../models/service.model.js";
import Appointment from "../models/appointementform.model.js";

export const getAvailableServices = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const admin = await User.findOne({ name: id });
    console.log(admin);

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "service provider not found",
      });
    }

    const services = await Service.find({ admin: admin._id });
    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      services: services,
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
    const {
      date,
      serviceId,
      slotId,
      email,
      name,
      address,
      city,
      country,
      pincode,
    } = req.body;

    const { id } = req.params;
    const admin = await User.findOne({ name: id });
    
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "admin not found",
      });
    }

    const service = await Service.findById(serviceId).select("price serviceName");
    if (!service) {
      return res.status(400).json({
        success: false,
        message: "service not found",
      });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(400).json({
        success: false,
        message: "slot not found",
      });
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
      email,
      slot: slotId,
      admin: admin._id,
      name,
      address,
      city,
      country,
      pincode,
    });
    await appointment.save();
    
    return res.status(201).json({
      success: true,
      message: "Appointment is added  successfully",
      appointment: appointment,
      service,
      slot,
    });
  } catch (error) {
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

    const admin = await User.findOne({ name: id });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Service provider not found",
      });
    }

    if (!date2) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const dateObj = new Date(date2);

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dayName = days[dateObj.getDay()];

    const bookedAppointments = await Appointment.find({
      admin: admin._id,
      date: date2,
      isBooked: true,
    });

    const bookedSlotIds = bookedAppointments.map((appointment) => appointment.slot.toString());

    const allSlots = await Slot.find({
      admin: admin._id,
      date: dayName,
    });

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlotIds.includes(slot._id.toString()),
    );

    return res.status(200).json({
      success: true,
      message: "Available slots fetched successfully",
      slots: availableSlots,
      dayName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching slots",
    });
  }
};
