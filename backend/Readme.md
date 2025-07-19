# SaloonGo Backend API

Complete backend API for the SaloonGo salon booking platform built with Express.js and Firebase Firestore.

## 🚀 Features

### Phase 1: Authentication & User Management ✅
- **Customer Authentication**
  - Registration with email/password
  - Login with JWT tokens
  - Password hashing with bcrypt
  - Profile management
  - Profile image upload

- **Salon Owner Authentication**
  - Registration with salon details
  - Login with JWT tokens
  - Salon profile management
  - Live status toggle
  - Profile image upload

- **Security Features**
  - JWT token authentication
  - Refresh token system
  - Password validation
  - Input sanitization
  - Role-based access control

## 📋 Prerequisites

- Node.js (v16 or higher)
- Firebase project with Firestore enabled
- Firebase service account key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/siddhi070306/saloonGo.git
   cd saloonGo/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Firestore
   - Download service account key
   - Place it as `serviceAccountKey.json` in the `config` folder

## 🚀 Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Customer Registration
```http
POST /api/auth/signup/customer
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+1234567890",
  "address": "123 Main St, City"
}
```

#### Customer Login
```http
POST /api/auth/login/customer
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Salon Owner Registration
```http
POST /api/auth/signup/salonOwner
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "email": "jane@salon.com",
  "password": "Password123",
  "salonName": "Elite Hair Studio",
  "salonAddress": "456 Fashion St, Downtown",
  "phoneNumber": "+1234567890",
  "servicesOffered": ["Haircut", "Styling", "Facial"],
  "openHours": "9:00 AM - 8:00 PM",
  "role": "salonOwner"
}
```

#### Salon Owner Login
```http
POST /api/auth/login/salonOwner
Content-Type: application/json

{
  "email": "jane@salon.com",
  "password": "Password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer your-jwt-token
```

### User Management Endpoints

#### Get Customer Profile
```http
GET /api/user/customer/profile
Authorization: Bearer your-jwt-token
```

#### Update Customer Profile
```http
PUT /api/user/customer/profile
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890",
  "address": "Updated Address",
  "preferences": {
    "notifications": true,
    "emailUpdates": false
  }
}
```

#### Change Customer Password
```http
PUT /api/user/customer/password
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

#### Upload Customer Profile Image
```http
POST /api/user/customer/profile-image
Authorization: Bearer your-jwt-token
Content-Type: multipart/form-data

Form Data:
- image: [file]
```

#### Get Salon Profile
```http
GET /api/user/salon/profile
Authorization: Bearer your-jwt-token
```

#### Update Salon Profile
```http
PUT /api/user/salon/profile
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "fullName": "Jane Updated",
  "salonName": "Updated Salon Name",
  "salonAddress": "Updated Address",
  "phoneNumber": "+1234567890",
  "servicesOffered": ["Haircut", "Styling", "Facial", "Manicure"],
  "openHours": "8:00 AM - 9:00 PM",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

#### Change Salon Password
```http
PUT /api/user/salon/password
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

#### Upload Salon Profile Image
```http
POST /api/user/salon/profile-image
Authorization: Bearer your-jwt-token
Content-Type: multipart/form-data

Form Data:
- image: [file]
```

#### Toggle Salon Live Status
```http
PUT /api/user/salon/live-status
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "isLive": true
}
```

#### Deactivate Account
```http
PUT /api/user/deactivate
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "password": "YourPassword123"
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer your-jwt-token
```

## 📊 Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "errors": {
    "field": "Field-specific error"
  }
}
```

## 🗄️ Database Schema

### Customers Collection
```javascript
{
  name: string,
  email: string,
  password: string (hashed),
  phone: string,
  address: string,
  role: "customer",
  isActive: boolean,
  profileImage: string,
  preferences: {
    notifications: boolean,
    emailUpdates: boolean
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp
}
```

### Salon Owners Collection
```javascript
{
  fullName: string,
  email: string,
  password: string (hashed),
  salonName: string,
  salonAddress: string,
  phoneNumber: string,
  servicesOffered: array,
  openHours: string,
  role: "salonOwner",
  isActive: boolean,
  isLive: boolean,
  profileImage: string,
  rating: number,
  totalRatings: number,
  location: {
    latitude: number,
    longitude: number
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp
}
```

### Refresh Tokens Collection
```javascript
{
  userId: string,
  token: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Customer Registration
```bash
curl -X POST http://localhost:5000/api/auth/signup/customer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Required |

## 📁 Project Structure

```
backend/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── README.md             # This file
├── config/
│   ├── firebaseAdmin.js  # Firebase configuration
│   └── firebaseConfig.js # Firebase client config
├── middleware/
│   └── auth.js           # Authentication middleware
├── routes/
│   ├── authRoutes.js     # Authentication routes
│   └── userRoutes.js     # User management routes
└── utils/
    ├── jwt.js            # JWT utilities
    └── validation.js     # Input validation
```

## 🚀 Next Steps

Phase 1 is complete! Ready for:
- Phase 2: Salon Management System
- Phase 3: Appointment & Booking System
- Phase 4: Search & Discovery
- Phase 5: Admin Panel & Analytics
- Phase 6: Real-time Features
- Phase 7: Advanced Features & Optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
