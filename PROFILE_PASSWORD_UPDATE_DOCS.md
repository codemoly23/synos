# Profile & Password Update Documentation

**Project:** Synos Medical Web Application
**Date:** December 3, 2025
**Status:** ✅ **PRODUCTION READY**

---

## 📋 Overview

This document describes the profile update and password update functionality implemented for the Synos Medical application.

---

## 🎯 Features Implemented

### 1. Profile Update
- Update bio (max 500 characters)
- Update phone number (international format supported)
- Update address (street, city, postal code, country)
- Full validation with detailed error messages

### 2. Password Update
- Change password with current password verification
- Strong password requirements enforced
- Password confirmation validation
- Secure password handling via Better Auth

---

## 📝 API Endpoints

### 1. Update Profile

**Endpoint:** `PUT /api/user/profile`

**Authentication:** Required (Better Auth session)

**Request Body:**
```json
{
  "bio": "Software Engineer passionate about healthcare technology",
  "phoneNumber": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      "_id": "...",
      "userId": "...",
      "bio": "Software Engineer passionate about healthcare technology",
      "avatarUrl": null,
      "phoneNumber": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "postalCode": "10001",
        "country": "USA"
      },
      "createdAt": "2025-12-03T...",
      "updatedAt": "2025-12-03T..."
    }
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["bio"],
      "message": "Bio must not exceed 500 characters"
    }
  ]
}
```

**Response (Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

### 2. Update Password

**Endpoint:** `PUT /api/user/password`

**Authentication:** Required (Better Auth session)

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "success": true
  }
}
```

**Response (Current Password Incorrect):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["newPassword"],
      "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
  ]
}
```

---

## 🔐 Validation Rules

### Profile Validation

#### Bio
- **Optional**
- **Max length:** 500 characters
- **Trimmed:** Leading/trailing spaces removed

#### Phone Number
- **Optional**
- **Format:** International phone number format
- **Regex:** `/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/`
- **Examples:**
  - `+1234567890`
  - `+1 (234) 567-8900`
  - `123-456-7890`

#### Address
- **Optional object**
- **Fields:**
  - `street` (optional, max 200 chars)
  - `city` (optional, max 100 chars)
  - `postalCode` (optional, max 20 chars)
  - `country` (optional, max 100 chars)

### Password Validation

#### Current Password
- **Required**
- **Must match:** User's current password in database

#### New Password
- **Required**
- **Min length:** 8 characters
- **Max length:** 128 characters
- **Must contain:**
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
- **Regex:** `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/`

#### Confirm Password
- **Required**
- **Must match:** New password exactly

---

## 💻 Usage Examples

### Frontend - Update Profile

```typescript
// Update profile
const updateProfile = async (data: {
  bio?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}) => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include session cookies
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Profile updated:', result.data.profile);
      return result.data.profile;
    } else {
      console.error('Update failed:', result.message, result.errors);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Example usage
updateProfile({
  bio: 'Healthcare technology enthusiast',
  phoneNumber: '+1234567890',
  address: {
    city: 'New York',
    country: 'USA'
  }
});
```

### Frontend - Update Password

```typescript
// Update password
const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await fetch('/api/user/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include session cookies
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Password updated successfully');
      return true;
    } else {
      console.error('Password update failed:', result.message, result.errors);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Example usage
updatePassword({
  currentPassword: 'OldPassword123',
  newPassword: 'NewPassword123',
  confirmPassword: 'NewPassword123'
});
```

---

## 🗂️ File Structure

```
app/api/user/
├── me/
│   └── route.ts              # GET user data
├── profile/
│   └── route.ts              # PUT update profile
└── password/
    └── route.ts              # PUT update password

lib/
├── services/
│   └── user.service.ts       # User business logic
├── repositories/
│   ├── user.repository.ts    # User data access
│   └── profile.repository.ts # Profile data access
└── validations/
    └── user.validation.ts    # Zod validation schemas
```

---

## 🔄 Data Flow

### Profile Update Flow

```
1. User submits profile update form
   ↓
2. Frontend calls PUT /api/user/profile
   ↓
3. API validates session (Better Auth)
   ↓
4. API validates input (Zod schema)
   ↓
5. UserService.updateUserProfile(userId, data)
   ↓
6. ProfileRepository.updateByUserId(userId, data)
   ↓
7. MongoDB updates profile document
   ↓
8. Return updated profile to frontend
```

