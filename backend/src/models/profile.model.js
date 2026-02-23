import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(

{
    dayNumber:{
        type:String,
        default:0
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true   // 🔥 This ensures ONE profile per user
  }
},

  
  { timestamps: true}
);
const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
