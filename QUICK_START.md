# 🚀 Quick Start to Deployment

## Pre-Deployment Checklist

### Step 1: Supabase Setup (5 min)
- [ ] Create free account at https://supabase.com
- [ ] Create new project
- [ ] In SQL Editor, run entire `supabase_schema.sql` file
- [ ] (Optional) Run `supabase_seed.sql` for test data
- [ ] Copy Project URL and Anon Key from project settings

### Step 2: Environment Variables (2 min)
Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Step 3: Test Locally (10 min)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
bash setup.sh
```

**Or manually:**
```bash
npm install
cd server && npm install && cd ..
npm run start-all
```

Visit:
- Frontend: http://localhost:5173/
- Backend: http://localhost:5000/

**Test these features:**
- [ ] Homepage loads
- [ ] Signup/Login works
- [ ] Can browse mock tests
- [ ] No console errors (press F12)

### Step 4: Production Build (2 min)
```bash
npm run build
```

Should complete with ✓ in ~10 seconds

### Step 5: Deploy to Vercel (5 min)

1. Push code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

Wait 2-3 minutes... **Done!** 🎉

---

## After Deployment

### Verify Live Site
- [ ] Open your Vercel URL (e.g., https://portfolio-xyz.vercel.app)
- [ ] Signup with a test account
- [ ] Check Supabase Dashboard → users table for new user
- [ ] Browse mock tests
- [ ] Open DevTools (F12) → Console should be clean

### Optional: Add Custom Domain
- In Vercel Dashboard → Domains
- Add your domain
- Update DNS records (Vercel shows how)
- Wait 24-48 hours for propagation

---

## Important Files Created

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete detailed guide |
| `.env.example` | Environment variables template |
| `supabase_schema.sql` | Database structure (run in Supabase) |
| `supabase_seed.sql` | Mock test data (optional) |
| `setup.bat` / `setup.sh` | Quick setup script |

---

## Troubleshooting

**"Can't connect to Supabase"**
- Check `.env.local` has correct URL and key
- Verify keys are from correct Supabase project

**"User not found in database"**
- Run `supabase_schema.sql` in Supabase SQL Editor
- Check RLS policies are set correctly

**"Build fails locally"**
```bash
rm -r node_modules package-lock.json
npm install
npm run build
```

**"Vercel deployment fails"**
- Check build command: `npm run build`
- Check output directory: `dist`
- Verify env variables are set in Vercel

---

## 📞 Support

- **Supabase Issues:** https://supabase.com/docs
- **Vercel Issues:** https://vercel.com/docs
- **React/Vite:** https://vitejs.dev/guide/

---

**Estimated Total Time: 30 minutes ⏱️**

Good luck! 🚀
