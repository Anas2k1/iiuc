# COMPLETE LOGIN SYSTEM - STEP BY STEP GUIDE

## 🟢 System is Live!

**Backend:** http://localhost:5000 ✅
**Frontend:** http://localhost:8081 ✅

---

## 📱 COMPLETE USER JOURNEY

### PHASE 1: REGISTRATION (First Time User)

```
┌─ STUDENT/TEACHER ─────────────────────────────┐
│                                                │
│ 1. Opens browser                               │
│    Go to: http://localhost:8081/login          │
│                                                │
│ 2. Clicks "Register" tab                       │
│                                                │
│ 3. Fills registration form:                    │
│    ├─ Full Name: John Smith                    │
│    ├─ Email: john@example.com                  │
│    ├─ Password: SecurePass123                  │
│    └─ Role: Student                            │
│                                                │
│ 4. Clicks "Register" button                    │
│                                                │
│ 5. Backend processes:                          │
│    ├─ Validates input ✅                       │
│    ├─ Checks email unique ✅                   │
│    ├─ Hashes password ✅                       │
│    ├─ Creates user in DB ✅                    │
│    │   status: "pending"                       │
│    │   isVerified: false                       │
│    └─ Returns success ✅                       │
│                                                │
│ 6. Frontend shows:                             │
│    "Registration successful!                   │
│     Your account is pending admin approval.    │
│     You will be able to login once approved."  │
│                                                │
│ ⏳ WAITING FOR ADMIN APPROVAL...               │
│                                                │
└────────────────────────────────────────────────┘
```

---

### PHASE 2: PENDING STATE (Waiting)

```
┌─ STUDENT TRIES LOGIN ──────────────────────────┐
│                                                 │
│ 1. User: "Let me try logging in..."             │
│                                                 │
│ 2. Opens http://localhost:8081/login            │
│                                                 │
│ 3. Clicks "Student/Teacher" tab                 │
│                                                 │
│ 4. Enters credentials:                          │
│    ├─ Email: john@example.com                   │
│    └─ Password: SecurePass123                   │
│                                                 │
│ 5. Clicks "Login" button                        │
│                                                 │
│ 6. Backend checks:                              │
│    ├─ Email exists? ✅ YES                      │
│    ├─ Password correct? ✅ YES                  │
│    ├─ Status = "pending"? ✅ YES                │
│    └─ BLOCK LOGIN! ❌                           │
│                                                 │
│ 7. Frontend shows error:                        │
│    "Your account is pending admin approval.     │
│     Please wait for admin to approve."          │
│                                                 │
│ ❌ LOGIN DENIED                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### PHASE 3: ADMIN APPROVAL

```
┌─ ADMIN LOGIN ──────────────────────────────────┐
│                                                │
│ 1. Admin opens: http://localhost:8081/login    │
│                                                │
│ 2. Clicks "Admin" tab                          │
│                                                │
│ 3. Enters admin credentials:                   │
│    ├─ Email: admin@gmail.com                   │
│    └─ Password: admin                          │
│                                                │
│ 4. Clicks "Admin Login"                        │
│                                                │
│ 5. Backend verifies:                           │
│    ├─ Admin email exists? ✅ YES               │
│    ├─ Password correct? ✅ YES                 │
│    └─ Generate JWT token ✅                    │
│                                                │
│ 6. Frontend:                                   │
│    ├─ Saves token to localStorage              │
│    ├─ Saves admin role                         │
│    └─ Redirects to /admin-dashboard            │
│                                                │
│ ✅ ADMIN LOGGED IN                             │
│                                                │
└────────────────────────────────────────────────┘


┌─ ADMIN DASHBOARD ──────────────────────────────┐
│                                                 │
│ 📋 PENDING REGISTRATIONS                        │
│                                                 │
│ ┌─────────────────────────────────┐            │
│ │ John Smith                      │            │
│ │ john@example.com                │            │
│ │ Role: Student                   │            │
│ │ Created: Nov 13, 2025, 10:30 AM │            │
│ │                                 │            │
│ │ [Rejection Reason Input]        │            │
│ │ [Reject] [Approve]              │            │
│ │                                 │            │
│ │ ➜ ADMIN CLICKS "APPROVE"        │            │
│ │   ↓                              │            │
│ │   PUT /api/auth/approve/userId  │            │
│ │   ↓                              │            │
│ │   Backend updates:              │            │
│ │   ├─ status: "approved"         │            │
│ │   ├─ isVerified: true           │            │
│ │   └─ Returns success ✅         │            │
│ │   ↓                              │            │
│ │   Dashboard refreshes...         │            │
│ │                                 │            │
│ └─────────────────────────────────┘            │
│                                                 │
│ ✅ USER MOVED TO APPROVED LIST                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### PHASE 4: USER CAN NOW LOGIN

