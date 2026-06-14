# 🚀 Drafty FREE Deployment (No Credit Card Required)

Deploy Drafty completely FREE using Vercel + Supabase (no credit card needed).

## 🎯 What We'll Use

- **Vercel** - Frontend + API Routes (Free: 100GB bandwidth, serverless functions)
- **Supabase** - PostgreSQL Database (Free: 500MB storage, no card required)

## ⚠️ Important Limitation

WebSocket server cannot run on Vercel (serverless functions don't support persistent connections). 

**Two solutions:**
1. **For MVP/Testing**: Deploy without real-time drawing sync (chat + drawing works, but not collaborative)
2. **For Production**: Use Railway.app for WebSocket (requires card but stays free if under 5$/month usage)

Let's start with **Solution 1** (100% free, no card):

---

## 📋 Step 1: Create Supabase Database (2 minutes)

1. **Go to Supabase:**
   ```
   https://supabase.com/dashboard/sign-in
   ```

2. **Sign up with GitHub** (no card required)

3. **Create New Project:**
   - Click "New Project"
   - **Name**: drafty
   - **Database Password**: (create strong password, save it!)
   - **Region**: Choose closest to you
   - Click "Create new project"
   - Wait 2 minutes for provisioning

4. **Get Database URL:**
   - Go to **Project Settings** (gear icon, bottom left)
   - Click **Database** section
   - Find **Connection String** → **URI** format
   - Copy the connection string, looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
   ```
   - **Replace `[YOUR-PASSWORD]` with your actual password**

5. **Run Migrations:**
   - In Supabase dashboard, go to **SQL Editor** (left sidebar)
   - Click "New Query"
   - Copy and paste migration SQL (I'll provide below)

---

## 🗄️ Database Migration SQL

Run this in Supabase SQL Editor:

```sql
-- Create shape enum
CREATE TYPE shape AS ENUM (
  'rectangle',
  'diamond', 
  'circle',
  'line',
  'arrow',
  'text',
  'freeHand'
);

-- Create users table
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  photo TEXT
);

-- Create rooms table  
CREATE TABLE room (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  "joinCode" TEXT UNIQUE NOT NULL,
  "adminId" UUID NOT NULL REFERENCES "user"(id),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create chats table
CREATE TABLE chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "serialNumber" SERIAL,
  content TEXT NOT NULL,
  "userId" UUID NOT NULL REFERENCES "user"(id),
  "roomId" UUID NOT NULL REFERENCES room(id),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create draws table
CREATE TABLE draw (
  id TEXT PRIMARY KEY,
  shape shape NOT NULL,
  "strokeStyle" TEXT NOT NULL,
  "fillStyle" TEXT NOT NULL,
  "lineWidth" REAL NOT NULL,
  font TEXT,
  "fontSize" TEXT,
  "startX" REAL,
  "startY" REAL,
  "endX" REAL,
  "endY" REAL,
  text TEXT,
  points JSONB,
  "roomId" UUID NOT NULL REFERENCES room(id)
);

-- Create room_participants table
CREATE TABLE room_participants (
  "roomId" UUID NOT NULL REFERENCES room(id),
  "userId" UUID NOT NULL REFERENCES "user"(id),
  PRIMARY KEY ("roomId", "userId")
);

-- Create indexes for performance
CREATE INDEX idx_chat_room ON chat("roomId");
CREATE INDEX idx_chat_serial ON chat("serialNumber");
CREATE INDEX idx_draw_room ON draw("roomId");
CREATE INDEX idx_room_participants_user ON room_participants("userId");
```

Click **Run** (Ctrl+Enter or Cmd+Enter)

You should see: **Success. No rows returned**

---

## 🌐 Step 2: Deploy to Vercel (5 minutes)

1. **Open Vercel:**
   ```
   https://vercel.com/signup
   ```

2. **Sign up with GitHub** (no card required)

3. **Import Drafty Project:**
   - Click **"Add New..."** → **"Project"**  
   - Find **"Drafty"** repository
   - Click **"Import"**

4. **Configure Build Settings:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: **`apps/web`** ← IMPORTANT!
   - Build Command: Leave default
   - Install Command: Leave default

5. **Add Environment Variables:**
   Click **"Environment Variables"** and add these:

   ```
   Name: DATABASE_URL
   Value: postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres
   ```
   (Use your Supabase connection string)

   ```
   Name: JWT_SECRET
   Value: d8f3h9k2m5n7p1q4r6s8t0v2w4x6y9z1a3b5c7e9f2g4h6j8
   ```

   ```
   Name: SALTROUNDS
   Value: 10
   ```

   ```
   Name: NEXT_PUBLIC_HTTP_URL
   Value: /api/v1
   ```

   ```
   Name: NEXT_PUBLIC_WS_URL
   Value: 
   ```
   (Leave empty - WebSocket won't work in free tier)

6. **Click "Deploy"**
   - Build takes 3-5 minutes
   - You'll get URL like: `https://drafty-xyz.vercel.app`

---

## ❌ What Won't Work (WebSocket Real-time Sync)

Without WebSocket server:
- ❌ Real-time collaborative drawing
- ❌ Live cursor tracking
- ❌ Instant chat updates

What WILL work:
- ✅ User signup/login
- ✅ Create/join rooms
- ✅ Drawing on canvas (personal, not synced)
- ✅ Chat messages (refresh to see new ones)

---

## 🚀 Option 2: Add Real-Time with Railway (Requires Card)

If you want full real-time features:

### Deploy WebSocket to Railway.app

1. **Go to Railway:**
   ```
   https://railway.app
   ```

2. **Sign up with GitHub**
   - Add card (required for free tier)
   - Free tier: $5/month credit (WebSocket uses ~$0-3)

3. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose "Drafty"

4. **Add Service:**
   - Click "New Service"
   - Select "Dockerfile"
   - Set Dockerfile path: `apps/ws-server/Dockerfile`
   - Set build context: `.`

5. **Add Environment Variables:**
   ```
   PORT=8080
   DATABASE_URL=(same as Supabase)
   JWT_SECRET=(same as Vercel)
   ```

6. **Generate Domain:**
   - Settings → Generate Domain
   - Copy URL: `https://xxx.up.railway.app`

7. **Update Vercel:**
   - Go to Vercel project settings
   - Environment Variables
   - Update `NEXT_PUBLIC_WS_URL` to: `wss://xxx.up.railway.app/`
   - Redeploy

---

## ✅ Test Your Deployment

1. Open your Vercel URL: `https://drafty-xyz.vercel.app`
2. Click "Sign Up"
3. Create account: username, password, name
4. Create a room
5. Try drawing!

---

## 🐛 Troubleshooting

**"Failed to load resource" errors:**
- Check browser console (F12)
- Verify DATABASE_URL is correct in Vercel
- Check Supabase project is "Active"

**"Invalid credentials" on login:**
- Make sure migrations ran successfully in Supabase
- Check "user" table exists: Supabase → Table Editor

**Build fails on Vercel:**
- Check build logs
- Ensure Root Directory is set to `apps/web`
- Verify all dependencies in package.json

---

## 💰 Cost Summary

**100% Free (No Card):**
- Vercel: Free tier (100GB/month)
- Supabase: Free tier (500MB DB)
- **Total: $0/month**
- ❌ No real-time sync

**With Real-Time ($0-3/month):**
- Vercel: Free
- Supabase: Free  
- Railway: $5 credit/month (WebSocket uses $0-3)
- **Total: $0-3/month**
- ✅ Full features

---

**Ready to start? Tell me when you reach Step 1!** 🚀
