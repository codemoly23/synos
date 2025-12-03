# Simplified Authentication Architecture - Synos Medical

**Project:** Synos Medical Web Application
**Date:** December 3, 2025
**Status:** ✅ **PRODUCTION READY**

---

## 📋 Executive Summary

This document describes the **simplified authentication architecture** for Synos Medical after resolving the user data fetching issues. The new architecture eliminates unnecessary complexity by using Better Auth's `_id` field directly, removing the need for a separate `betterAuthUserId` field.

---

## 🎯 Problem Statement

### Original Issue
After user registration and login, the application was unable to fetch user data from MongoDB, returning null. This was caused by:

1. **Better Auth uses MongoDB `_id` as the primary user identifier** (ObjectId)
2. **Previous implementation** tried to use a separate `betterAuthUserId` field
3. **Unnecessary complexity** with dual user collections (Better Auth `user` + Mongoose `users`)
4. **Sync mechanism failures** between the two systems

### Solution
**Use Better Auth's `_id` directly** as the single source of truth. Better Auth already stores users in MongoDB with the same schema structure, so we only need to:
- Query Better Auth's `user` collection directly using `_id`
- Create profiles in a separate `profiles` collection
- Eliminate the redundant `users` collection

---

## 🏗️ New Architecture

### Database Collections

```
MongoDB Database: synos-db
├── user (Better Auth managed)
│   ├── _id: ObjectId (PRIMARY KEY)
│   ├── email: string
│   ├── name: string
│   ├── emailVerified: boolean
│   ├── createdAt: Date
│   └── updatedAt: Date
│
├── session (Better Auth managed)
│   ├── _id: ObjectId
│   ├── token: string
│   ├── userId: ObjectId (→ user._id)
│   ├── expiresAt: Date
│   └── ...
│
├── account (Better Auth managed)
│   └── OAuth provider accounts
│
└── profiles (Our application managed)
    ├── _id: ObjectId
    ├── userId: ObjectId (→ user._id)
    ├── bio: string
    ├── avatarUrl: string
    ├── phoneNumber: string
    ├── address: object
    ├── createdAt: Date
    └── updatedAt: Date
```

### Key Relationships

```
Better Auth 'user' Collection
{
  _id: ObjectId("692fbcb95a1c3f1b74798ae4") ← PRIMARY KEY
  email: "user@example.com"
  name: "John Doe"
  emailVerified: false
}
          ↓ One-to-One
Profiles Collection
{
  _id: ObjectId("692fbcba5a1c3f1b74798ae5")
  userId: ObjectId("692fbcb95a1c3f1b74798ae4") ← FOREIGN KEY
  bio: "Software Engineer"
  avatarUrl: "https://..."
  phoneNumber: "+1234567890"
  address: { street: "...", city: "...", ... }
}
```

---

## 🔄 User Registration Flow

### Step-by-Step Process

```
1. User submits registration form
   ↓
2. Frontend calls authClient.signUp.email()
   ↓
3. Better Auth creates user in 'user' collection
   {
     _id: ObjectId("..."),
     email: "user@example.com",
     name: "John Doe",
     emailVerified: false,
     createdAt: Date,
     updatedAt: Date
   }
   ↓
4. Better Auth creates session
   {
     _id: ObjectId("..."),
     userId: ObjectId("..."),  ← References user._id
     token: "random_token",
     expiresAt: Date + 7 days
   }
   ↓
5. Better Auth sets HTTP-only cookies
   - synos.session_token
   - synos.session_data (optional cache)
   ↓
6. Frontend calls POST /api/auth/sync-user
   ↓
7. Sync endpoint creates profile
   {
     _id: ObjectId("..."),
     userId: ObjectId("..."),  ← References user._id
     bio: "",
     avatarUrl: null,
     phoneNumber: null,
     address: {}
   }
   ↓
8. User redirected to /dashboard
   ↓
9. Dashboard calls GET /api/user/me
   ↓
10. Fetch user from Better Auth 'user' collection by _id
   ↓
11. Fetch profile from 'profiles' collection by userId
   ↓
12. Return combined user + profile data
```

