# 🚀 Course Prerequisite Planner - Deployment Guide

## Quick Deploy (5 Minutes) - Vercel + Railway

### 📋 Prerequisites
- GitHub account
- Node.js 16+ installed locally

### 🔧 Step 1: Prepare Your Repository
```bash
# 1. Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: Course Prerequisite Planner"

# 2. Create GitHub repository and push
gh repo create course-prerequisite-planner --public
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/course-prerequisite-planner.git
git push -u origin main
```

### 🌐 Step 2: Deploy Frontend (Vercel)

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend and deploy
cd frontend
vercel --prod

# Follow prompts:
# ? Set up and deploy "frontend"? Y
# ? Which scope? (Your account)
# ? Link to existing project? N
# ? What's your project's name? course-prerequisite-planner
# ? In which directory is your code located? ./
```

#### Option B: Vercel Website
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Set **Root Directory** to `frontend`
5. Click "Deploy"

**Important**: Set environment variable in Vercel dashboard:
- `REACT_APP_API_URL` = `https://your-backend-url.railway.app/api`

### 🚂 Step 3: Deploy Backend (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Choose "Deploy from a folder" → `backend`
   - Click "Deploy"

3. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

4. **Get Your Backend URL**
   - Railway will provide a URL like: `https://course-planner-backend-production.railway.app`

### 🔗 Step 4: Connect Frontend to Backend

1. **Update Vercel Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.railway.app/api`
   - Redeploy frontend

2. **Update Backend CORS**
   - Go to Railway Dashboard → Your Service → Variables
   - Update: `CORS_ORIGIN` = `https://your-frontend-url.vercel.app`
   - Redeploy backend

### ✅ Step 5: Test Your Deployment
- Visit your Vercel URL
- Test all three tabs:
  1. Course Management
  2. Graph Visualization
  3. Algorithm Analysis

---

## 🐳 Alternative: Docker Deployment

### Create Dockerfiles

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'
services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    depends_on:
      - backend
  
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - CORS_ORIGIN=http://localhost:3000
```

**Deploy with Docker:**
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d --build
```

---

## ☁️ Cloud Platform Guides

### AWS Deployment

#### Frontend (S3 + CloudFront)
```bash
# Build production version
cd frontend
npm run build

# Deploy to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Backend (ECS or Lambda)
- **ECS**: Use Docker container deployment
- **Lambda**: Serverless deployment with API Gateway

### Azure Deployment

#### Frontend (Static Web Apps)
```bash
# Install Azure CLI
az login

# Deploy static app
az staticwebapp create \
  --name course-prerequisite-planner \
  --resource-group myResourceGroup \
  --source https://github.com/YOUR_USERNAME/course-prerequisite-planner \
  --location "West US 2" \
  --branch main \
  --app-location "frontend" \
  --output-location "build"
```

#### Backend (Container Instances)
```bash
# Deploy backend container
az container create \
  --resource-group myResourceGroup \
  --name course-planner-backend \
  --image your-docker-registry/backend:latest \
  --dns-name-label course-planner-api \
  --ports 5000
```

### Google Cloud Platform

#### Frontend (Firebase Hosting)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
cd frontend
firebase init hosting

# Deploy
npm run build
firebase deploy
```

#### Backend (Cloud Run)
```bash
# Build and deploy container
gcloud builds submit --tag gcr.io/PROJECT_ID/backend
gcloud run deploy backend \
  --image gcr.io/PROJECT_ID/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔧 Environment Variables Reference

### Frontend Variables
```env
# Required
REACT_APP_API_URL=https://your-backend-url.com/api

# Optional
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Backend Variables
```env
# Required
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-url.com

# Optional (for database)
DATABASE_URL=mongodb://your-connection-string
REDIS_URL=redis://your-redis-url
```

---

## 📊 Performance Optimization

### Frontend Optimizations
```bash
# Analyze bundle size
cd frontend
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Backend Optimizations
- Use PM2 for process management
- Enable gzip compression
- Implement API caching
- Add rate limiting

### Database Integration (Optional)
```javascript
// Replace JSON file storage with MongoDB
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  description: String,
  prerequisites: [String]
});

const Course = mongoose.model('Course', courseSchema);
```

---

## 🛡️ Security Considerations

### Production Security Checklist
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure proper CORS policies
- [ ] Add API rate limiting
- [ ] Implement input validation
- [ ] Use environment variables for secrets
- [ ] Enable security headers
- [ ] Regular dependency updates

### CORS Configuration
```javascript
// Backend: src/server.js
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));
```

---

## 📈 Monitoring & Analytics

### Error Tracking
- **Frontend**: Sentry, LogRocket
- **Backend**: Winston logging, Sentry

### Performance Monitoring
- **Frontend**: Google Analytics, Lighthouse CI
- **Backend**: New Relic, DataDog

### Health Checks
```javascript
// Backend: Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0'
  });
});
```

---

## 🎯 Quick Start Summary

1. **Push code to GitHub**
2. **Deploy frontend to Vercel**
3. **Deploy backend to Railway**
4. **Configure environment variables**
5. **Test deployment**

**Your app will be live at:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`

**Total deployment time: ~5-10 minutes** ⚡

Need help? Check the troubleshooting section or create an issue in the repository! 