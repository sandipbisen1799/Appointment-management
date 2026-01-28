import mongoose from 'mongoose';
const slotSchema = new mongoose.Schema({
  date: String,
  startTime: String,
  endTime: String,
  isBooked: { type: Boolean, default: false },
  admin : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});
const Slot = mongoose.model('Slot', slotSchema);
export default Slot;
