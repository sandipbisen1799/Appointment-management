import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
 appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppointmentForm",
    },
    admin: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },


    razorpay_order_id: {
      type: String,
      required: true,
      unique:true
    },

    razorpay_payment_id: {
      type: String,
    },

    razorpay_signature: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },
    
    amount_due:{
        type:Number,

    },
    paid:{
        type:Number,

    }
,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
      receipt  :{
        type: String,
        unique:true
      }
  },

  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
