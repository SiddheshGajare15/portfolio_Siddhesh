# Complete Deployment Guide for Siddhesh Portfolio

## ✅ STEP 1: Setup Supabase (Database Backend)

### 1.1 Create a Supabase Project
1. Go to https://supabase.com → Sign up/Login
2. Create a new project (choose region closest to your users)
3. Wait for it to initialize (3-5 minutes)
4. In project settings, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

### 1.2 Run the Schema
1. Go to Supabase Dashboard → **SQL Editor** → **New Query**
2. Copy the entire content from `supabase_schema.sql`
3. Paste and click **Run**
4. Wait for completion (should say "Success")

### 1.3 Seed Test Data (Optional but Recommended)
1. In SQL Editor → **New Query**
2. Copy the entire content from `supabase_seed.sql`
3. Run it (creates sample mock tests)

---

## ✅ STEP 2: Setup Environment Variables

### 2.1 Frontend (.env.local)
Create a file at the project root: `.env.local`

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Example:**
```env
VITE_SUPABASE_URL=https://fibjdxigxrylewsupdzb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 Backend Server (.env)
Create a file at `server/.env`:

```env
OPENAI_API_KEY=sk-xxx...
PORT=5000
```

Get OpenAI API Key from: https://platform.openai.com/api-keys

---

## ✅ STEP 3: Test Locally

### 3.1 Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 3.2 Start Dev Server
```bash
npm run start-all
```

This will start:
- Frontend: http://localhost:5173/
- Backend: http://localhost:5000/

### 3.3 Test Features
- [ ] **Homepage loads** → Check http://localhost:5173/
- [ ] **Signup works** → Register new account
- [ ] **Login works** → Sign in with created account
- [ ] **Database syncs** → Check browser console for errors (should have none)
- [ ] **AI Explainer works** → Click "AITest" → "Test OpenRouter AI"
- [ ] **Mock tests load** → Navigate to CDAC section
- [ ] **Free mock test accessible** → Start a free test without payment
- [ ] **Payment modal appears** → Try accessing premium test

### 3.4 Check Console for Errors
- Open DevTools (F12)
- **Console tab** should be clear (no red errors)
- **Network tab** should show successful API calls to Supabase

---

## ✅ STEP 4: Build for Production

### 4.1 Build Frontend
```bash
npm run build
```

This creates `dist/` folder optimized for deployment.

### 4.2 Verify Build
```bash
npm run preview
```

Should show production build at http://localhost:4173/

---

## ✅ STEP 5: Deploy to Vercel

### 5.1 Prepare for Vercel
1. Make sure your project is on GitHub
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### 5.2 Deploy Frontend
1. Go to https://vercel.com → Sign up/Login with GitHub
2. Click **"New Project"**
3. Import your GitHub repository
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build` (should auto-fill)
6. **Output Directory:** `dist` (should auto-fill)

### 5.3 Add Environment Variables
In Vercel Project Settings → **Environment Variables**, add:

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_anon_key
```

### 5.4 Deploy Backend API (Optional)
If you're using the AI explainer feature:

**Option A: Deploy to Railway.app (Recommended)**
1. Go to https://railway.app
2. Create new project → Deploy from GitHub
3. Select your repo
4. Add environment variables:
   ```
   OPENAI_API_KEY=sk-xxx
   PORT=3000
   ```
5. Once deployed, get the URL → Update `API_URL` in `src/aiService.js`

**Option B: Use Alternative AI Service**
- Current code uses OpenRouter API (already in backend)
- Update `src/aiService.js` to call your AI service

### 5.5 Click Deploy
Vercel will:
1. Build your app
2. Run tests
3. Deploy to production
4. Give you a live URL (example: `https://portfolio-xxx.vercel.app`)

---

## ✅ STEP 6: Post-Deployment Testing

### 6.1 Test Live Application
- [ ] Site loads without errors
- [ ] Signup creates new users in Supabase
- [ ] Login works
- [ ] User data appears in Supabase `users` table
- [ ] Mock tests load
- [ ] No 404 errors in console

### 6.2 Verify Supabase Connection
1. Go to Supabase Dashboard
2. **Table Editor** → Check `users` table
3. Should see new user accounts created during testing

### 6.3 Monitor for Errors
```bash
# In Vercel Dashboard → Deployments → View Logs
# Check for any error messages
```

---

## ✅ STEP 7: Custom Domain (Optional)

1. In Vercel → Project Settings → **Domains**
2. Add your custom domain
3. Update DNS records (Vercel shows instructions)
4. Wait 24-48 hours for DNS propagation

---

## 🚨 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Supabase Connection Error | Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct |
| 406 User Row Error | Make sure you ran `supabase_schema.sql` with the INSERT policy |
| Build Fails | Run `npm install` again, delete `node_modules`, try again |
| Favicon 404 | Already fixed - favicon references are commented out |
| AI Explainer 500 Error | Check OpenAI API key is valid and has credits |

---

## 📋 FINAL CHECKLIST BEFORE LAUNCH

- [ ] Supabase project created and schema applied
- [ ] Environment variables set locally
- [ ] Local testing passed (all features work)
- [ ] Build succeeds (`npm run build` has no errors)
- [ ] Production preview works (`npm run preview`)
- [ ] Code pushed to GitHub
- [ ] Vercel project connected and deployed
- [ ] Environment variables added to Vercel
- [ ] Live site tested (signup/login/features work)
- [ ] Supabase dashboard shows new users
- [ ] No console errors on live site
- [ ] Performance is acceptable (Vercel analytics)

---

## 🎉 YOU'RE LIVE!

Your portfolio is now live and ready to serve users. Monitor Vercel logs and Supabase for any issues.

**Support:**
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Report bugs to your email
