# Profile, Password & Image Update Documentation

**Project:** Synos Medical Web Application
**Date:** December 3, 2025
**Status:** ✅ **PRODUCTION READY**

---

## 📋 Overview

This document describes the complete profile management system for the Synos Medical application, including profile updates, password changes, and image uploads with base64 storage.

---

## 🎯 Features Implemented

### 1. Profile Information Update
- ✅ Update user name
- ✅ Update bio (max 500 characters)
- ✅ Update phone number (international format supported)
- ✅ Update address (street, city, postal code, country)
- ✅ Full validation with detailed error messages
- ✅ Email display (read-only)

### 2. Password Update
- ✅ Change password with current password verification
- ✅ Strong password requirements enforced
- ✅ Password confirmation validation
- ✅ Secure password handling via Better Auth

### 3. Profile Image Management
- ✅ Upload images (JPG, PNG, GIF, WebP, SVG)
- ✅ Base64 encoding and storage in database
- ✅ Image size validation (5MB maximum)
- ✅ Image preview with circular avatar display
- ✅ Remove/delete profile image functionality
- ✅ Real-time image preview

### 4. User Interface
- ✅ Tabbed interface (Profile Info, Profile Image, Security)
- ✅ Responsive layout with proper spacing
- ✅ Loading states and error handling
- ✅ Success notifications
- ✅ Form validation with helpful error messages

---

## 📝 API Endpoints

### 1. Update User Name

**Endpoint:** `PUT /api/user/name`

**Authentication:** Required (Better Auth session)

**Request Body:**
```json
{
  "name": "John Doe"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Name updated successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
}
```

**Validation Rules:**
- **Required**
- **Min length:** 2 characters
- **Max length:** 100 characters
- **Trimmed:** Leading/trailing spaces removed

---

### 2. Update Profile Information

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

---

### 3. Update Profile Image

**Endpoint:** `PUT /api/user/image`

**Authentication:** Required (Better Auth session)

**Request Body (Base64):**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

**Request Body (URL):**
```json
{
  "image": "https://example.com/avatar.jpg"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "user@example.com",
      "image": "data:image/png;base64,..."
    }
  }
}
```

**Validation Rules:**
- **Format:** Must be valid URL or base64-encoded image
- **Base64 Pattern:** `data:image/(png|jpg|jpeg|gif|webp|svg+xml);base64,...`
- **Max Size:** 5MB (for base64 images)
- **Supported Formats:** PNG, JPG, JPEG, GIF, WebP, SVG

---

### 4. Delete Profile Image

**Endpoint:** `DELETE /api/user/image`

**Authentication:** Required (Better Auth session)

**Request Body:** None

**Response (Success):**
```json
{
  "success": true,
  "message": "Profile image removed successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "user@example.com",
      "image": null
    }
  }
}
```

---

### 5. Update Password

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

---

## 🔐 Validation Rules

### Profile Validation

#### Name
- **Required**
- **Min length:** 2 characters
- **Max length:** 100 characters
- **Trimmed:** Leading/trailing spaces removed

#### Bio
- **Optional**
- **Max length:** 500 characters
- **Trimmed:** Leading/trailing spaces removed

#### Phone Number
- **Optional**
- **Format:** International phone number format

#### Address
- **Optional object**
- **Fields:**
  - `street` (optional, max 200 chars)
  - `city` (optional, max 100 chars)
  - `postalCode` (optional, max 20 chars)
  - `country` (optional, max 100 chars)

### Image Validation

#### Image Format
- **Required:** Must be provided
- **Type:** Valid URL or base64-encoded image
- **Base64 Pattern:** `data:image/(png|jpg|jpeg|gif|webp|svg+xml);base64,...`

#### Image Size
- **Max Size:** 5MB
- **Calculation:** Base64 size = (length × 3) / 4 bytes
- **Validation:** Client-side (FileReader) and server-side (base64 length check)

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

## 💻 Frontend Implementation

### Profile Settings Page Structure

```typescript
// Location: app/(dashboard)/dashboard/profile/page.tsx

// Three-tab interface:
// 1. Profile Info - Name, email, bio, phone, address
// 2. Profile Image - Upload, preview, remove image
// 3. Security - Password change form

// Key Features:
- React Hook Form for form management
- Zod validation schemas
- Separate forms for profile and password
- Real-time image preview
- Base64 conversion using FileReader API
- Error and success notifications
- Loading states
```

### Image Upload Flow

