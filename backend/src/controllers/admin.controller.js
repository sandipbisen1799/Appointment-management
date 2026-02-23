import AppointmentForm from "../models/appointementform.model.js";
import Payment from "../models/payment.model.js";
import Service from "../models/service.model.js";
import Slot from "../models/slot.model.js";
import { sendEmail, sendBulkEmail } from "../utils/Mailsender.js";
import User from '../models/user.model.js'

export const createService = async (req, res) => {
  try {
    const { serviceName, description, price } = req.body;
    if (!serviceName || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const admin = req.user._id;
    const service = await Service.create({
      serviceName,
      description,
      admin,
      price,
    });
    await service.save();
    return res.status(201).json({
      success: true,
      message: "service created successfully",
      service: service,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating service",
    });
  }
};
export const getService = async (req, res) => {
  try {
    const id = req.user._id;
    const service = await Service.find({ admin: id });

    if (!service) {
      return res.status(400).json({
        success: false,
        message: "admin service not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "admin services fetch successfully",
      service,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error while fetching service",
    });
  }
};
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is not found ",
      });
    }

    const service = await Service.findByIdAndDelete(id, { new: true });

    if (!service) {
      return res.status(400).json({
        success: false,
        message: " service not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "service deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error while deleting service",
    });
  }
};
export const updateService = async (req, res) => {
  try {
    const { serviceName, description, price } = req.body;
    const { id } = req.params;

    if (!serviceName || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const service = await Service.findByIdAndUpdate(id, {
      serviceName,
      description,
      price,
    });
    await service.save();
    return res.status(201).json({
      success: true,
      message: "service updated successfully",
      service: service,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in updating  service",
    });
  }
};

export const addSlot = async (req, res) => {
  try {
    const { day, startTime: startInput, endTime: endInput } = req.body;

    if (!day) {
      return res.status(400).json({
        success: false,
        message: "Day is required",
      });
    }

    // helper: HH:MM → minutes
    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    // helper: label formatter
    const formatLabel = (timeStr) => {
      let [h, m] = timeStr.split(":").map(Number);
      let ampm = "";
      if (h >= 12) {
        ampm = "PM";
      } else {
        ampm = "AM";
      }
      h = h % 12 === 0 ? 12 : h % 12;
      return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
    };
    if (startInput && endInput) {
      const timePattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;

      if (!timePattern.test(startInput) || !timePattern.test(endInput)) {
        return res.status(400).json({
          success: false,
          message: "Time must be in HH:MM format",
        });
      }

      const startMinutes = toMinutes(startInput);
      const endMinutes = toMinutes(endInput);

      if (endMinutes <= startMinutes) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time",
        });
      }

      // 🔥 OVERLAP CHECK
      const existingSlots = await Slot.find({
        admin: req.user._id,
        date: day,
      });

      const hasOverlap = existingSlots.some((slot) => {
        const s = toMinutes(slot.startTime);
        const e = toMinutes(slot.endTime);
        return startMinutes < e && endMinutes > s;
      });

      if (hasOverlap) {
        return res.status(409).json({
          success: false,
          message: "Slot overlaps with an existing slot",
        });
      }

      const slot = await Slot.create({
        date: day,
        startTime: startInput,
        endTime: endInput,
        time: `${formatLabel(startInput)} - ${formatLabel(endInput)}`,
        admin: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: "Manual slot created successfully",
        slot,
      });
    }

    // ================================
    // AUTO SLOT CREATION (1 hour slots)
    // ================================
    const existingSlots = await Slot.find({
      admin: req.user._id,
      date: day,
    });

    let startHour = null;

    for (let h = 9; h < 33; h++) {
      const start = h * 60;
      const end = (h + 1) * 60;

      const overlap = existingSlots.some((slot) => {
        const s = toMinutes(slot.startTime);
        const e = toMinutes(slot.endTime);
        return start < e && end > s;
      });

      if (!overlap) {
        startHour = h;
        break;
      }
    }

    if (startHour === null) {
      return res.status(400).json({
        success: false,
        message: "No  slots available to create",
      });
    }

    const startTime = `${String(startHour).padStart(2, "0")}:00`;
    const endTime = `${String(startHour + 1).padStart(2, "0")}:00`;

    const slot = await Slot.create({
      date: day,
      startTime,
      endTime,
      time: `${formatLabel(startTime)} - ${formatLabel(endTime)}`,
      admin: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Auto slot created successfully",
      slot,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating slot",
    });
  }
};

export const getAllSlots = async (req, res) => {
  try {
    console.log("fff", req.cookie);
    const slots = await Slot.find({ admin: req.user._id }).sort({
      startTime: 1,
    });
    if (!slots || slots.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No slots found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Slots fetched successfully",
      slots: slots,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while getting day slot",
    });
  }
};