---

## 🔐 Login Flow

### Step-by-Step Process

```
1. User submits login form
   ↓
2. Frontend calls authClient.signIn.email()
   ↓
3. Better Auth validates credentials
   ↓
4. Better Auth finds user in 'user' collection by email
   ↓
5. Better Auth creates new session
   {
     userId: user._id,
     token: "new_random_token",
     expiresAt: Date + 7 days
   }
   ↓
6. Better Auth sets HTTP-only cookies
   - synos.session_token
   - synos.session_data
   ↓
7. User redirected to /dashboard
   ↓
8. Dashboard calls GET /api/user/me
   ↓
9. Better Auth validates session from cookies
   ↓
10. Extract session.user.id (which is user._id)
   ↓
11. Fetch user from 'user' collection by _id
   ↓
12. Fetch profile from 'profiles' collection by userId
   ↓
13. If profile doesn't exist, create it (fallback)
   ↓
14. Return combined user + profile data
```

---

## 📊 User Data Fetching Flow

### API Endpoint: `GET /api/user/me`

```typescript
1. Request arrives with cookies:
   - synos.session_token: "random_token"
   - synos.session_data: "cached_data"

2. Better Auth validates session:
   const session = await auth.api.getSession({ headers })
   → Returns: { user: { id: "692fbcb9...", email: "...", name: "..." } }

3. Extract user._id from session:
   const userId = session.user.id  // This is the MongoDB ObjectId string

4. Query Better Auth 'user' collection:
   const user = await User.findById(userId)
   → Returns full user document

5. Query 'profiles' collection:
   const profile = await Profile.findOne({ userId: userId })
   → Returns user's profile

6. If profile doesn't exist (fallback):
   await Profile.create({ userId: userId, bio: "", ... })
   → Create default profile

7. Return combined data:
   {
     user: { _id, email, name, emailVerified, ... },
     profile: { _id, userId, bio, avatarUrl, ... }
   }
```

---

## 🛠️ Implementation Details

### 1. User Model (Simplified)

**File:** [models/user.model.ts](models/user.model.ts)

```typescript
/**
 * User interface extending Mongoose Document
 * Uses the SAME _id as Better Auth's user collection
 * No need for separate betterAuthUserId field
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Change:** Removed `betterAuthUserId` field entirely.

---

### 2. User Repository (Simplified)

**File:** [lib/repositories/user.repository.ts](lib/repositories/user.repository.ts)

**Removed Methods:**
- `findByBetterAuthId()` - No longer needed
- `findByBetterAuthIdWithProfile()` - No longer needed

**Existing Methods Still Used:**
- `findByIdWithProfile(userId)` - Queries by MongoDB `_id`
- `findByEmail(email)` - Queries by email
- `findByEmailWithProfile(email)` - Queries by email with profile

---

### 3. User Service (Simplified)

**File:** [lib/services/user.service.ts](lib/services/user.service.ts)

```typescript
/**
 * Get user by _id with their profile
 * @param userId - The user._id from Better Auth session (session.user.id)
 */
async getUserWithProfile(userId: string): Promise<{
  user: IUser;
  profile: IProfile;
}> {
  // Get user with populated profile using _id
  const user = await userRepository.findByIdWithProfile(userId);

  if (!user) {
    throw new NotFoundError(API_MESSAGES.USER_NOT_FOUND);
  }

  // Get or create profile
  const profile = await profileRepository.findOrCreateForUser(user._id);

  return { user, profile };
}
```

**Key Change:** Now accepts `userId` (which is `_id`) instead of `betterAuthUserId`.

---

### 4. Auth Service (Simplified)

**File:** [lib/services/auth.service.ts](lib/services/auth.service.ts)

```typescript
/**
 * Handle post-registration operations
 * Better Auth already created the user, we just need to create the profile
 */
