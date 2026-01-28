import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      unique: true,
      type: String,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["superadmin","admin"],
      required: true,
    },
     active:{
      type:String,
      enum :["block","unblock"],
      default : "unblock"
    },
    
      admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

}

  ,
  { timestamps: false }
);
const User = mongoose.model("User", userSchema);
export default User;
