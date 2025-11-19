# 🔐 Forgot Password - Quick Reference

## ✅ What's New

A **"Forgot Password?"** link has been added to both the Student/Teacher and Admin login tabs.

---

## 🎯 How to Use

### For Students/Teachers

1. Go to Login Page
2. Stay on "Student/Teacher" tab (or click it)
3. Click **"Forgot Password?"** link below the Login button
4. 📱 Popup appears with: **📞 Contact Admin: 01629381024**
5. Call the number to reset your password

### For Admin

1. Go to Login Page
2. Click "Admin" tab
3. Click **"Forgot Password?"** link below the Admin Login button
4. 📱 Popup appears with: **📞 Contact Admin: 01629381024**
5. Call the number or contact IT support

---

## 📞 Admin Contact

**Phone Number:** `01629381024`

---

## 🔧 Technical Details

**File Modified:** `src/pages/Login.tsx`

**Function Added:**
```typescript
const handleForgotPassword = () => {
  toast({
    title: "Password Recovery",
    description: "📞 Contact Admin: 01629381024",
  });
};
```

**UI Changes:**
- Added "Forgot Password?" link button on Student/Teacher login tab
- Added "Forgot Password?" link button on Admin login tab
- Links use `variant="link"` styling (appears as hyperlink)

---

## ✨ Features

- ✅ Shows admin contact number instantly
- ✅ Available on both login tabs
- ✅ No backend required
- ✅ Phone-based password recovery
- ✅ Mobile friendly
- ✅ One-click access

---

## 🧪 Quick Test

1. Open http://localhost:8081/login
2. Click "Forgot Password?" on Student/Teacher tab
3. ✅ Should see: "Password Recovery" popup with phone number
4. Switch to Admin tab
5. Click "Forgot Password?" on Admin tab
6. ✅ Should see: Same popup with phone number

---

**Status:** ✅ READY TO USE