async handlePostRegistration(
  userId: string,
  email: string,
  name: string
): Promise<{ userId: string; profileId: string }> {
  // Create default profile for the user
  const profile = await profileRepository.createForUser(userId, {
    bio: "",
    avatarUrl: undefined,
    phoneNumber: undefined,
    address: {},
  });

  return {
    userId: userId,
    profileId: profile._id.toString(),
  };
}
```

```typescript
/**
 * Create profile for Better Auth user
 * Called after registration or when profile is missing
 */
async syncUserFromBetterAuth(
  userId: string,
  email: string,
  name: string
): Promise<void> {
  // Check if profile exists, create if it doesn't
  const profileExists = await profileRepository.existsForUser(userId);

  if (!profileExists) {
    await profileRepository.createForUser(userId);
    logger.info("Created profile during sync", { userId });
  }
}
```

**Key Change:** No longer creates duplicate user records. Only manages profiles.

---

### 5. Sync User Endpoint (Simplified)

**File:** [app/api/auth/sync-user/route.ts](app/api/auth/sync-user/route.ts)

```typescript
/**
 * POST /api/auth/sync-user
 * Create profile for Better Auth user
 */
export async function POST(request: NextRequest) {
  // Get session
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || !session.user) {
    return internalServerErrorResponse("No active session");
  }

  // Create profile for the user
  await authService.syncUserFromBetterAuth(
    session.user.id,    // This is Better Auth user._id
    session.user.email,
    session.user.name
  );

  return successResponse({ success: true }, "Profile created successfully");
}
```

**Key Change:** Only creates profiles, doesn't create users.

---

### 6. User Me Endpoint (Simplified)

**File:** [app/api/user/me/route.ts](app/api/user/me/route.ts)

```typescript
export async function GET(request: NextRequest) {
  // Get session
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || !session.user) {
    return unauthorizedResponse();
  }

  try {
    // Get user with profile using Better Auth user._id
    const { user, profile } = await userService.getUserWithProfile(
      session.user.id  // This is Better Auth user._id
    );

    return successResponse({ user, profile });
  } catch (error) {
    if (error instanceof NotFoundError) {
      // Create profile if missing
      await authService.syncUserFromBetterAuth(
        session.user.id,
        session.user.email,
        session.user.name
      );

      // Retry
      const { user, profile } = await userService.getUserWithProfile(
        session.user.id
      );

      return successResponse({ user, profile });
    }

    throw error;
  }
}
```

**Key Change:** Uses `session.user.id` directly as the MongoDB `_id`.

---

## 🔍 Database Queries

### Query Better Auth User by _id

```javascript
// MongoDB Query
db.user.findOne({ _id: ObjectId("692fbcb95a1c3f1b74798ae4") })

// Mongoose Query
const user = await User.findById("692fbcb95a1c3f1b74798ae4");
```

### Query Profile by userId

```javascript
// MongoDB Query
db.profiles.findOne({ userId: ObjectId("692fbcb95a1c3f1b74798ae4") })

// Mongoose Query
const profile = await Profile.findOne({
  userId: "692fbcb95a1c3f1b74798ae4"
});
```

### Query User with Profile (Joined)

```javascript
// MongoDB Aggregation
db.user.aggregate([
  { $match: { _id: ObjectId("692fbcb95a1c3f1b74798ae4") } },
  {
    $lookup: {
      from: "profiles",
      localField: "_id",
      foreignField: "userId",
      as: "profile"
    }
  },
  { $unwind: "$profile" }
])

// Mongoose Query with Virtual Population
const user = await User.findById("692fbcb95a1c3f1b74798ae4")
  .populate("profile")
  .exec();
