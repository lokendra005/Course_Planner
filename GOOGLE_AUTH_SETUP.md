# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for the Course Planner application.

## Prerequisites

1. A Google account
2. Access to the Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Course Planner")
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: "Course Planner"
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `../auth/userinfo.email` and `../auth/userinfo.profile`
   - Add test users (your email) if in testing mode
4. For the OAuth client ID:
   - Application type: "Web application"
   - Name: "Course Planner Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (when deploying)
   - Authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback` (for development)
     - Your production backend URL + `/auth/google/callback` (when deploying)

## Step 4: Configure Environment Variables

1. Copy the Client ID and Client Secret from the credentials page
2. Create a `.env` file in the `backend` directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_here_change_this_in_production

# Session Secret (generate a random string)
SESSION_SECRET=your_session_secret_here_change_this_in_production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Port
PORT=5000
```

3. Replace the placeholder values with your actual credentials

## Step 5: Install Dependencies

Run the following commands to install the required dependencies:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

## Step 6: Start the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```

## Step 7: Test Authentication

1. Open your browser and go to `http://localhost:3000`
2. Click the "Sign in with Google" button
3. Complete the Google OAuth flow
4. You should be redirected back to the application and see your profile information

## Security Notes

- Never commit your `.env` file to version control
- Use strong, random secrets for JWT_SECRET and SESSION_SECRET in production
- Configure proper CORS settings for production
- Set up proper domain verification in Google Cloud Console for production

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**: Make sure the redirect URI in Google Cloud Console exactly matches your backend URL + `/auth/google/callback`

2. **"unauthorized_client" error**: Ensure your JavaScript origins are correctly configured in Google Cloud Console

3. **CORS errors**: Make sure your frontend URL is properly configured in the backend CORS settings

4. **"invalid_client" error**: Double-check your Client ID and Client Secret in the `.env` file

### Development vs Production

- For development: Use `http://localhost:3000` and `http://localhost:5000`
- For production: Use your actual domain names (https://yourdomain.com)
- Update the Google Cloud Console settings accordingly when deploying

## Features Enabled

With authentication set up, users can:
- Sign in with their Google account
- View their profile information
- Add, edit, and delete courses (authenticated users only)
- View courses (available to all users)
- Sign out

The application now protects course modification operations behind authentication while keeping course viewing public.
