import mongoose from 'mongoose';
import env from './env.js'

export const connectwithdb = async()=>{
    try {
        await mongoose.connect(env.MONGODB_URL);
        console.log("Data base connected successfully");
    } catch (error) {
        console.log("Error while connecting with database", error);
    }
}