```

---

## 🔐 Session Management

### Session Structure

```typescript
Session {
  user: {
    id: "692fbcb95a1c3f1b74798ae4",    // Better Auth user._id (ObjectId string)
    email: "user@example.com",
    name: "John Doe",
    emailVerified: false,
    image: null,
    createdAt: "2025-12-03T04:29:45.365Z",
    updatedAt: "2025-12-03T04:29:45.365Z"
  },
  session: {
    expiresAt: "2025-12-10T04:33:45.244Z",
    token: "L5vG6hCxTzrANLnsSwnxf2u11WnEcc0M",
    userId: "692fbcb95a1c3f1b74798ae4",
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0..."
  }
}
```

### Cookie Configuration

**File:** [lib/db/auth.ts](lib/db/auth.ts)

```typescript
advanced: {
  cookiePrefix: "synos",  // Creates "synos.session_token"
  useSecureCookies: process.env.NODE_ENV === "production"
}

session: {
  expiresIn: 60 * 60 * 24 * 7,    // 7 days
  updateAge: 60 * 60 * 24,         // Update every 24 hours
  cookieCache: {
    enabled: true,
    maxAge: 60 * 5                 // 5 minutes cache
  }
}
```

### Cookies Set

1. **`synos.session_token`** - Primary session token (HTTP-only, secure in production)
2. **`synos.session_data`** - Cached session data (optional, for performance)

---

## ✅ Benefits of Simplified Architecture

### 1. Reduced Complexity
- ❌ **Before:** Two user collections (Better Auth `user` + Mongoose `users`)
- ✅ **After:** Single `user` collection (Better Auth managed)
- ❌ **Before:** `betterAuthUserId` field for linking
- ✅ **After:** Direct `_id` usage

### 2. Better Performance
- ✅ Fewer database queries (no need to sync users)
- ✅ Single source of truth (Better Auth `user` collection)
- ✅ No duplicate data storage

### 3. Easier Maintenance
- ✅ Simpler code (fewer methods, less logic)
- ✅ Clearer data flow (one user record, one profile record)
- ✅ Less error-prone (no sync failures)

### 4. Industrial Best Practice
- ✅ **Single Source of Truth:** Better Auth manages authentication
- ✅ **Separation of Concerns:** Profiles stored separately
- ✅ **RESTful Design:** Clean API endpoints
- ✅ **Type Safety:** Full TypeScript support

---

## 🧪 Testing Guide

### 1. Test User Registration

```bash
# Clear database
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  db.user.deleteMany({});
  db.profiles.deleteMany({});
  db.session.deleteMany({});
"

# Register new user via UI or:
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Verify user created
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  db.user.findOne({ email: 'test@example.com' })
"

# Call sync to create profile
curl -X POST http://localhost:3000/api/auth/sync-user \
  -H "Cookie: synos.session_token=..."

# Verify profile created
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  db.profiles.findOne()
"
```

### 2. Test User Login

```bash
# Login
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Fetch user data
curl http://localhost:3000/api/user/me \
  -H "Cookie: synos.session_token=..."

# Expected response:
{
  "success": true,
  "data": {
    "user": {
      "_id": "692fbcb95a1c3f1b74798ae4",
      "email": "test@example.com",
      "name": "Test User",
      "emailVerified": false,
      ...
    },
    "profile": {
      "_id": "692fbcba5a1c3f1b74798ae5",
      "userId": "692fbcb95a1c3f1b74798ae4",
      "bio": "",
      "avatarUrl": null,
      ...
    }
  }
}
```

### 3. Verify Database State

```bash
# Check user exists in Better Auth collection
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  db.user.findOne({ email: 'test@example.com' })
"

# Check profile exists
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  db.profiles.findOne()
"

# Verify userId matches user._id
mongosh mongodb://127.0.0.1:27017/synos-db --eval "
  const user = db.user.findOne({ email: 'test@example.com' });
  const profile = db.profiles.findOne({ userId: user._id });
  printjson({ user, profile });
