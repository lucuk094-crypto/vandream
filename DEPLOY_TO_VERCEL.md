# 🚀 Deploy Van Dream ke Vercel

**Repository GitHub**: https://github.com/lucuk094-crypto/vandream.git  
**Status**: ✅ Code sudah di-push ke GitHub

---

## 📋 Langkah Deploy (5 Menit)

### 1. **Buka Vercel Dashboard**
👉 https://vercel.com/login

- Login dengan GitHub account Anda
- Atau signup jika belum punya akun

---

### 2. **Import Project**

1. Klik tombol **"Add New..."** → **"Project"**
2. Pilih **"Import Git Repository"**
3. Cari repository: **`lucuk094-crypto/vandream`**
4. Klik **"Import"**

---

### 3. **Configure Project**

Vercel akan auto-detect Next.js. Pastikan setting ini:

```
Framework Preset: Next.js (auto-detected) ✅
Root Directory: ./ (default)
Build Command: npm run build (auto)
Output Directory: .next (auto)
Install Command: npm install (auto)
Node.js Version: 18.x (auto)
```

**Jangan ubah apapun di bagian ini!**

---

### 4. **⚠️ SET ENVIRONMENT VARIABLES** (PALING PENTING!)

Klik **"Environment Variables"** dan tambahkan 3 variabel ini:

#### ✅ Variable 1:
```
Name: NUNOMIX_BASE_URL
Value: https://nunodrama.my.id/api/nunomix
```

#### ✅ Variable 2: (WAJIB!)
```
Name: NUNOMIX_TOKEN
Value: <paste-token-anda-disini>
```
> ⚠️ **CRITICAL**: Ini token API NunoMix Anda. Tanpa ini, website tidak akan berfungsi!

#### ✅ Variable 3: (Optional, isi setelah deploy)
```
Name: SITE_URL
Value: https://vandream.vercel.app
```
(Ganti dengan domain Vercel Anda setelah deploy)

**Set untuk**: ✅ Production, ✅ Preview, ✅ Development (checklist semua)

---

### 5. **Deploy!**

1. Klik tombol **"Deploy"** 
2. Tunggu 2-5 menit
3. ✅ Done! 

Vercel akan memberikan URL seperti:
```
https://vandream-xxx.vercel.app
```

---

## 🎯 Setelah Deploy

### ✅ Test Website

Buka URL Vercel Anda dan test:
- [ ] Homepage loading dengan drama list
- [ ] Klik drama → detail page berfungsi
- [ ] Search berfungsi
- [ ] Video play berfungsi
- [ ] Mobile responsive

### 🔄 Update SITE_URL

1. Kembali ke Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Edit `SITE_URL`:
   ```
   https://vandream-xxx.vercel.app
   ```
4. **Redeploy**: Deployments → titik tiga → Redeploy

---

## 🌐 Custom Domain (Optional)

Jika punya domain sendiri (misal: `vandream.com`):

1. **Vercel Dashboard** → Project → **Settings** → **Domains**
2. Klik **Add Domain**
3. Masukkan domain Anda
4. Ikuti instruksi DNS:
   - **Subdomain** (www.vandream.com): CNAME → `cname.vercel-dns.com`
   - **Root domain** (vandream.com): A record → IP Vercel
5. Tunggu DNS propagation (5-60 menit)
6. Update `SITE_URL` dengan domain baru
7. Redeploy

---

## 🔧 Troubleshooting

### ❌ Build Failed
**Cek:**
- Environment variables sudah di-set semua?
- Token valid?

**Fix:**
- Ke **Settings** → **Environment Variables**
- Pastikan `NUNOMIX_TOKEN` terisi
- Redeploy: **Deployments** → **Redeploy**

### ❌ "Something went wrong"
**Cek:**
- Build logs di Vercel
- Function logs di **Deployments** → klik deployment → **Function Logs**

**Fix:**
- Pastikan token masih valid
- Test API: https://nunodrama.my.id/api/nunomix/all_drama?page=1&token=YOUR_TOKEN

### ❌ Video Tidak Play
**Normal** - Beberapa video dari upstream mungkin tidak available. Try video lain.

---

## 📊 Monitoring

Setelah live, monitor di Vercel Dashboard:

### Analytics
- **Traffic**: Page views, unique visitors
- **Geography**: Visitor countries
- **Performance**: Core Web Vitals

### Function Logs
- **Real-time logs**: Live requests
- **Error logs**: API errors
- **Performance**: Response times

---

## 🔄 Update Code

Setelah deploy, jika ada perubahan:

```bash
# Edit file...
git add .
git commit -m "Update: description"
git push origin master
```

**Vercel auto-deploy** setiap kali Anda push ke GitHub! 🎉

---

## ⚡ Performance Expected

Setelah deploy ke Vercel:

- **First Load**: < 2 seconds
- **API Response**: 200-600ms
- **Subsequent Pages**: < 500ms
- **Lighthouse Score**: 90+ (Performance)

Jauh lebih cepat dari local development!

---

## 📞 Support

Jika ada masalah:

1. **Check Build Logs** di Vercel
2. **Check Function Logs** untuk API errors
3. **Browser DevTools** (F12) → Network tab
4. **Baca**: `TROUBLESHOOTING.md` di repository

---

## ✅ Deployment Checklist

- [x] ✅ Code pushed ke GitHub
- [ ] ⏳ Login ke Vercel
- [ ] ⏳ Import repository
- [ ] ⏳ Set environment variables
  - [ ] `NUNOMIX_BASE_URL`
  - [ ] `NUNOMIX_TOKEN` ⚠️ PENTING!
  - [ ] `SITE_URL` (optional)
- [ ] ⏳ Deploy
- [ ] ⏳ Test website
- [ ] ⏳ Update SITE_URL (optional)
- [ ] ⏳ Custom domain (optional)

---

## 🎉 Quick Summary

1. **Vercel.com** → Login
2. **Import** → `lucuk094-crypto/vandream`
3. **Environment Variables** → Set 3 variables
4. **Deploy** → Tunggu 2-5 menit
5. **Test** → Buka URL Vercel
6. **Done!** 🚀

---

**Repository**: https://github.com/lucuk094-crypto/vandream.git  
**Last Push**: Just now  
**Status**: ✅ Ready to Deploy  
**Estimated Time**: 5 minutes

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Repo**: https://github.com/lucuk094-crypto/vandream

---

**🎯 Next Step**: Login ke Vercel dan import project sekarang!

Good luck! 🚀
