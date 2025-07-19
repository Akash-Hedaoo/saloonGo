# 🔥 Firebase Setup Guide

## 📋 Overview

This guide explains how to set up Firebase for the SaloonGo backend application.

## 🔧 Firebase Configuration

### 1. **Project Details**
- **Project ID**: `salonproject-500af`
- **Project Name**: SaloonGo
- **Database**: Firestore
- **Storage**: Firebase Storage

### 2. **Service Account Configuration**

The Firebase service account credentials have been configured in:
```
backend/config/firebaseServiceAccount.json
```

**⚠️ Security Note**: 
- This file contains sensitive credentials
- Never commit this file to version control
- Use environment variables in production

### 3. **Environment Variables**

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=salonproject-500af
FIREBASE_STORAGE_BUCKET=salonproject-500af.appspot.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Setup Instructions

### 1. **Install Dependencies**
```bash
cd backend
npm install
```

### 2. **Initialize Database**
```bash
npm run setup
```

This will:
- Test Firebase connection
- Create necessary collections
- Verify database access

### 3. **Start Development Server**
```bash
npm run dev
```

### 4. **Test Backend**
```bash
npm test
```

## 📊 Database Collections

### 1. **customers**
Stores customer user data:
```javascript
{
  id: "auto-generated",
  name: "string",
  email: "string (unique)",
  phone: "string",
  password: "hashed string",
  role: "customer",
  profileImage: "string (URL)",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  isActive: "boolean"
}
```

### 2. **salonOwners**
Stores salon owner data:
```javascript
{
  id: "auto-generated",
  name: "string",
  email: "string (unique)",
  phone: "string",
  password: "hashed string",
  role: "salonOwner",
  salonName: "string",
  address: "string",
  profileImage: "string (URL)",
  isLive: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  isActive: "boolean"
}
```

### 3. **refreshTokens**
Stores refresh tokens for authentication:
```javascript
{
  id: "auto-generated",
  userId: "string",
  token: "string",
  expiresAt: "timestamp",
  createdAt: "timestamp"
}
```

## 🔐 Security Rules

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Customers can read/write their own data
    match /customers/{customerId} {
      allow read, write: if request.auth != null && request.auth.uid == customerId;
    }
    
    // Salon owners can read/write their own data
    match /salonOwners/{salonId} {
      allow read, write: if request.auth != null && request.auth.uid == salonId;
    }
    
    // Refresh tokens are managed by the backend
    match /refreshTokens/{tokenId} {
      allow read, write: if false; // Backend only
    }
  }
}
```

### Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile images
    match /profile-images/{userId}/{allPaths=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🧪 Testing

### 1. **Connection Test**
```bash
cd front-end
node test-connection.js
```

### 2. **API Testing**
```bash
cd backend
npm test
```

### 3. **Manual Testing**
1. Start backend server
2. Use Postman or similar tool
3. Test authentication endpoints
4. Verify database operations

## 🔧 Troubleshooting

### Common Issues

#### 1. **Firebase Connection Error**
```
Error: Firebase connection failed
```
**Solution**:
- Verify service account credentials
- Check project ID
- Ensure Firebase Admin SDK is installed

#### 2. **Permission Denied**
```
Error: Permission denied
```
**Solution**:
- Check Firestore security rules
- Verify service account permissions
- Ensure collections exist

#### 3. **JWT Token Issues**
```
Error: Invalid token
```
**Solution**:
- Check JWT secret configuration
- Verify token expiration
- Ensure proper token format

### Debug Steps

1. **Check Firebase Console**
   - Go to Firebase Console
   - Verify project settings
   - Check service account permissions

2. **Verify Environment Variables**
   - Check `.env` file exists
   - Verify all required variables
   - Restart server after changes

3. **Test Database Connection**
   ```bash
   npm run setup
   ```

4. **Check Server Logs**
   - Monitor console output
   - Look for error messages
   - Verify API endpoints

## 📈 Monitoring

### 1. **Firebase Console**
- Monitor database usage
- Check authentication logs
- View storage usage

### 2. **Application Logs**
- Server startup logs
- API request logs
- Error logs

### 3. **Performance Metrics**
- Response times
- Database query performance
- Storage usage

## 🚀 Production Deployment

### 1. **Environment Variables**
- Use production JWT secrets
- Set proper CORS origins
- Configure production Firebase project

### 2. **Security**
- Remove service account file
- Use environment variables
- Enable Firebase security rules

### 3. **Monitoring**
- Set up Firebase monitoring
- Configure error tracking
- Monitor performance

## 📞 Support

For Firebase-related issues:
1. Check Firebase Console
2. Review service account permissions
3. Verify project configuration
4. Test database connection
5. Check security rules

---

**🎉 Firebase setup is complete and ready for development!** 