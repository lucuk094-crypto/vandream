# Panduan Deployment ke Vercel

## ✅ Status Proyek
- ✅ Build berhasil tanpa error
- ✅ TypeScript compiled successfully
- ✅ Semua route berfungsi dengan baik
- ✅ Konfigurasi Next.js optimal
- ✅ Environment variables sudah dikonfigurasi

## 🚀 Langkah Deployment ke Vercel

### 1. Persiapan Repository

Pastikan proyek sudah ada di Git repository (GitHub, GitLab, atau Bitbucket):

```bash
# Jika belum init git
git init

# Add semua file
git add .

# Commit
git commit -m "Initial commit - Van Dream Drama Streaming"

# Push ke remote repository
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 2. Deploy ke Vercel

#### Opsi A: Via Vercel Dashboard (Recommended)

1. **Buka [vercel.com](https://vercel.com)** dan login/daftar
2. Klik **"Add New Project"**
3. **Import Repository**:
   - Pilih GitHub/GitLab/Bitbucket
   - Cari repository "vandream"
   - Klik **Import**
4. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `vandream` (jika ada parent folder) atau biarkan `.` (root)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. **Environment Variables** - Tambahkan variabel berikut:
   ```
   NUNOMIX_BASE_URL=https://nunodrama.my.id/api/nunomix
   NUNOMIX_TOKEN=your-actual-token-here
   SITE_URL=https://your-domain.vercel.app
   ```
   
   > ⚠️ **PENTING**: Pastikan `NUNOMIX_TOKEN` diisi dengan token yang valid!
   
6. Klik **Deploy**
7. Tunggu hingga deployment selesai (biasanya 2-5 menit)

#### Opsi B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd vandream
vercel

# Ikuti prompt untuk configure project
# Pastikan environment variables sudah diset via dashboard
```

### 3. Konfigurasi Environment Variables

Setelah deployment pertama, tambahkan/edit environment variables:

1. Buka **Project Settings** → **Environment Variables**
2. Tambahkan variabel untuk **Production**, **Preview**, dan **Development**:

| Variable | Value | Description |
|----------|-------|-------------|
| `NUNOMIX_BASE_URL` | `https://nunodrama.my.id/api/nunomix` | Base URL API NunoMix |
| `NUNOMIX_TOKEN` | `your-token-here` | Token API (wajib diisi!) |
| `SITE_URL` | `https://your-domain.vercel.app` | URL production untuk metadata |

3. Klik **Save**
4. **Redeploy** project agar environment variables diterapkan

### 4. Custom Domain (Opsional)

Untuk menggunakan domain sendiri:

1. Buka **Project Settings** → **Domains**
2. Klik **Add Domain**
3. Masukkan domain Anda (contoh: `vandream.com`)
4. Ikuti instruksi untuk setup DNS:
   - Untuk subdomain: tambahkan CNAME record ke `cname.vercel-dns.com`
   - Untuk root domain: tambahkan A record sesuai instruksi Vercel
5. Tunggu DNS propagation (5-60 menit)
6. Update `SITE_URL` environment variable dengan domain baru
7. Redeploy

### 5. Verifikasi Deployment

Setelah deployment berhasil, verifikasi:

- ✅ Buka URL production
- ✅ Homepage memuat drama list
- ✅ Coba search drama
- ✅ Coba play video
- ✅ Check favorites & continue watching
- ✅ Test responsive (mobile & desktop)

## 🔧 Troubleshooting

### Error: "NUNOMIX_TOKEN is not set"

**Solusi**: 
- Pastikan environment variable `NUNOMIX_TOKEN` sudah diset di Vercel
- Redeploy setelah menambahkan variable
- Pastikan token tidak di-encode (gunakan token mentah)

### Error: "Something went wrong"

**Solusi**:
- Check Vercel Function Logs di dashboard
- Verifikasi API token masih valid
- Pastikan `NUNOMIX_BASE_URL` benar

### Build Failed

**Solusi**:
- Check build logs di Vercel
- Pastikan semua dependencies ada di `package.json`
- Verifikasi Node.js version compatible (18.x atau higher)

### Video Tidak Play

**Solusi**:
- Check browser console untuk error CORS
- Verifikasi `/api/stream` endpoint working
- Test dengan video player lain

## 📊 Performance Optimization

Proyek sudah dioptimasi dengan:

- ✅ Server-side caching (10m - 1h per endpoint)
- ✅ Static page generation untuk routes statis
- ✅ Image lazy loading
- ✅ Code splitting otomatis
- ✅ Tailwind CSS tree-shaking
- ✅ HLS.js untuk video streaming

## 🔒 Security Checklist

- ✅ API token tersimpan di environment variables (tidak di code)
- ✅ Server-only imports untuk API client
- ✅ Input validation di semua API routes
- ✅ Error messages tidak expose data sensitif
- ✅ CORS handled dengan baik
- ✅ `.env.local` di .gitignore

## 📱 Monitoring

Setelah live, monitor via Vercel dashboard:

- **Analytics**: Traffic, page views, countries
- **Speed Insights**: Core Web Vitals, performance
- **Function Logs**: API errors, latency
- **Deployment Logs**: Build success/failure

## 🎯 Next Steps

Setelah deployment berhasil:

1. ✅ Test semua fitur di production
2. ✅ Setup custom domain (jika ada)
3. ✅ Monitor analytics & performance
4. ✅ Tambahkan meta tags/SEO optimization
5. ✅ Setup error tracking (Sentry, LogRocket, dll)

## 📞 Support

Jika ada masalah saat deployment:

- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)
- Review project README.md untuk detail teknis
- Check GitHub Issues untuk project ini

---

**Last Updated**: 2026-09-13  
**Version**: 1.0.0  
**Framework**: Next.js 16.3.5  
**Node Version**: 18.x or higher
