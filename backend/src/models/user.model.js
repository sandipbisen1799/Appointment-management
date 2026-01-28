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
     isblock:{
      type:Boolean,
      default:false
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
