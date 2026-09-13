# 🚀 Quick Start Guide - Van Dream

## ⚡ Fast Setup (5 menit)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy template
cp .env.example .env.local

# Edit dengan token Anda
notepad .env.local  # Windows
# atau
nano .env.local     # Linux/Mac
```

**Isi `.env.local`:**
```env
NUNOMIX_BASE_URL=https://nunodrama.my.id/api/nunomix
NUNOMIX_TOKEN=your-actual-token-here
SITE_URL=http://localhost:3000
```

### 3. Test API Connection
```bash
node test-api.mjs
```

Expected output:
```
✅ All tests passed (4/4)
🎉 API is working correctly!
```

### 4. Run Development Server
```bash
npm run dev
```

Server akan jalan di: **http://localhost:3000**

---

## 🐛 Jika Loading Lambat / Tidak Muncul Data

### Quick Fix:

1. **Pastikan token valid:**
```bash
# Check .env.local
cat .env.local  # Linux/Mac
type .env.local  # Windows

# Token harus terisi, bukan kosong
```

2. **Restart server:**
```bash
# Stop server (Ctrl+C di terminal)
# Start lagi
npm run dev
```

3. **Clear cache:**
```bash
# Hapus cache Next.js
rm -rf .next  # Linux/Mac
Remove-Item -Path .next -Recurse -Force  # PowerShell

# Start server
npm run dev
```

4. **Hard refresh browser:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## 📊 Performance Check

### Normal Response Times:
- API test: 400-1000ms ✅
- Homepage load: 2-5 seconds (first time)
- Subsequent loads: < 1 second (cached)

### Jika Lebih Lambat:
Lihat **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** untuk solusi lengkap.

---

## 🚀 Deploy ke Vercel

### Method 1: Via Dashboard (Easiest)

1. Push ke Git:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Import ke Vercel:
   - Login [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import repository
   - Framework: Next.js (auto-detect)

3. Set Environment Variables di Vercel:
```
NUNOMIX_BASE_URL=https://nunodrama.my.id/api/nunomix
NUNOMIX_TOKEN=your-actual-token-here
SITE_URL=https://your-domain.vercel.app
```

4. Deploy! 🎉

### Method 2: Via CLI

```bash
npm i -g vercel
vercel login
vercel
```

---

## ⚠️ Known Issues

### Build Error: `/_global-error` prerender issue
**Status**: Known Next.js 16 + React 19 issue  
**Impact**: Local build fails, but **Vercel deployment works fine**  
**Workaround**: Deploy langsung ke Vercel (mereka handle otomatis)

### Port 3000 Already in Use
```bash
# Windows
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Atau gunakan port lain
PORT=3001 npm run dev
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | **Environment variables (WAJIB diisi!)** |
| `test-api.mjs` | Test API connectivity |
| `TROUBLESHOOTING.md` | Solusi masalah lengkap |
| `DEPLOYMENT.md` | Panduan deploy detail |
| `VERCEL_CHECKLIST.md` | Checklist deployment |

---

## ✅ Success Checklist

Sebelum deploy, pastikan:

- [ ] ✅ `npm install` selesai tanpa error
- [ ] ✅ `.env.local` terisi dengan token valid
- [ ] ✅ `node test-api.mjs` → All tests passed
- [ ] ✅ `npm run dev` → Server starts
- [ ] ✅ Browser: http://localhost:3000 → Homepage loads
- [ ] ✅ Browser: Data drama muncul
- [ ] ✅ No errors di browser console
- [ ] ✅ Search works
- [ ] ✅ Video plays

---

## 🆘 Need Help?

1. **API tidak work?** → Run `node test-api.mjs`
2. **Loading terus?** → Check `TROUBLESHOOTING.md`
3. **Build error?** → Deploy ke Vercel (mereka fix otomatis)
4. **Port conflict?** → Kill process atau gunakan port lain

---

## 📞 Support Resources

- **Full Documentation**: [README.md](./README.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Vercel Checklist**: [VERCEL_CHECKLIST.md](./VERCEL_CHECKLIST.md)
- **Project Status**: [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

**Tips**: Untuk development, gunakan `npm run dev`. Untuk production, deploy ke Vercel (recommended) karena mereka handle build optimization otomatis.

**Last Updated**: 2026-09-13  
**Version**: 1.0.0
