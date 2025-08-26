# Travel Partner Finder - Deployment Guide

This guide will help you deploy your Travel Partner Finder application to production.

## Prerequisites

1. **GitHub Account** - Your code should be pushed to a GitHub repository
2. **MongoDB Atlas Account** - For production database
3. **Vercel Account** - For frontend deployment
4. **Railway Account** - For backend deployment

## Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific IPs)
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/travel-partner-finder`)

## Step 2: Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect it's a Node.js project
6. Set the following environment variables in Railway:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_jwt_secret_key
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-app-domain.vercel.app
   ```
7. Railway will provide you with a domain like: `https://your-app-name.up.railway.app`

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Set the following settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Set environment variables in Vercel:
   ```
   REACT_APP_API_URL=https://your-railway-backend-domain.up.railway.app
   REACT_APP_SOCKET_URL=https://your-railway-backend-domain.up.railway.app
   ```
7. Deploy the project

## Step 4: Update CORS Settings

After getting your Vercel domain, update the `CLIENT_URL` environment variable in Railway to your actual Vercel domain.

## Alternative Deployment Options

### Option 1: Netlify + Render
- **Frontend**: Netlify (similar to Vercel)
- **Backend**: Render (similar to Railway)

### Option 2: All-in-one Platform
- **Render**: Can host both frontend and backend
- **DigitalOcean App Platform**: Full-stack deployment

### Option 3: Traditional VPS
- **DigitalOcean Droplet**
- **AWS EC2**
- **Linode**

## Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-partner-finder
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-domain.up.railway.app
REACT_APP_SOCKET_URL=https://your-backend-domain.up.railway.app
```

## Testing Your Deployment

1. Visit your Vercel frontend URL
2. Try registering a new account
3. Create a travel post
4. Test the chat functionality
5. Check browser console for any errors

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure CLIENT_URL in backend matches your frontend domain
2. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
3. **Environment Variables**: Double-check all environment variables are set correctly
4. **Socket.io Issues**: Ensure REACT_APP_SOCKET_URL points to your backend domain

### Logs:
- **Railway**: Check logs in Railway dashboard
- **Vercel**: Check function logs in Vercel dashboard
- **Browser**: Check browser console for frontend errors

## Security Notes

1. Use strong, unique JWT secrets
2. Regularly rotate your JWT secrets
3. Use HTTPS in production
4. Implement rate limiting for API endpoints
5. Validate and sanitize all user inputs

## Scaling Considerations

1. **Database**: MongoDB Atlas auto-scales
2. **Backend**: Railway provides auto-scaling
3. **Frontend**: Vercel provides global CDN
4. **File Storage**: Consider AWS S3 for user uploads
5. **Caching**: Implement Redis for session management

Your Travel Partner Finder app is now ready for production! 🚀