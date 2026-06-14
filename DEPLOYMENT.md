# 🚀 Drafty Production Deployment Guide

This guide covers deploying Drafty to production using Render.com (backend + database) and Vercel (frontend).

## 📋 Prerequisites

- GitHub account with Drafty repository
- Render.com account (free tier available)
- Vercel account (free tier available)
- Git CLI installed locally

## 🎯 Deployment Architecture

```
┌─────────────────┐
│  Vercel         │
│  (Next.js Web)  │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │
│  Render.com     │  │
│  ┌────────────┐ │  │
│  │ PostgreSQL │◄─┼──┤
│  └────────────┘ │  │
│  ┌────────────┐ │  │
│  │ HTTP API   │◄─┘
│  │ (Express)  │
│  └────────────┘
│  ┌────────────┐
│  │ WebSocket  │
│  │ Server     │
│  └────────────┘
└─────────────────┘
```

## 🔧 Step 1: Deploy Backend to Render.com

### 1.1 Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account
3. Grant access to the Drafty repository

### 1.2 Deploy Using Blueprint (render.yaml)
1. From Render Dashboard, click **New** → **Blueprint**
2. Select your **Drafty** repository
3. Render will auto-detect `render.yaml` and show:
   - `drafty-db` (PostgreSQL)
   - `drafty-http-api` (HTTP Server)
   - `drafty-ws` (WebSocket Server)
4. Click **Apply**

### 1.3 Configure Environment Variables
Render will prompt for these during setup:

**drafty-http-api:**
- `JWT_SECRET` - Auto-generated (copy this value!)
- `FRONTEND_ORIGIN` - Set to your Vercel URL (update after frontend deploy)
- `DATABASE_URL` - Auto-linked from drafty-db
- `PORT` - 3001
- `SALTROUNDS` - 10

**drafty-ws:**
- `JWT_SECRET` - **MUST match the same value from http-api**
- `DATABASE_URL` - Auto-linked from drafty-db  
- `PORT` - 8080

### 1.4 Run Database Migrations
After deployment completes:
1. Go to `drafty-http-api` service
2. Click **Shell** tab
3. Run:
   ```bash
   cd packages/db && pnpm drizzle-kit migrate
   ```

### 1.5 Note Your Backend URLs
After deployment, you'll have:
- **HTTP API**: `https://drafty-http-api.onrender.com`
- **WebSocket**: `wss://drafty-ws.onrender.com`

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New** → **Project**
3. Import your **Drafty** repository

### 2.2 Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm turbo build --filter=web`
- **Install Command**: `pnpm install`

### 2.3 Environment Variables
Add these in Vercel project settings:

```env
NEXT_PUBLIC_HTTP_URL=https://drafty-http-api.onrender.com/api/v1
NEXT_PUBLIC_WS_URL=wss://drafty-ws.onrender.com/
```

### 2.4 Deploy
1. Click **Deploy**
2. Wait for build to complete (~3-5 minutes)
3. Your app will be live at `https://drafty-xyz.vercel.app`

## 🔄 Step 3: Update Backend CORS

After getting your Vercel URL:

1. Go to Render Dashboard → `drafty-http-api` service
2. Update environment variable:
   ```
   FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
   ```
3. Save changes (will trigger auto-redeploy)

## ✅ Step 4: Verify Deployment

### Test HTTP API:
```bash
curl https://drafty-http-api.onrender.com/api/v1/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test WebSocket:
Use a WebSocket client or browser console:
```javascript
const ws = new WebSocket('wss://drafty-ws.onrender.com/?token=YOUR_JWT');
ws.onopen = () => console.log('Connected!');
```

### Test Full App:
1. Visit your Vercel URL
2. Sign up for a new account
3. Create a room
4. Open same room in incognito window
5. Draw on canvas and verify real-time sync

## 🐛 Troubleshooting

### "Database migration failed"
Run migrations manually via Render Shell:
```bash
cd packages/db
npx drizzle-kit migrate
```

### "CORS error" on frontend
- Verify `FRONTEND_ORIGIN` in http-api matches your exact Vercel URL
- Include protocol (https://) and exclude trailing slash

### WebSocket connection fails
- Ensure JWT_SECRET matches between http-api and ws servers
- Check WebSocket URL uses `wss://` not `ws://`
- Verify token is being passed in URL query: `?token=...`

### Render free tier services sleep after 15min inactivity
- First request after sleep takes 30-60 seconds to wake up
- Upgrade to paid plan for always-on services
- Or use a uptime monitor to ping every 10 minutes

## 💰 Cost Breakdown

**Free Tier (Sufficient for MVP):**
- Render PostgreSQL: Free (500MB)
- Render Web Services: Free (2 services, 750 hours/month total)
- Vercel: Free (100GB bandwidth)

**Paid Tier (Production):**
- Render PostgreSQL Starter: $7/month (1GB)
- Render Web Service: $7/month per service (×2 = $14)
- Vercel Pro: $20/month (1TB bandwidth)
- **Total: ~$41/month**

## 🔐 Security Checklist

- ✅ JWT_SECRET is randomly generated and secure
- ✅ DATABASE_URL contains strong password
- ✅ CORS restricted to specific frontend origin
- ✅ Environment variables not committed to git
- ✅ HTTPS/WSS enforced in production
- ✅ Database migrations run successfully

## 📊 Monitoring

### Render Dashboard:
- View logs: Service → Logs tab
- Monitor CPU/Memory: Service → Metrics
- Check deploys: Service → Events

### Vercel Dashboard:
- View build logs: Project → Deployments
- Analytics: Project → Analytics (Pro only)
- Function logs: Project → Logs

## 🔄 CI/CD

Both platforms auto-deploy on git push:
- **Vercel**: Deploys on every push to main
- **Render**: Deploys on every push to main

To disable auto-deploy:
- **Vercel**: Project Settings → Git → Disable
- **Render**: Service Settings → Auto-Deploy → Off

## 📝 Environment Variables Reference

### Frontend (.env.local)
```env
NEXT_PUBLIC_HTTP_URL=https://your-api.onrender.com/api/v1
NEXT_PUBLIC_WS_URL=wss://your-ws.onrender.com/
```

### HTTP Server
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key-here
FRONTEND_ORIGIN=https://your-app.vercel.app
SALTROUNDS=10
```

### WebSocket Server
```env
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=same-as-http-server
```

## 🎉 Next Steps

After successful deployment:
1. Set up custom domain in Vercel
2. Configure SSL certificates (auto via Vercel/Render)
3. Set up monitoring (Sentry, LogRocket)
4. Configure backups for PostgreSQL
5. Add rate limiting middleware
6. Set up staging environment

## 🆘 Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Drafty Issues**: https://github.com/rajneeshverma1/Drafty/issues