```
┌─ STUDENT TRIES LOGIN AGAIN ────────────────────┐
│                                                 │
│ 1. Opens: http://localhost:8081/login           │
│                                                 │
│ 2. Clicks "Student/Teacher" tab                 │
│                                                 │
│ 3. Enters credentials:                          │
│    ├─ Email: john@example.com                   │
│    └─ Password: SecurePass123                   │
│                                                 │
│ 4. Clicks "Login" button                        │
│                                                 │
│ 5. Backend checks:                              │
│    ├─ Email exists? ✅ YES                      │
│    ├─ Password correct? ✅ YES                  │
│    ├─ Status = "approved"? ✅ YES               │
│    └─ CREATE JWT TOKEN ✅                       │
│                                                 │
│ 6. Frontend receives:                           │
│    {                                            │
│      token: "eyJhbGc...",                       │
│      user: {                                    │
│        id: "507f...",                           │
│        name: "John Smith",                      │
│        email: "john@example.com",               │
│        role: "student",                         │
│        status: "approved"                       │
│      }                                          │
│    }                                            │
│                                                 │
│ 7. Frontend stores:                             │
│    ├─ localStorage.setItem('token', '...')      │
│    ├─ localStorage.setItem('role', 'student')   │
│    ├─ Dispatch 'auth-changed' event             │
│    └─ Redirect to homepage                      │
│                                                 │
│ ✅ LOGIN SUCCESSFUL                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### PHASE 5: REAL-TIME UI UPDATE

```
┌─ HOMEPAGE - REQUEST ROOM BUTTONS ─────────────┐
│                                                │
│ Before:                                        │
│   ├─ RoomGrid loads                            │
│   ├─ Checks: localStorage.getItem('token')     │
│   ├─ Result: null (not logged in)              │
│   ├─ setIsLoggedIn(false)                      │
│   └─ Request Room buttons: HIDDEN ❌            │
│                                                │
│ ⚡ USER LOGS IN (event fired!)                 │
│                                                │
│   ├─ 'auth-changed' event triggered            │
│   ├─ Event listener fires                      │
│   ├─ handleAuthChange() executes               │
│   ├─ Reads: localStorage.getItem('token')      │
│   ├─ Result: 'eyJhbGc...' (logged in!)         │
│   ├─ setIsLoggedIn(true)                       │
│   ├─ Component RE-RENDERS ♻️                   │
│   └─ Request Room buttons: VISIBLE ✅          │
│                                                │
│ After (Instant!):                              │
│                                                │
│ ┌─ Room Card 1 ────────┐   ┌─ Room Card 2 ─┐ │
│ │ Lab Room             │   │ Study Room    │ │
│ │ Block A • Floor 2    │   │ Block B • F3  │ │
│ │ 10 seats             │   │ 8 seats       │ │
│ │ Vacant ✅            │   │ Vacant ✅     │ │
│ │                      │   │               │ │
│ │ [Request Room] ✅    │   │[Request Room] │ │
│ │                      │   │               │ │
│ └──────────────────────┘   └───────────────┘ │
│                                                │
│ 🎉 USER CAN NOW BOOK ROOMS!                   │
│                                                │
└────────────────────────────────────────────────┘
```

---

### PHASE 6: BOOKING A ROOM

```
┌─ ROOM BOOKING ─────────────────────────────────┐
│                                                 │
│ 1. User clicks "Request Room" button            │
│                                                 │
│ 2. Dialog opens:                                │
│    ┌─────────────────────────────┐             │
│    │ Book Lab Room               │             │
│    │                             │             │
│    │ Date: [2025-11-15]          │             │
│    │ Time Slot: [09:00-10:00]    │             │
│    │                             │             │
│    │  [Cancel]  [Book Room]      │             │
│    └─────────────────────────────┘             │
│                                                 │
│ 3. User fills form                              │
│                                                 │
│ 4. Clicks "Book Room"                           │
│                                                 │
│ 5. Frontend sends:                              │
│    POST /api/bookings                           │
│    Headers: Authorization: Bearer {token}      │
│    Body: {                                      │
│      room: "507f...",                           │
│      date: "2025-11-15",                        │
│      timeSlot: "09:00-10:00"                    │
│    }                                            │
│                                                 │
│ 6. Backend:                                     │
│    ├─ Validates JWT token ✅                   │
│    ├─ Checks room exists ✅                    │
│    ├─ Checks room vacant ✅                    │
│    ├─ Creates booking ✅                       │
│    ├─ Updates room status → "occupied"         │
│    └─ Returns success ✅                       │
│                                                 │
│ 7. Frontend shows:                              │
│    ✅ "Booking Successful!"                    │
│    "Lab Room booked for 2025-11-15 (09:00-10:00)" │
│                                                 │
│ 8. Room card updates:                           │
│    [Not Available] (button disabled)            │
│                                                 │
│ ✅ ROOM BOOKED SUCCESSFULLY                    │
│                                                 │
└────────────────────────────────────────────────┘
```

---

## 🔄 ALTERNATIVE: ADMIN REJECTS USER

```
┌─ ADMIN REJECTS REGISTRATION ───────────────────┐
│                                                │
│ 1. Admin in dashboard sees pending user        │
│                                                │
│ 2. Admin enters rejection reason:              │
│    [Invalid university email format]           │
│                                                │
│ 3. Admin clicks "Reject" button                │
│                                                │
│ 4. PUT /api/auth/reject/userId                 │
│    Body: {reason: "Invalid university email"}  │
│                                                │
│ 5. Backend updates:                            │
│    ├─ status: "rejected"                       │
│    ├─ rejectionReason: "Invalid university..." │
│    └─ Returns success                          │
│                                                │
│ 6. Dashboard refreshes                         │
│                                                │
│ 7. User tries login:                           │
│    POST /api/auth/login                        │
│    ↓                                            │
│    Backend checks status = "rejected"          │
│    ↓                                            │
│    Returns error with reason                   │
│                                                │
│ 8. Frontend shows:                             │
│    ❌ "Account rejected"                       │
│    "Reason: Invalid university email format"   │
│                                                │
│ ❌ CANNOT LOGIN                                │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🔑 KEY SECURITY CHECKPOINTS