### Password Update Flow

```
1. User submits password change form
   ↓
2. Frontend calls PUT /api/user/password
   ↓
3. API validates session (Better Auth)
   ↓
4. API validates input (Zod schema)
   ↓
5. Better Auth verifies current password
   ↓
6. Better Auth updates password hash
   ↓
7. Return success response to frontend
```

---

## 🧪 Testing

### Test Profile Update

```bash
# Get user session first (login)
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }' \
  -c cookies.txt

# Update profile
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "bio": "Software Engineer",
    "phoneNumber": "+1234567890",
    "address": {
      "city": "New York",
      "country": "USA"
    }
  }'
```

### Test Password Update

```bash
# Update password
curl -X PUT http://localhost:3000/api/user/password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword123",
    "confirmPassword": "NewPassword123"
  }'
```

---

## 🔐 Security Considerations

### Profile Update Security
1. ✅ **Authentication Required:** Session must be valid
2. ✅ **Input Validation:** Zod schema validates all inputs
3. ✅ **XSS Prevention:** All inputs trimmed and length-limited
4. ✅ **SQL Injection Prevention:** Mongoose ODM parameterizes queries
5. ✅ **User Isolation:** Users can only update their own profile

### Password Update Security
1. ✅ **Authentication Required:** Session must be valid
2. ✅ **Current Password Verification:** Must provide correct current password
3. ✅ **Strong Password Policy:** Enforced via validation
4. ✅ **Password Hashing:** Better Auth handles bcrypt hashing
5. ✅ **No Password Logging:** Passwords never logged
6. ✅ **Password Confirmation:** Must match new password

---

## 🐛 Error Handling

### Common Errors

#### 1. Validation Error (400)
**Cause:** Invalid input data
**Solution:** Check validation rules and fix input

#### 2. Unauthorized (401)
**Cause:** Not logged in or session expired
**Solution:** Login again

#### 3. Current Password Incorrect (400)
**Cause:** Wrong current password provided
**Solution:** Verify current password and try again

#### 4. Internal Server Error (500)
**Cause:** Database error or unexpected issue
**Solution:** Check server logs

---

## 📊 Database Schema

### Profile Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Reference to user._id
  bio: String,               // Optional, max 500 chars
  avatarUrl: String,         // Optional, URL format
  phoneNumber: String,       // Optional, phone format
  address: {
    street: String,          // Optional, max 200 chars
    city: String,            // Optional, max 100 chars
    postalCode: String,      // Optional, max 20 chars
    country: String          // Optional, max 100 chars
  },
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection (Better Auth)

```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  emailVerified: Boolean,
  // password is hashed and stored by Better Auth
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Implementation Checklist

- [x] Profile validation schema created
- [x] Password validation schema created
- [x] Profile update API endpoint
- [x] Password update API endpoint
- [x] User service methods
- [x] Profile repository methods
- [x] Error handling
- [x] Authentication checks
- [x] Input validation
- [x] Logging
- [x] Documentation

---

## 🚀 Next Steps

### Frontend Integration

1. **Create Profile Settings Page**
   - Form for bio, phone, address
   - Avatar upload component
   - Real-time validation
   - Success/error messages

2. **Create Password Change Page**
   - Current password field (type=password)
   - New password field (type=password)
   - Confirm password field (type=password)
   - Password strength indicator
   - Success/error messages

3. **Add to Dashboard/Settings**
   - Navigation to profile settings
   - Navigation to password change
   - User feedback on updates

---

## 📚 Related Documentation

- [USER_DATA_FETCHING_DOCUMENTATION.md](USER_DATA_FETCHING_DOCUMENTATION.md) - User data flow
- [DATABASE_MODEL_CRUD_GUIDE.md](DATABASE_MODEL_CRUD_GUIDE.md) - Model creation guide
- [CRITICAL_FIX.md](CRITICAL_FIX.md) - Database connection fix

---

**Document Version:** 1.0
**Last Updated:** December 3, 2025
**Author:** Claude (Anthropic AI Assistant)
**Status:** Production Ready