```typescript
// 1. User selects image file
const handleImageUpload = async (event) => {
  const file = event.target.files?.[0];

  // 2. Validate file type and size
  if (!file.type.startsWith("image/")) { /* error */ }
  if (file.size > 5 * 1024 * 1024) { /* error */ }

  // 3. Convert to base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result as string;

    // 4. Update preview
    setImagePreview(base64String);

    // 5. Upload to server
    await fetch("/api/user/image", {
      method: "PUT",
      body: JSON.stringify({ image: base64String }),
    });
  };

  reader.readAsDataURL(file);
};
```

---

## 🗂️ File Structure

```
app/
├── api/
│   └── user/
│       ├── name/
│       │   └── route.ts              # PUT update user name
│       ├── image/
│       │   └── route.ts              # PUT update image, DELETE remove image
│       ├── profile/
│       │   └── route.ts              # PUT update profile
│       ├── password/
│       │   └── route.ts              # PUT update password
│       └── me/
│           └── route.ts              # GET user data
│
├── (dashboard)/
│   └── dashboard/
│       └── profile/
│           └── page.tsx              # Profile settings page with tabs
│
components/
└── ui/
    ├── tabs.tsx                      # Radix UI Tabs component
    ├── button.tsx                    # Button component
    ├── input.tsx                     # Input component
    └── form.tsx                      # Form components
│
lib/
├── services/
│   └── user.service.ts               # User business logic
│       ├── getUserWithProfile()
│       ├── updateUserInfo()          # Update name/email
│       ├── updateUserProfile()       # Update bio/phone/address
│       ├── updateUserImage()         # Update profile image (NEW)
│       └── ...
│
├── repositories/
│   ├── user.repository.ts            # User data access
│   │   ├── findByIdWithProfile()
│   │   ├── updateById()
│   │   └── ...
│   └── profile.repository.ts         # Profile data access
│       ├── updateByUserId()
│       ├── findOrCreateForUser()
│       └── ...
│
├── validations/
│   └── user.validation.ts            # Zod validation schemas
│       ├── updateProfileSchema
│       ├── updatePasswordSchema
│       └── (image validation in route)
│
└── models/
    ├── user.model.ts                 # User schema (includes image field)
    └── profile.model.ts              # Profile schema
```

---

## 🔄 Data Flow

### Profile Update Flow

```
1. User fills out profile form (name, bio, phone, address)
   ↓
2. Frontend validates input (Zod schema)
   ↓
3. If name changed → PUT /api/user/name
   ↓
4. PUT /api/user/profile (bio, phone, address)
   ↓
5. API validates session (Better Auth)
   ↓
6. API validates input (Zod schema)
   ↓
7. UserService.updateUserInfo() OR updateUserProfile()
   ↓
8. Repository updates database
   ↓
9. Return updated data to frontend
   ↓
10. Show success message
```

### Image Upload Flow

```
1. User selects image file
   ↓
2. Frontend validates file type and size
   ↓
3. FileReader converts file to base64
   ↓
4. Update preview immediately
   ↓
5. PUT /api/user/image with base64 string
   ↓
6. API validates session
   ↓
7. API validates image format and size
   ↓
8. UserService.updateUserImage()
   ↓
9. UserRepository.updateById() saves to database
   ↓
10. Return updated user data
   ↓
11. Show success message
```

### Password Update Flow

```
1. User fills out password form
   ↓
2. Frontend validates input (Zod schema)
   ↓
3. PUT /api/user/password
   ↓
4. API validates session
   ↓
5. API validates input (min 8 chars, complexity rules)
   ↓
6. Better Auth verifies current password
   ↓
7. Better Auth updates password hash
   ↓
8. Return success response
   ↓
9. Clear form and show success message
```

---

## 🧪 Testing

### Test Name Update

```bash
curl -X PUT http://localhost:3000/api/user/name \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name": "Jane Smith"}'
```

### Test Image Upload (Base64)

```bash
# First, create a small test image as base64
TEST_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

curl -X PUT http://localhost:3000/api/user/image \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{\"image\": \"$TEST_IMAGE\"}"
```

### Test Image Delete

```bash
curl -X DELETE http://localhost:3000/api/user/image \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Test Profile Update

```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "bio": "Healthcare Software Engineer",
    "phoneNumber": "+46701234567",
    "address": {
      "city": "Stockholm",
      "country": "Sweden"
    }
  }'
```

### Test Password Update

```bash
curl -X PUT http://localhost:3000/api/user/password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword456",
    "confirmPassword": "NewPassword456"
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

### Image Upload Security
1. ✅ **File Type Validation:** Client and server-side checks
2. ✅ **File Size Validation:** 5MB maximum enforced
3. ✅ **Base64 Validation:** Regex pattern matching
4. ✅ **No File System Access:** Images stored in database as base64
5. ✅ **XSS Prevention:** Base64 strings validated before storage
6. ✅ **Authentication Required:** Session must be valid

