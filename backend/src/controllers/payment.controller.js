import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import env from "../config/env.js";
import Payment from "../models/payment.model.js";
import AppointmentForm from "../models/appointementform.model.js";
import User from "../models/user.model.js";
export const createOrder = async (req, res) => {
  try {
    const { amount, appointmentId, adminName } = req.body;
    console.log(req.data);
    const user = await User.findOne({ name: adminName });
    console.log(user);
    const options = {
      // Replace with your Razorpay key_id
      amount: amount * 100, // Amount is in currency subunits.
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      // name: 'Acme Corp',
      // description: 'Test Transaction',
      // // This is the order_id created in the backend
      // callback_url: 'http://localhost:3000/api/v1/verify', // Your success URL
      // prefill: {
      //   name: 'Gaurav Kumar',
      //   email: 'gaurav.kumar@example.com',
      //   contact: '9999999999'
      // },
      // theme: {
      //   color: '#F37254'
      // },
    };
    const order = await razorpay.orders.create(options);
    console.log(order);
    const appointment = await AppointmentForm.findById(appointmentId);

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "appointment not found ",
      });
    }

    const result = await Payment.create({
      appointment: appointment._id,
      amount,
      admin: user._id,
      razorpay_order_id: order.id,
      status: "created",
      amount_due: order.amount_due,
      paid: order.amount_paid,
      currency: order.currency,
      receipt:order.receipt
    });

    return res.status(200).json({
      success: true,
      order,
      result
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    console.log("ra", razorpay_signature);
    console.log("ex", expectedSignature);
    const payment = await Payment.findOne({
      razorpay_order_id,
    });
  
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (payment.status === "paid") {
        const appointment = await AppointmentForm.findById(payment.appointment)
        appointment.isBooked = true ;
        appointment.save();
      return res.status(200).json({
        success: true,
        message: "Payment already verified and appointment booked sucessfully",
        payment,
      });
    }
    await payment.save();
    if (expectedSignature === razorpay_signature) {
      const razorpayPayment =
        await razorpay.payments.fetch(razorpay_payment_id);
      console.log(razorpayPayment);
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      payment.status = "paid";
      payment.paid = razorpayPayment.amount / 100;
      payment.amount_due = 0;
       const appointment = await AppointmentForm.findById(payment.appointment)
        appointment.isBooked = true ;
        appointment.save();

      await payment.save();
      return res.status(200).json({
        success: true,
        appointment,

        message: "Payment Verified and appointment booked successfully",
        payment,
      });
    } else {
      // Payment failed - update status to failed and save
      payment.status = "failed";
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
        payment,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Handle payment failure explicitly
export const handlePaymentFailure = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, failure_reason } = req.body;

    const payment = await Payment.findOne({ razorpay_order_id });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Update payment status to failed
    payment.status = "failed";
    if (razorpay_payment_id) {
      payment.razorpay_payment_id = razorpay_payment_id;
    }
    if (razorpay_signature) {
      payment.razorpay_signature = razorpay_signature;
    }
    
    await payment.save();

    return res.status(200).json({
      success: false,
      message: failure_reason || "Payment failed",
      payment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