```
┌─────────────────────────────────────────────────┐
│ 1. REGISTRATION                                 │
│    ✅ Email uniqueness enforced                 │
│    ✅ Password hashed (bcryptjs, 10 rounds)    │
│    ✅ Role validated (student/teacher only)    │
│    ✅ Status set to "pending"                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 2. PENDING USER LOGIN                           │
│    ✅ Email + password verified                 │
│    ✅ Status checked: MUST be "approved"       │
│    ✅ Blocked if status = "pending"             │
│    ✅ Blocked if status = "rejected"            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 3. APPROVED USER LOGIN                          │
│    ✅ All checks pass ✅                        │
│    ✅ JWT token generated                       │
│    ✅ Token has 7-day expiry                    │
│    ✅ Role included in token                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 4. ROOM BOOKING                                 │
│    ✅ JWT token verified                        │
│    ✅ User ID extracted from token              │
│    ✅ Room exists and vacant                    │
│    ✅ Booking created                           │
│    ✅ Room status updated                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 5. ADMIN OPERATIONS                             │
│    ✅ JWT token verified                        │
│    ✅ Admin ID extracted from token             │
│    ✅ Admin-only endpoints protected            │
│    ✅ Audit trail: who approved/rejected       │
└─────────────────────────────────────────────────┘
```

---

## 📞 QUICK REFERENCE

**Default Admin:**
- Email: admin@gmail.com
- Password: admin

**URLs:**
- Frontend: http://localhost:8081
- Backend: http://localhost:5000
- Admin Dashboard: http://localhost:8081/admin-dashboard

**API Base:**
- http://localhost:5000/api/auth/

**LocalStorage Keys:**
- token
- role
- user
- userRole

---

**Status:** ✅ Complete
**Date:** November 13, 2025
**System:** Three-Tier Authentication v2.0
