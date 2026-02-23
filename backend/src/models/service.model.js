import mongoose from 'mongoose';
const serviceSchema = new mongoose.Schema({
  serviceName: String,
  description: String,
  price: Number,
  isActive: { type: Boolean, default: true },
  admin : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});
const Service = mongoose.model('Service', serviceSchema);
export default Service;