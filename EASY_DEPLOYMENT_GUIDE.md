# 🚀 Easy Deployment Guide

Deploy your Course Planner with authentication in just a few clicks!

## 📋 Deployment Strategy

**Backend** → Railway (Free tier, perfect for Node.js)
**Frontend** → Vercel (Free tier, perfect for React)

## 🎯 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)
3. Verify your account

### 1.2 Deploy Backend
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select your `CoursePlanner` repository
5. Railway will auto-detect it's a Node.js project

### 1.3 Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
SESSION_SECRET=your_super_secret_session_key_here_also_long_and_random
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

**Generate secrets easily:**
- JWT_SECRET: Use a password generator for 64+ characters
- SESSION_SECRET: Use a password generator for 64+ characters

### 1.4 Set Root Directory
1. In Railway dashboard, go to **Settings**
2. Set **Root Directory** to: `backend`
3. Railway will automatically use `npm start`

### 1.5 Get Your Backend URL
- After deployment, Railway will give you a URL like: `https://your-backend-name.railway.app`
- **Save this URL** - you'll need it for the frontend!

## 🎯 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Verify your account

### 2.2 Deploy Frontend
1. Click **"New Project"**
2. Import your `CoursePlanner` repository
3. **Important**: Set these build settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 2.3 Configure Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
REACT_APP_API_URL=https://your-backend-name.railway.app
```

**Replace** `your-backend-name.railway.app` with your actual Railway URL from Step 1.5!

### 2.4 Redeploy
1. After adding environment variables, go to **Deployments**
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"** to apply the new environment variables

### 2.5 Get Your Frontend URL
- Vercel will give you a URL like: `https://your-app-name.vercel.app`
- This is your live application!

## 🎯 Step 3: Update Backend with Frontend URL

### 3.1 Update Railway Environment
1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` variable with your actual Vercel URL:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
3. Railway will automatically redeploy

## 🎉 Step 4: Test Your Deployment

### 4.1 Test the Application
1. Open your Vercel URL: `https://your-app-name.vercel.app`
2. You should see your Course Planner!
3. Try signing up with a new account
4. Try logging in
5. Try adding/editing courses

### 4.2 Test the API
1. Open: `https://your-backend-name.railway.app/api/health`
2. You should see: `{"message":"Server is running!","timestamp":"..."}`

## 🔧 Troubleshooting

### Frontend Issues:
- **Blank page**: Check browser console for errors
- **API errors**: Verify `REACT_APP_API_URL` in Vercel environment variables
- **CORS errors**: Verify `FRONTEND_URL` in Railway environment variables

### Backend Issues:
- **500 errors**: Check Railway logs in dashboard
- **Auth not working**: Verify JWT_SECRET and SESSION_SECRET are set
- **Database errors**: The app uses JSON files, should work automatically

### Common Fixes:
1. **Redeploy both services** after changing environment variables
2. **Check URLs** - make sure they match exactly (no trailing slashes)
3. **Wait 2-3 minutes** for deployments to propagate

## 🎯 Quick Commands for Updates

### Update Backend:
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys!
```

### Update Frontend:
```bash
git add .
git commit -m "Update frontend"  
git push origin main
# Vercel auto-deploys!
```

## 🔒 Security Notes

### For Production:
1. **Use strong secrets** (64+ characters)
2. **Never commit .env files** to git
3. **Use HTTPS only** (both platforms provide this automatically)
4. **Monitor your deployments** regularly

## 💰 Cost

Both Railway and Vercel offer generous free tiers:
- **Railway**: 500 hours/month free (enough for most projects)
- **Vercel**: Unlimited static deployments
- **Total cost**: $0/month for most usage!

## 🎉 You're Done!

Your Course Planner is now live with:
- ✅ **Simple email/password authentication**
- ✅ **Beautiful responsive UI**
- ✅ **Secure backend API**
- ✅ **Automatic deployments**
- ✅ **HTTPS everywhere**
- ✅ **Free hosting**

**Share your app with the world!** 🌍

---

## 📞 Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Look at Railway/Vercel logs in their dashboards
3. Verify all environment variables are set correctly
4. Make sure URLs match exactly between services
