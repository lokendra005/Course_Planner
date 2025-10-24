# 🧪 Simple Authentication Test Guide

## ✅ Current Status

**Backend**: ✅ Running on `http://localhost:5001` with simple email/password auth
**Frontend**: ✅ Running on `http://localhost:3000` 

## 🚀 How to Test

### 1. Open Your Browser
Go to: **http://localhost:3000**

### 2. Look for the New Buttons
You should see **"Sign In"** and **"Sign Up"** buttons in the top-right corner (NOT "Sign in with Google")

### 3. If You Still See Google Sign-In:
The React development server might need to refresh. Try:
- **Hard refresh**: Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- **Clear cache**: Open Developer Tools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### 4. Test the Authentication:

#### Option A: Use Existing Test Account
- Click **"Sign In"**
- Email: `test@example.com`
- Password: `password123`
- Click **"Sign In"**

#### Option B: Create New Account
- Click **"Sign Up"**
- Enter your name, email, and password (min 6 characters)
- Click **"Sign Up"**

### 5. After Login:
- You should see your name and email in the top-right corner
- You can now add, edit, and delete courses
- Click **"Sign Out"** to logout

## 🔧 If Still Having Issues:

### Backend Test (Should Work):
```bash
# Test login endpoint directly
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Frontend Issues:
1. **Hard refresh** the browser page
2. **Clear browser cache**
3. **Check browser console** for any errors (F12 → Console tab)

## 🎯 What You Should See:

### Before Login:
- "Sign In" and "Sign Up" buttons in header
- Notice: "Please sign in to add, edit, or delete courses"
- Can view courses but cannot modify them

### After Login:
- Your name and avatar in header
- "Sign Out" button
- Can add, edit, and delete courses
- Full access to all features

## 🚨 Troubleshooting:

### If you see "Cannot GET /auth/google":
This means the old Google OAuth code is still cached. The new system doesn't use `/auth/google` at all.

**Solution**: 
1. Hard refresh your browser (Cmd+Shift+R or Ctrl+F5)
2. Clear browser cache
3. The new system uses modal dialogs, not redirects

### If login doesn't work:
1. Check browser console for errors
2. Make sure backend is running on port 5001
3. Try the curl command above to test backend directly

---

**🎉 The new system is much simpler - no external setup required!**
