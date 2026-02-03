import mongoose from 'mongoose';
const slotSchema = new mongoose.Schema({
  
  date: String,
  startTime: { type: String },
  endTime: { type: String },
  time: { type: String }, // human readable label e.g. "9 AM - 10 AM"
  isBooked: { type: Boolean, default: false },
  admin : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});
const Slot = mongoose.model('Slot', slotSchema);
export default Slot;
