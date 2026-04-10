# Appointment Management System

A full-stack appointment booking platform built with the MERN stack (MongoDB, Express, React, Node.js) that enables users to book appointments with professionals and allows service providers to manage their schedules efficiently.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Home      │  │  Appointment │  │    Admin    │             │
│  │   Page      │  │    Booking   │  │   Dashboard │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP + JWT
┌────────────────────────────┴────────────────────────────────────┐
│                        Backend (Node.js + Express)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Auth      │  │  Appointment│  │   Payment   │             │
│  │ Controller  │  │  Controller  │  │  Controller │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                    Database (MongoDB)                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Users  │ │Appoint │ │ Slots  │ │Services│ │Payments│      │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Key Features

### For Customers/Users
- **Service Browsing**: Browse available services with pricing
- **Real-time Slot Availability**: View available time slots in real-time
- **Online Appointment Booking**: Book appointments with date/time selection
- **Payment Integration**: Secure payment via Razorpay
- **Booking Confirmation**: Instant email confirmation after booking
- **Appointment Status Tracking**: Track pending, approved, or rejected status

### For Service Providers (Admin)
- **Dashboard Analytics**: View total appointments, services, and statistics
- **Service Management**: Create, update, and delete services with pricing
- **Slot Management**: 
  - Auto-generate 1-hour time slots
  - Manual slot creation with custom times
  - Date-based availability management
- **Appointment Management**: View, approve, or reject appointments
- **Order Management**: Track all payments and transactions
- **Bulk Communication**: Send emails to multiple customers

### For Super Admin
- **Multi-admin Management**: Create and manage multiple admin accounts
- **Admin Blocking/Unblocking**: Control admin access
- **Platform Overview**: Monitor all appointments across platform

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| React Router DOM | Navigation |
| Tailwind CSS | Styling |
| Material UI (MUI) | Component Library |
| React Redux Toolkit | State Management |
| React Toastify | Notifications |
| React Day Picker | Date Selection |
| Axios | HTTP Client |
| Formik + Yup | Form Validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Razorpay | Payment Gateway |
| SendinBlue (SIB) | Email Service |

## 📁 Project Structure

```
Appointment Management system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Razorpay config
│   │   ├── controllers/     # Business logic
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── payment.controller.js
│   │   │   └── visitor.controller.js
│   │   ├── middlewares/      # Auth & authorization
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # External services
│   │   └── utils/           # Utilities (JWT, email, etc.)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Appointment.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── AdminAppointment.jsx
│   │   │   ├── Service.jsx
│   │   │   ├── Slot.jsx
│   │   │   └── ...
│   │   ├── routes/          # Routing configuration
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   └── package.json
│
└── README.md
```

## 🔐 Authentication & Authorization

### User Roles
1. **Super Admin**: Full platform access, manages all admins
2. **Admin**: Manages own appointments, services, and slots
3. **User/Customer**: Books appointments and makes payments

### Security Features
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt (10 salt rounds)
- Role-based route protection
- Payment signature verification

## 💳 Payment Flow (Razorpay)

```
User Books Appointment
        ↓
Appointment Created (Pending)
        ↓
User Initiates Payment
        ↓
Razorpay Order Created
        ↓
Payment Verification
        ↓
┌───────────────┬───────────────┐
│   Success     │    Failed     │
│   ↓           │   ↓           │
│ Appointment   │ Payment       │
│ Marked Booked │ Status Failed│
└───────────────┴───────────────┘
```

## 📊 Database Models

### User Model
- `name`: String (unique)
- `email`: String (unique, lowercase)
- `password`: String (hashed)
- `accountType`: Enum ['superadmin', 'admin']
- `isblock`: Boolean
- `admin`: Reference to parent admin (for multi-admin)
- `profile`: Reference to Profile

### AppointmentForm Model
- `name`, `address`, `city`, `country`, `pincode`: Customer details
- `email`: Customer email
- `service`: Reference to Service
- `slot`: Reference to Slot
- `date`: Appointment date
- `status`: Enum ['Pending', 'Approved', 'Rejected']
- `isBooked`: Boolean (payment status)
- `admin`: Reference to Admin User