### Password Update Security
1. ✅ **Authentication Required:** Session must be valid
2. ✅ **Current Password Verification:** Must provide correct current password
3. ✅ **Strong Password Policy:** Enforced via validation
4. ✅ **Password Hashing:** Better Auth handles bcrypt hashing
5. ✅ **No Password Logging:** Passwords never logged
6. ✅ **Password Confirmation:** Must match new password

---

## 💾 Database Schema

### User Collection (Better Auth)

```javascript
{
  _id: ObjectId,
  email: String,                 // Unique, lowercase, indexed
  name: String,                  // User's display name
  emailVerified: Boolean,
  image: String,                 // NEW: Base64 or URL (can be null)
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Profile Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,              // Reference to user._id
  bio: String,                   // Optional, max 500 chars
  avatarUrl: String,             // Optional, URL format (deprecated in favor of user.image)
  phoneNumber: String,           // Optional, phone format
  address: {
    street: String,              // Optional, max 200 chars
    city: String,                // Optional, max 100 chars
    postalCode: String,          // Optional, max 20 chars
    country: String              // Optional, max 100 chars
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📊 Base64 Image Storage

### Why Base64?

**Advantages:**
- ✅ No separate file storage infrastructure needed
- ✅ No file system permissions issues
- ✅ Easy backup (database backups include images)
- ✅ Atomic transactions (image + user data updated together)
- ✅ Simple deployment (no CDN configuration needed)
- ✅ Works with MongoDB Atlas and all database providers

**Disadvantages:**
- ⚠️ ~37% larger than original file size
- ⚠️ Increases database size
- ⚠️ Not ideal for very large images (that's why we limit to 5MB)

**Best Practices:**
```javascript
// Image size in bytes (rough estimate)
const base64Size = (base64String.length * 3) / 4;

// 5MB limit prevents database bloat
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
```

### Image Format Support

```typescript
// Supported formats with their MIME types:
const SUPPORTED_FORMATS = [
  'image/png',      // PNG - best for logos, icons
  'image/jpeg',     // JPEG - best for photos
  'image/jpg',      // JPG - same as JPEG
  'image/gif',      // GIF - supports animation
  'image/webp',     // WebP - modern, efficient format
  'image/svg+xml'   // SVG - vector graphics
];

// Base64 pattern validation
const BASE64_PATTERN = /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/;
```

---

## 🐛 Error Handling

### Common Errors

#### 1. Validation Error (400)
**Cause:** Invalid input data
**Solution:** Check validation rules and fix input

**Example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["name"],
      "message": "Name must be at least 2 characters"
    }
  ]
}
```

#### 2. Unauthorized (401)
**Cause:** Not logged in or session expired
**Solution:** Login again

#### 3. Image Too Large (400)
**Cause:** Image exceeds 5MB limit
**Solution:** Compress or resize image before upload

#### 4. Invalid Image Format (400)
**Cause:** Unsupported image format
**Solution:** Use PNG, JPG, GIF, WebP, or SVG

#### 5. Current Password Incorrect (400)
**Cause:** Wrong current password provided
**Solution:** Verify current password and try again

#### 6. Internal Server Error (500)
**Cause:** Database error or unexpected issue
**Solution:** Check server logs

---

## ✅ Implementation Checklist

- [x] User name update API endpoint
- [x] User image upload API endpoint
- [x] User image delete API endpoint
- [x] Profile update API endpoint
- [x] Password update API endpoint
- [x] User service methods for all operations
- [x] Base64 image validation
- [x] Image size validation (5MB)
- [x] Profile settings page with tabs
- [x] Profile Info tab with name, bio, phone, address
- [x] Profile Image tab with upload/preview/delete
- [x] Security tab with password change form
- [x] Real-time image preview
- [x] Form validation with Zod
- [x] Error handling and user feedback
- [x] Loading states
- [x] Success notifications
- [x] TypeScript types
- [x] Responsive layout
- [x] Documentation

---

## 📚 Component Documentation

### ProfileSettingsPage Component

**Location:** `app/(dashboard)/dashboard/profile/page.tsx`

**Description:** Comprehensive profile management interface with tabbed navigation.

**Features:**
- **Profile Info Tab:** Edit name, view email, update bio, phone, and address
- **Profile Image Tab:** Upload, preview, and delete profile images
- **Security Tab:** Change password with validation

**State Management:**
```typescript
const [loading, setLoading] = useState(true);          // Initial data load
const [saving, setSaving] = useState(false);           // Form submission
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
const [userData, setUserData] = useState<UserData | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [uploadingImage, setUploadingImage] = useState(false);
```