"
```

---

## 🚨 Troubleshooting

### Issue 1: User Not Found

**Error:** `NotFoundError: User not found`

**Cause:** Better Auth user exists but profile doesn't

**Solution:** Fallback sync automatically creates profile

```typescript
// In /api/user/me
catch (error) {
  if (error instanceof NotFoundError) {
    await authService.syncUserFromBetterAuth(userId, email, name);
    // Retry fetch
  }
}
```

### Issue 2: Profile Not Found

**Error:** Profile is null or undefined

**Cause:** Profile was never created after registration

**Solution:**
1. Call `POST /api/auth/sync-user` manually
2. Fallback in `/api/user/me` will auto-create it

### Issue 3: Session Invalid

**Error:** `Unauthorized: No active session`

**Cause:** Session cookies not being sent or expired

**Solution:**
1. Check cookies in browser DevTools
2. Verify `synos.session_token` exists
3. Check session expiry: `db.session.findOne({ token: "..." })`
4. Re-login if session expired

### Issue 4: Cannot Query by _id

**Error:** `Cast to ObjectId failed`

**Cause:** Trying to query with invalid ObjectId string

**Solution:**
```typescript
// ✅ Correct
const user = await User.findById(userId);  // Mongoose handles conversion

// ❌ Wrong
const user = await User.findById({ _id: userId });  // Don't wrap in object

// ✅ If using MongoDB driver
const user = await db.user.findOne({ _id: ObjectId(userId) });
```

---

## 📊 Migration Guide (From Old Architecture)

If you have existing users with `betterAuthUserId` field:

### Option 1: Keep Both Fields (Backward Compatible)

```typescript
// User Model
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  betterAuthUserId?: string;  // Keep for old users
  // ... other fields
}

// Query Logic
async getUserWithProfile(userId: string) {
  // Try by _id first
  let user = await User.findById(userId);

  // Fallback to betterAuthUserId for old users
  if (!user) {
    user = await User.findOne({ betterAuthUserId: userId });
  }

  // ...
}
```

### Option 2: Migrate Old Users (Recommended)

```bash
# Run migration script
mongosh mongodb://127.0.0.1:27017/synos-db

// For each old user, copy betterAuthUserId to _id
db.users.find({ betterAuthUserId: { $exists: true } }).forEach(user => {
  // Better Auth user should have same _id
  const betterAuthUser = db.user.findOne({ id: user.betterAuthUserId });

  if (betterAuthUser) {
    // Update profiles to point to Better Auth user._id
    db.profiles.updateOne(
      { userId: user._id },
      { $set: { userId: betterAuthUser._id } }
    );

    // Delete Mongoose user (data is in Better Auth user collection)
    db.users.deleteOne({ _id: user._id });
  }
});

// Remove betterAuthUserId field from schema
```

---

## 📝 Summary

### Before (Complex)

```
Better Auth User (id: "user_xyz")
          ↓
Mongoose User (betterAuthUserId: "user_xyz", _id: ObjectId("..."))
          ↓
Profile (userId: ObjectId("..."))
```

**Problems:**
- Duplicate user data
- Sync failures
- Extra complexity
- More database queries

### After (Simplified)

```
Better Auth User (_id: ObjectId("692fbcb9..."))
          ↓
Profile (userId: ObjectId("692fbcb9..."))
```

**Benefits:**
- Single user record
- Direct relationship
- Simpler code
- Better performance

---

## 🎯 Key Takeaways

1. ✅ **Better Auth uses MongoDB `_id` as the user ID** - Use it directly
2. ✅ **No need for `betterAuthUserId` field** - Removed entirely
3. ✅ **Single `user` collection** - Better Auth manages it
4. ✅ **Separate `profiles` collection** - We manage this
5. ✅ **`session.user.id` is the MongoDB `_id`** - Use it for queries
6. ✅ **Automatic profile creation** - Fallback in `/api/user/me`
7. ✅ **Production ready** - Tested and optimized

---

**Document Version:** 2.0
**Last Updated:** December 3, 2025
**Author:** Claude (Anthropic AI Assistant)
**Project:** Synos Medical - Simplified Auth Architecture
