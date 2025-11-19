# Quick Start Guide - New Login System ✅

## What Changed?

### ✅ User Registration
- Users register with: Name, Email, Password, Role (Student/Teacher)
- Account created with status: **PENDING**
- User sees: "Your account is pending admin approval"

### ✅ User Login
- Users login with: Email, Password
- If status = PENDING: ❌ "Account pending approval"
- If status = APPROVED: ✅ Login successful
- If status = REJECTED: ❌ "Account rejected - Reason: ..."

### ✅ Admin Login
- New "Admin" tab in login page
- Admin can login with: **admin@gmail.com** / **admin**
- Access to `/admin-dashboard`

### ✅ Admin Dashboard
- View all pending registrations
- Approve or Reject each user
- Optional rejection reason
- View approved users

### ✅ Request Room Button
- Only visible when logged in
- Completely hidden when not authenticated
- No confusing "Login to Request" text

---

## Test Workflow (5 minutes)

### Step 1: Start Servers
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd blockwise-roommate-main
npm run dev
```

**Backend:** http://localhost:5000
**Frontend:** http://localhost:8081

### Step 2: Test Registration
1. Open http://localhost:8081/login
2. Click "Register" tab
3. Fill form:
   - Name: Test Student
   - Email: test@example.com
   - Password: password123
   - Role: Student
4. Click "Register"
5. ✅ Should see: "Registration successful! Your account is pending admin approval"

### Step 3: Try Login (Should Fail)
1. Click "Student/Teacher" tab
2. Enter: test@example.com / password123
3. Click "Login"
4. ❌ Should see: "Your account is pending admin approval"

### Step 4: Admin Approves User
1. Click "Admin" tab
2. Enter: admin@gmail.com / admin
3. Click "Admin Login"
4. ✅ Redirected to admin dashboard
5. See "Test Student" in pending registrations
6. Click "Approve" button
7. ✅ User moves to "Approved Users" section

### Step 5: User Can Now Login
1. Open new tab or logout
2. Go to http://localhost:8081/login
3. Click "Student/Teacher" tab
4. Enter: test@example.com / password123
5. Click "Login"
6. ✅ Login successful → Redirected to homepage

### Step 6: Request Room Button Now Visible
1. Homepage should show room cards
2. ✅ Each room should have "Request Room" button
3. Click button → Booking dialog opens
4. Fill in date and time
5. Click "Book Room"
6. ✅ Booking successful

---

## Files Modified

### Backend:
- ✅ `server/models/User.js` - Added role, status, isVerified, rejectionReason
- ✅ `server/models/Admin.js` - Created admin model
- ✅ `server/controllers/authController.js` - Complete rewrite with 7 functions
- ✅ `server/routes/auth.js` - Added 7 new endpoints
- ✅ `server/middleware/auth.js` - Updated to handle admin tokens
- ✅ `server/seedAdmin.js` - Create default admin

### Frontend:
- ✅ `src/pages/Login.tsx` - 3 tabs for login/register/admin
- ✅ `src/pages/AdminDashboard.tsx` - Admin management interface
- ✅ `src/App.tsx` - Added admin-dashboard route
- ✅ `src/components/ui/room-grid.tsx` - Reactive login state
- ✅ `src/components/ui/room-card.tsx` - Hide button when not logged in

---

## Admin Credentials

**Email:** admin@gmail.com
**Password:** admin

---

## API Reference

### Public Endpoints:
```
POST /api/auth/register
Body: {name, email, password, role}

POST /api/auth/login
Body: {email, password}

POST /api/auth/admin-login
Body: {email, password}
```

### Admin-Only Endpoints:
```
GET /api/auth/pending-users
Header: Authorization: Bearer {token}

PUT /api/auth/approve/:userId
Header: Authorization: Bearer {token}

PUT /api/auth/reject/:userId
Header: Authorization: Bearer {token}
Body: {reason}

GET /api/auth/all-users
Header: Authorization: Bearer {token}
```

---

## Common Issues & Solutions

### Issue: "Admin already exists" when seeding
- **Solution:** This is normal - admin already seeded. Just use it!
- **Credentials:** admin@gmail.com / admin

### Issue: "Invalid admin credentials"
- **Solution:** Make sure you're using exact credentials:
  - Email: admin@gmail.com (not admin@gmail or adminmail@gmail.com)
  - Password: admin (case-sensitive)

### Issue: Can't see pending users in admin dashboard
- **Solution:** Make sure you:
  1. Logged in with admin account (admin@gmail.com)
  2. You are on /admin-dashboard page
  3. Refresh page if needed

### Issue: Request Room button not showing after login
- **Solution:**
  1. Hard refresh page: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
  2. Or open in new incognito window and login again

### Issue: Backend returns CORS error
- **Solution:** Check if backend is running on port 5000:
  ```bash
  cd server
  npm run dev
  ```

---

## Security Summary

✅ Users cannot login without registration
✅ Users cannot login without admin approval
✅ Admins have dedicated login interface
✅ Passwords hashed with bcryptjs
✅ JWT tokens with 7-day expiry
✅ Request Room button only visible when authenticated
✅ All backend endpoints validate authentication

---

## Next Steps

1. Test the workflow above (5 minutes)
2. Try registering multiple users
3. Try approving and rejecting users
4. Book a room as approved user
5. Check user status in admin dashboard

**Everything working?** → ✅ System is ready for production!

---

**Status:** ✅ Complete
**Date:** November 13, 2025
