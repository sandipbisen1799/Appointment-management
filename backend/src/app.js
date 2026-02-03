import  express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import adminRouter from './routes/admin.route.js'
import visitorRouter from './routes/visitor.route.js'
const app = express()


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://appointment-management-one.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use('/api/v1/auth',authRouter); 
app.use('/api/v1/admin',adminRouter); 
app.use('/api/v1/visitor',visitorRouter);


app.use((req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    message: 'Route not found'

  });
});
export default app;