import mongoose from 'mongoose';
const slotSchema = new mongoose.Schema({
  
  date: String,
  startTime: { type: String },
  endTime: { type: String },
  time: { type: String }, // human readable label e.g. "9 AM - 10 AM"
 
  admin : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date1:{
    type:String
  }


},
{
  timestamps:true
});
const Slot = mongoose.model('Slot', slotSchema);
export default Slot;
