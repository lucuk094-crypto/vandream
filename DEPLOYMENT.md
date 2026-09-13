# Van Dream - Deployment Guide untuk Vercel

## Status Build
✅ **Build SUCCESSFUL** - Siap untuk deployment ke Vercel

## Perubahan yang Telah Dilakukan

### 1. Fixed Build Errors
- ✅ Downgrade dari Next.js 16.3.5 + React 19 → Next.js 15.1.6 + React 18.3.1
- ✅ Fix TypeScript errors (PageProps → explicit types)
- ✅ Fix ESLint configuration
- ✅ Remove invalid next.config options

### 2. Performance Optimizations
- ✅ Reduced API timeout: 30s → 10s
- ✅ Optimized cache revalidation times
- ✅ Static generation for homepage
- ✅ Added vercel.json configuration

### 3. Configuration Files
- ✅ `vercel.json` - Deployment configuration dengan caching headers
- ✅ `.env.example` - Template untuk environment variables
- ✅ `.env.local` - Local environment (JANGAN commit!)
- ✅ `.gitignore` - Memastikan .env files tidak tercommit

## Langkah Deployment ke Vercel

### Pre-Deployment Checklist
- [ ] Pastikan NUNOMIX_TOKEN valid dan tersimpan dengan aman
- [ ] Test build lokal: `npm run build` berhasil
- [ ] Test run lokal: `npm start` berjalan tanpa error
- [ ] Commit semua perubahan ke Git repository

### Step 1: Push ke Git Repository

```bash
# Initialize git jika belum
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Add remote (ganti dengan URL repo Anda)
git remote add origin https://github.com/username/vandream.git

# Push ke main branch
git push -u origin main
```

### Step 2: Deploy ke Vercel

1. **Buka Vercel Dashboard**
   - Login ke https://vercel.com
   - Click "Add New" → "Project"

2. **Import Repository**
   - Connect GitHub/GitLab account jika belum
   - Select repository vandream
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected ✅)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default ✅)
   - Output Directory: `.next` (default ✅)
   - Install Command: `npm install` (default ✅)

4. **Environment Variables** (PENTING!)
   
   Tambahkan 3 environment variables di Vercel:
   
   | Key | Value | Example |
   |-----|-------|---------|
   | `NUNOMIX_BASE_URL` | `https://nunodrama.my.id/api/nunomix` | (URL API) |
   | `NUNOMIX_TOKEN` | `your-token-here` | ⚠️ RAHASIA! |
   | `SITE_URL` | `https://your-domain.vercel.app` | (domain Vercel Anda) |
   
   **Apply to:** Production, Preview, Development (centang semua)

5. **Deploy!**
   - Click "Deploy"
   - Wait ~2-3 menit untuk build selesai
   - ✅ Project deployed!

### Step 3: Verify Deployment

Test semua fitur di production:

- [ ] Homepage loading dengan data drama
- [ ] Carousel hero berfungsi
- [ ] Klik drama card → detail page muncul
- [ ] Episode list tampil di detail page
- [ ] Video player berfungsi (klik episode)
- [ ] Search drama berfungsi
- [ ] Continue Watching works
- [ ] Favorites feature works
- [ ] Mobile navigation responsive

### Step 4: Custom Domain (Opsional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records (A/CNAME):
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Update `SITE_URL` env variable:
   ```
   SITE_URL=https://yourdomain.com
   ```
5. Redeploy untuk apply perubahan

## Troubleshooting

### Build Fails

**Error: "NUNOMIX_TOKEN is not set"**
```
✗ Solution: Add NUNOMIX_TOKEN to Vercel environment variables
```

**Error: "Cannot find module"**
```
✗ Solution: npm install mungkin gagal
  → Check build logs
  → Pastikan package.json valid
```

### Runtime Errors

**500 Error pada /api/* routes**
```
✗ Check Vercel Functions logs:
  → Dashboard → Functions tab
  → Click function name untuk lihat logs
```

**Data drama tidak muncul**
```
✗ Kemungkinan:
  1. NUNOMIX_TOKEN invalid → check di Vercel env vars
  2. API timeout → check function logs
  3. Network error → check upstream API status
```

**"Loading..." tidak selesai**
```
✗ Kemungkinan:
  1. API response slow (>10s timeout)
  2. Upstream API down
  → Check browser console & network tab
```

### Performance Issues

**Slow initial load**
```
✓ Solutions:
  - Cache headers sudah dikonfigurasi di vercel.json
  - Consider upgrading Vercel plan untuk better edge caching
  - Monitor via Vercel Analytics
```

## Post-Deployment

### Monitoring
- Enable Vercel Analytics untuk track performance
- Check error logs secara berkala di Functions tab
- Monitor API usage dari NUNOMIX dashboard (jika ada)

### Updates
```bash
# Untuk update code:
git add .
git commit -m "Your changes"
git push origin main

# Vercel akan auto-deploy setiap push ke main branch
```

### Environment Variables Update
1. Go to Project Settings → Environment Variables
2. Edit variable yang ingin diubah
3. Click "Save"
4. **Redeploy** untuk apply perubahan (klik Deployments → tiga titik → Redeploy)

## Kontak & Support

Jika ada masalah:
1. Check logs di Vercel Dashboard → Functions
2. Check browser console untuk client errors
3. Verify environment variables configured correctly
4. Test locally dengan `npm run build && npm start`

---

**Build Date:** 2026-09-13  
**Next.js Version:** 15.1.6  
**React Version:** 18.3.1  
**Node Version Required:** 18.x or later

✅ Project siap deploy ke Vercel!
