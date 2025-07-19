# 🚀 Frontend-Backend Integration Guide

## 📋 Overview

This document explains how the React frontend is connected to the Node.js/Express backend for the SaloonGo application.

## 🔗 Integration Components

### 1. **API Service Layer** (`src/services/api.js`)
- **Purpose**: Centralized API communication with axios
- **Features**:
  - Automatic token management
  - Request/response interceptors
  - Token refresh handling
  - Error handling

### 2. **Authentication Context** (`src/context/AuthContext.jsx`)
- **Purpose**: Global state management for authentication
- **Features**:
  - User state management
  - Login/logout functionality
  - Token storage
  - Error handling

### 3. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
- **Purpose**: Route protection based on authentication status
- **Features**:
  - Automatic redirect to login
  - Role-based access control
  - Loading states

## 🔧 Setup Instructions

### Prerequisites
1. Backend server running on `http://localhost:3001`
2. All backend dependencies installed
3. Environment variables configured

### Frontend Setup
```bash
cd front-end
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

## 🧪 Testing the Integration

### 1. **Connection Test**
```bash
cd front-end
node test-connection.js
```

### 2. **Manual Testing**
1. Start both frontend and backend servers
2. Navigate to `http://localhost:5173`
3. Try to register/login
4. Check protected routes
5. Test profile updates

## 📡 API Endpoints Integration

### Authentication Endpoints
- `POST /api/auth/signup/customer` - Customer registration
- `POST /api/auth/signup/salonOwner` - Salon owner registration
- `POST /api/auth/login/customer` - Customer login
- `POST /api/auth/login/salonOwner` - Salon owner login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Management Endpoints
- `GET /api/user/customer/profile` - Get customer profile
- `PUT /api/user/customer/profile` - Update customer profile
- `PUT /api/user/customer/password` - Change customer password
- `POST /api/user/customer/profile-image` - Upload customer image
- `GET /api/user/salon/profile` - Get salon profile
- `PUT /api/user/salon/profile` - Update salon profile
- `PUT /api/user/salon/password` - Change salon password
- `POST /api/user/salon/profile-image` - Upload salon image
- `PUT /api/user/salon/live-status` - Toggle salon live status
- `PUT /api/user/deactivate` - Deactivate account

## 🔐 Authentication Flow

### 1. **Registration Flow**
```
User fills form → Frontend validation → API call → Backend validation → 
User creation → Token generation → Frontend storage → Redirect
```

### 2. **Login Flow**
```
User credentials → Frontend validation → API call → Backend validation → 
Token generation → Frontend storage → Redirect to protected route
```

### 3. **Protected Route Flow**
```
Route access → Check authentication → Loading state → 
Authenticated: Show component | Not authenticated: Redirect to login
```

### 4. **Token Refresh Flow**
```
API call fails (401) → Check refresh token → Call refresh endpoint → 
New access token → Retry original request → Continue
```

## 🎨 UI Components Integration

### 1. **Auth Component** (`src/pages/Auth.jsx`)
- **Features**:
  - Customer/Salon owner toggle
  - Form validation
  - Loading states
  - Error display
  - Automatic redirect

### 2. **Navbar Component** (`src/components/Navbar.jsx`)
- **Features**:
  - Dynamic authentication state
  - User welcome message
  - Logout functionality
  - Role-based admin panel access

### 3. **UserProfile Component** (`src/pages/UserProfile.jsx`)
- **Features**:
  - Real user data display
  - Profile editing
  - API integration
  - Loading states

## 🛡️ Security Features

### 1. **Token Management**
- Access tokens stored in localStorage
- Refresh tokens for automatic renewal
- Automatic token cleanup on logout

### 2. **Request Security**
- Automatic Authorization headers
- Token refresh on 401 errors
- Secure logout with backend invalidation

### 3. **Route Protection**
- Authentication checks
- Role-based access control
- Automatic redirects

## 🔄 State Management

### 1. **Authentication State**
```javascript
{
  user: null | UserObject,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

### 2. **User Object Structure**
```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  role: 'customer' | 'salonOwner' | 'admin',
  profileImage: string,
  createdAt: Date,
  // ... other fields
}
```

## 🚨 Error Handling

### 1. **API Errors**
- Network errors
- Validation errors
- Authentication errors
- Server errors

### 2. **User Feedback**
- Error messages display
- Loading states
- Success notifications
- Form validation

## 📱 Responsive Design

### 1. **Mobile Support**
- Responsive authentication forms
- Mobile-friendly navigation
- Touch-friendly interactions

### 2. **Cross-browser Compatibility**
- Modern browser support
- Fallback handling
- Progressive enhancement

## 🔧 Configuration

### 1. **Environment Variables**
```javascript
// Frontend API configuration
const API_BASE_URL = 'http://localhost:3001/api';
```

### 2. **Development vs Production**
- Development: Local backend
- Production: Deployed backend URL
- Environment-specific configurations

## 🚀 Deployment Considerations

### 1. **Frontend Deployment**
- Build optimization
- Static file serving
- CDN integration

### 2. **Backend Deployment**
- Environment variables
- Database configuration
- SSL certificates

### 3. **CORS Configuration**
- Frontend domain whitelist
- Credential handling
- Security headers

## 📊 Monitoring & Debugging

### 1. **Console Logging**
- API request/response logs
- Authentication state changes
- Error tracking

### 2. **Network Monitoring**
- Request timing
- Response sizes
- Error rates

### 3. **User Analytics**
- Authentication events
- Feature usage
- Error reporting

## 🔄 Future Enhancements

### 1. **Real-time Features**
- WebSocket integration
- Live notifications
- Real-time updates

### 2. **Advanced Security**
- Two-factor authentication
- Biometric login
- Session management

### 3. **Performance Optimization**
- Code splitting
- Lazy loading
- Caching strategies

## 📞 Support

For integration issues:
1. Check backend server status
2. Verify environment variables
3. Review console errors
4. Test API endpoints directly
5. Check network connectivity

---

**🎉 Integration Complete!** The frontend and backend are now fully connected and ready for development and testing. 