### Service Model
- `serviceName`: String
- `description`: String
- `price`: Number
- `isActive`: Boolean
- `admin`: Reference to User

### Slot Model
- `date`: String
- `startTime`, `endTime`: Time in HH:MM format
- `time`: Human-readable label (e.g., "9:00 AM - 10:00 AM")
- `admin`: Reference to User

### Payment Model
- `appointment`: Reference to AppointmentForm
- `admin`: Reference to User
- `razorpay_order_id`: String (unique)
- `razorpay_payment_id`: String
- `razorpay_signature`: String
- `amount`: Number
- `currency`: String (default: INR)
- `status`: Enum ['created', 'paid', 'failed']

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new admin |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| GET | `/api/v1/auth/profile` | Get current user |

### Admin Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/create-admin` | Create new admin (SuperAdmin) |
| GET | `/api/v1/auth/fetch-admin` | Get all admins |
| PUT | `/api/v1/auth/block/:id` | Block admin |
| PUT | `/api/v1/auth/unblock/:id` | Unblock admin |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/service` | Create service |
| GET | `/api/v1/admin/get-service` | Get admin services |
| PUT | `/api/v1/admin/service/:id` | Update service |
| DELETE | `/api/v1/admin/service/:id` | Delete service |

### Slots
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/slot` | Create slot |
| GET | `/api/v1/admin/get-slot` | Get all slots |
| GET | `/api/v1/admin/get-day-slot` | Get slots by day |
| PUT | `/api/v1/admin/slot/:id` | Update slot |
| DELETE | `/api/v1/admin/slot/:id` | Delete slot |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/appointment` | Get all appointments |
| GET | `/api/v1/admin/appointment/approve` | Get approved appointments |
| PUT | `/api/v1/admin/appointment/approve/:id` | Approve appointment |
| PUT | `/api/v1/admin/appointment/reject/:id` | Reject appointment |
| POST | `/api/v1/visitor/appointment` | Create appointment |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payment/create-order` | Create Razorpay order |
| POST | `/api/v1/payment/verify` | Verify payment |
| POST | `/api/v1/payment/failure` | Handle payment failure |
| GET | `/api/v1/admin/order` | Get all orders |

### Communication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/send-email` | Send bulk emails |

## 🎯 Skills Demonstrated (For Resume)

### Frontend Development
- ✅ React.js with modern hooks (useState, useEffect, useRef)
- ✅ React Router for SPA navigation
- ✅ State management with Redux Toolkit
- ✅ Form handling with Formik and Yup validation
- ✅ Responsive UI with Tailwind CSS
- ✅ Material UI component integration
- ✅ Date/time picker implementation
- ✅ HTTP client with Axios
- ✅ Toast notifications
- ✅ Payment integration (Razorpay)

### Backend Development
- ✅ RESTful API design
- ✅ MongoDB with Mongoose ODM
- ✅ JWT authentication
- ✅ Password security with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Payment gateway integration
- ✅ Email service integration
- ✅ Express.js middleware
- ✅ Error handling

### Full Stack & System Design
- ✅ MERN stack development
- ✅ Multi-role authentication system
- ✅ Database schema design
- ✅ API security best practices
- ✅ Real-time availability management
- ✅ Booking system workflow
- ✅ Multi-admin platform architecture

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# RAZORPAY_KEY_ID=your_razorpay_key
# RAZORPAY_SECRET=your_razorpay_secret
# EMAIL_API_KEY=your_sendinblue_key
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with:
# VITE_API_URL=http://localhost:5000/api/v1
# VITE_RAZORPAY_KEY_ID=your_razorpay_key
npm run dev
```

## 🌐 Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Ready for deployment on Render/Railway/Vercel
- **Database**: MongoDB Atlas

## 👨‍💻 Developer

**Sandip Bisen**
- Email: sandipbisen1799@gmail.com

---

*This project demonstrates full-stack development skills using the MERN stack, including authentication, payment processing, and complex state management.*