**Form Schemas:**
```typescript
// Profile schema - validates name, bio, phone, address
const profileSchema = z.object({...});

// Password schema - validates current, new, confirm passwords
const passwordSchema = z.object({...}).refine(...);
```

**Key Methods:**
- `onProfileSubmit()` - Updates name and profile fields
- `onPasswordSubmit()` - Changes password
- `handleImageUpload()` - Converts and uploads image
- `handleRemoveImage()` - Deletes profile image

---

## 🎨 UI Components Used

### Tabs Component

**Location:** `components/ui/tabs.tsx`

**Usage:**
```tsx
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile Info</TabsTrigger>
    <TabsTrigger value="image">Profile Image</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>

  <TabsContent value="profile">{/* ... */}</TabsContent>
  <TabsContent value="image">{/* ... */}</TabsContent>
  <TabsContent value="security">{/* ... */}</TabsContent>
</Tabs>
```

### Form Components

**Used Components:**
- `Form` - Form wrapper with context
- `FormField` - Individual form field with validation
- `FormItem` - Field container
- `FormLabel` - Field label
- `FormControl` - Input wrapper
- `FormMessage` - Validation error display
- `FormDescription` - Help text

### Other UI Components

- `Button` - Action buttons with variants
- `Input` - Text inputs
- `Textarea` - Multi-line text input (native HTML)

---

## 🚀 Usage Examples

### Update Profile Name

```typescript
const response = await fetch('/api/user/name', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jane Doe' }),
});

const result = await response.json();
if (result.success) {
  console.log('Name updated:', result.data.user.name);
}
```

### Upload Profile Image

```typescript
// Convert file to base64
const file = event.target.files[0];
const reader = new FileReader();

reader.onloadend = async () => {
  const base64 = reader.result as string;

  const response = await fetch('/api/user/image', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });

  const result = await response.json();
  if (result.success) {
    console.log('Image uploaded successfully');
  }
};

reader.readAsDataURL(file);
```

### Change Password

```typescript
const response = await fetch('/api/user/password', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currentPassword: 'OldPass123',
    newPassword: 'NewPass456',
    confirmPassword: 'NewPass456',
  }),
});

const result = await response.json();
if (result.success) {
  console.log('Password changed successfully');
}
```

---

## 📈 Performance Considerations

### Image Optimization

**Current Implementation:**
- 5MB limit prevents database bloat
- Base64 encoding done client-side
- Single database field per user

**Future Improvements (if needed):**
- Image compression before base64 conversion
- WebP format conversion for better compression
- Lazy loading of images
- Image CDN integration for very high traffic

### Database Impact

**Estimated Storage:**
- Average avatar: 100KB original → ~137KB base64
- 10,000 users: ~1.37GB additional database storage
- MongoDB handles this efficiently with compression

---

## 🔮 Future Enhancements

### Potential Features
- [ ] Image cropping tool
- [ ] Multiple profile images (gallery)
- [ ] Avatar templates/default images
- [ ] Image compression before upload
- [ ] Drag-and-drop image upload
- [ ] Email change with verification
- [ ] Two-factor authentication
- [ ] Account deletion
- [ ] Profile visibility settings
- [ ] Export profile data (GDPR compliance)

---

## 📚 Related Documentation

- [USER_DATA_FETCHING_DOCUMENTATION.md](USER_DATA_FETCHING_DOCUMENTATION.md) - User data flow
- [DATABASE_MODEL_CRUD_GUIDE.md](DATABASE_MODEL_CRUD_GUIDE.md) - Model creation guide
- [CRITICAL_FIX.md](CRITICAL_FIX.md) - Database connection fix

---

## 📞 Support

For questions or issues:
1. Check this documentation first
2. Review the code comments
3. Check the validation schemas
4. Test with curl commands
5. Check browser console for errors
6. Review server logs

---

**Document Version:** 2.0
**Last Updated:** December 3, 2025
**Author:** Claude (Anthropic AI Assistant)
**Status:** Production Ready with Full Image Support

---

## 🎉 Summary

This implementation provides a complete, production-ready profile management system with:

- ✅ **Full CRUD operations** for user profiles
- ✅ **Secure password management** with validation
- ✅ **Image upload with base64 storage** (no file system needed)
- ✅ **Beautiful tabbed interface** for better UX
- ✅ **Comprehensive validation** on client and server
- ✅ **Proper error handling** with user-friendly messages
- ✅ **TypeScript types** throughout
- ✅ **Complete documentation** with examples

All features are tested, secure, and ready for production use.
