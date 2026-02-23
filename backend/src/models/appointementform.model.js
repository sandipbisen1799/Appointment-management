  import mongoose from "mongoose";

  const appointmentSchema = new mongoose.Schema({
    name:{
      type:String,
    },
    address:{
      type:String,


      
    },
      city:{
        type:String
      },
      country:{
        type:String
      },
      pincode:{
        type:String,

      },
      
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot'
    },
  
    
        isBooked: { type: Boolean, default: false },
  
    email:{
    type:String
    },
    date: String,
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
   
    createdAt: { type: Date, default: Date.now }
  });

  const AppointmentForm = mongoose.model('AppointmentForm', appointmentSchema);
  export default AppointmentForm;