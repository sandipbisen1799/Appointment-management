import dotenv from "dotenv"
dotenv.config();
const env = {
    MONGODB_URL : process.env.MONGODB_URL,
    CORS_ORIGIN : process.env.CORS_ORIGIN,
    PORT : process.env.PORT,
    JWT_SECRET : process.env.JWT_SECRET,
  
}

export default env ;