export const getDaySlot = async (req, res) => {
  try {
    const { day } = req.body;
    console.log("fff", req.cookie.token);
    if (!day) {
      return res.status(400).json({
        success: false,
        message: "DAY IS MISSING",
      });
    }
    console.log(day);
    const slots = await Slot.find({ admin: req.user._id, date: day }).sort({
      startTime: 1,
    });
    if (!slots || slots.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No slots found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Slots fetched successfully",
      slots: slots,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while getting day slot",
    });
  }
};
export const getAllAppointments = async (req, res) => {
  try {
    const { email } = req.query;
    const query = { admin: req.user._id };
    
    // Add email filter if provided
    if (email) {
      query.email = email;
    }
    
    const appointments = await AppointmentForm.find(query)
      .populate("service", "serviceName description")
      .populate("slot", "time startTime endTime date")
      .populate("admin", "name email")
      .sort({ createdAt: -1 });
    console.log(appointments);
    if (!appointments) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: appointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching appointments",
    });
  }
};
export const getApproveAppointments = async (req, res) => {
  try {
    const { email } = req.query;
    const query = { admin: req.user._id, status: 'Approved' };
    
    // Add email filter if provided
    if (email) {
      query.email = email;
    }
    
    const appointments = await AppointmentForm.find(query)
      .populate("service", "serviceName description")
      .populate("slot", "time startTime endTime date")
      .populate("admin", "name email")
      .sort({ createdAt: -1 });
    console.log(appointments);
    if (!appointments) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: appointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching appointments",
    });
  }
};
export const getnewlyAppointments = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const appointments = await AppointmentForm.find({
      admin: req.user._id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("service", "serviceName description")
      .populate("slot", "time startTime endTime date")
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .limit(1);

    if (!appointments) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    const service = await Service.countDocuments({ admin: req.user._id });
    const slot = await Slot.countDocuments({ admin: req.user._id });
    const totalAppointment = await AppointmentForm.countDocuments({
      admin: req.user._id,
    });

    console.log("dfdf", slot, service);
    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: appointments,
      totalAppointment,
      slot,
      service,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching appointments",
    });
  }
};

export const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Slot id is required" });
    }

    const timePattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;
    if (startTime && !timePattern.test(startTime)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid startTime format" });
    }
    if (endTime && !timePattern.test(endTime)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid endTime format" });
    }

    const formatToLabel = (timeStr) => {
      const [hourStr, minuteStr] = timeStr.split(":");
      let hour = Number(hourStr);
      const minute = minuteStr;
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 === 0 ? 12 : hour % 12;
      return `${hour}:${minute} ${ampm}`;
    };

    const update = {};
    if (startTime) update.startTime = startTime;
    if (endTime) update.endTime = endTime;
    if (startTime && endTime)
      update.time = `${formatToLabel(startTime)} - ${formatToLabel(endTime)}`;

    const slot = await Slot.findByIdAndUpdate(id, update, { new: true });
    if (!slot)
      return res
        .status(404)
        .json({ success: false, message: "Slot not found" });

    return res
      .status(200)
      .json({ success: true, message: "Slot updated successfully", slot });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error while updating slot" });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is missing",
      });
    }
    const slot = await Slot.findByIdAndDelete(id, {
      new: true,
    });
    if (!slot) {
      return res.status(400).json({
        success: false,
        message: "slot is missing",
      });
    }
    return res.status(200).json({
      success: true,
      message: "slot is deleted successsfully",
      slot,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while deleting the slot",
    });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await AppointmentForm.findByIdAndUpdate(
      appointmentId,
      { status: "Approved" },
      { new: true },
    )
      .populate("service", "serviceName ")
      .populate("slot", "time  date")
      .populate("admin", " email")
      .sort({ createdAt: -1 });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    console.log(appointment);
    const result = await sendEmail({
      serviceName: appointment.service.serviceName,
      adminEmail: appointment.admin.email,
      slotDay: appointment.slot.date,
      slotTime: appointment.slot.time,
      appointmentEmail: appointment.email,
      status: appointment.status,
      // or user.name
    });
    return res.status(200).json({
      success: true,
      message: "Appointment approved successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in approving appointment",
    });
  }
};
export const rejectAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await AppointmentForm.findByIdAndUpdate(
      appointmentId,
      { status: "Rejected" },
      { new: true },
    )
      .populate("service", "serviceName ")
      .populate("slot", "time  date")
      .populate("admin", " email")
      .sort({ createdAt: -1 });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    const result = await sendEmail({
      serviceName: appointment.service.serviceName,
      adminEmail: appointment.admin.email,
      slotDay: appointment.slot.date,
      slotTime: appointment.slot.time,
      appointmentEmail: appointment.email,
      status: appointment.status,
      // or user.name
    });
    return res.status(200).json({
      success: true,
      message: "Appointment rejected successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in rejecting appointment",
    });
  }
};

export const getOrder = async (req, res) => {
  try {
      const order = await Payment.find({ admin: req.user._id })
      .populate({
        path: "appointment",
        populate: [
          {
            path: "service",
            select: "serviceName price",
          },
          {
            path: "slot",
            select: "time date",
          },
          {
            path: "admin",
            select: "email",
          },
        ],
      });
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "order is not found ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "order is fetched successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error while finding the order ",
    });
  }
};

export const sendAllEmailController = async (req, res) => {
  try {
    const { emails, message, subject } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Emails array is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }
    const admin =  await User.findById(req.user._id);
    if(!admin){
      return res.status(400).json({
        success:false,
        message:'admin not found'
      })
    }

    await sendBulkEmail({
      admin,
      emails,
      subject,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error sending bulk emails",
    });
  }
};
