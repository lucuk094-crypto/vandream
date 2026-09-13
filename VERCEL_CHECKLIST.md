# ✅ Vercel Deployment Checklist

## Pre-Deployment Checks

### ✅ Code Quality
- [x] Build berhasil tanpa error (`npm run build`)
- [x] TypeScript compiled successfully
- [x] Tidak ada console.log di production code
- [x] Tidak ada TODO/FIXME yang critical

### ✅ Configuration Files
- [x] `package.json` - Dependencies lengkap
- [x] `tsconfig.json` - TypeScript config optimal
- [x] `next.config.ts` - Next.js config untuk Vercel
- [x] `vercel.json` - Vercel-specific configuration
- [x] `.gitignore` - Mengexclude `.env.local`, `node_modules`, `.next`
- [x] `.env.example` - Template untuk environment variables

### ✅ Security
- [x] API token tidak di-commit ke repository
- [x] Environment variables menggunakan server-side only
- [x] Input validation di semua API routes
- [x] Error messages tidak expose sensitive data
- [x] CORS configuration proper

### ✅ Performance
- [x] Server-side caching implemented
- [x] Image lazy loading
- [x] Static page generation untuk routes yang bisa
- [x] Code splitting otomatis
- [x] CSS optimized dengan Tailwind

## Deployment Steps

### 1. Git Repository Setup
```bash
# Check status
git status

# Stage all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Push ke remote
git push origin main
```

### 2. Vercel Project Setup
- [ ] Login ke [vercel.com](https://vercel.com)
- [ ] Klik "Add New Project"
- [ ] Import repository
- [ ] Framework preset: Next.js (auto-detect)
- [ ] Root directory: `vandream` (atau `.` jika repo root adalah project root)

### 3. Environment Variables (CRITICAL!)
Tambahkan di Vercel Dashboard → Project Settings → Environment Variables:

**Production, Preview, Development:**
```
NUNOMIX_BASE_URL=https://nunodrama.my.id/api/nunomix
NUNOMIX_TOKEN=<your-actual-token>
SITE_URL=https://<your-vercel-domain>.vercel.app
```

> ⚠️ **WAJIB**: `NUNOMIX_TOKEN` harus diisi dengan token valid!

### 4. Deploy
- [ ] Klik "Deploy"
- [ ] Tunggu build selesai (2-5 menit)
- [ ] Check deployment logs untuk error

### 5. Post-Deployment Verification
- [ ] Homepage loading dengan drama list
- [ ] Search berfungsi
- [ ] Detail drama page berfungsi
- [ ] Video player working
- [ ] Continue watching working (localStorage)
- [ ] Favorites working (localStorage)
- [ ] Mobile responsive
- [ ] Desktop layout proper

## Environment Variables Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NUNOMIX_BASE_URL` | Yes | `https://nunodrama.my.id/api/nunomix` | API base URL |
| `NUNOMIX_TOKEN` | **Yes** | `your-token-here` | API authentication token |
| `SITE_URL` | No | `https://vandream.vercel.app` | Production URL (untuk metadata) |

## Build Configuration

Default configuration (sudah optimal):
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x (auto-detected)

## Custom Domain Setup (Optional)

Jika menggunakan custom domain:

1. **Add Domain** di Vercel Dashboard
2. **Configure DNS**:
   - Subdomain (www.vandream.com): CNAME → `cname.vercel-dns.com`
   - Root domain (vandream.com): A record → Vercel IP
3. **Update SITE_URL** environment variable
4. **Redeploy**

## Troubleshooting Guide

### ❌ Build Failed
**Check:**
- [ ] Node version compatible? (18.x+)
- [ ] All dependencies in package.json?
- [ ] TypeScript errors?
- [ ] Check build logs di Vercel

**Fix:**
```bash
# Test locally
npm install
npm run build
```

### ❌ "NUNOMIX_TOKEN is not set"
**Fix:**
1. Add environment variable di Vercel
2. Redeploy project
3. Pastikan token tidak di-encode

### ❌ API Errors (502/500)
**Check:**
- [ ] Environment variables tersimpan?
- [ ] Token masih valid?
- [ ] API endpoint masih accessible?
- [ ] Check Function Logs di Vercel

### ❌ Video Tidak Play
**Check:**
- [ ] Browser console errors?
- [ ] `/api/stream` returning data?
- [ ] CORS issues?
- [ ] Network inspector shows video loading?

## Monitoring

After deployment, monitor via Vercel Dashboard:

- **Deployments**: Success/failure history
- **Analytics**: Page views, unique visitors
- **Speed Insights**: Core Web Vitals, performance metrics
- **Function Logs**: API errors, response times
- **Real-time Logs**: Live request monitoring

## Performance Expectations

Expected metrics on Vercel:
- **First Load**: < 2s
- **Time to Interactive**: < 3s
- **Largest Contentful Paint**: < 2.5s
- **API Response Time**: 200-800ms (depends on upstream)
- **Lighthouse Score**: 90+ (Performance, Accessibility, SEO)

## Optimization Tips

Already implemented:
- ✅ ISR (Incremental Static Regeneration) with revalidation
- ✅ Edge caching for static assets
- ✅ Dynamic imports for heavy components
- ✅ Image optimization with Next.js Image
- ✅ Font optimization (Google Fonts)

## Security Best Practices

Already implemented:
- ✅ Server-only imports for API client
- ✅ Environment variables for secrets
- ✅ Input validation and sanitization
- ✅ Safe error messages (no data leaks)
- ✅ HTTPS enforced (Vercel default)
- ✅ Security headers (Next.js default)

## Final Checklist

Before marking as "Production Ready":
- [ ] All features tested on production
- [ ] No console errors in browser
- [ ] Mobile experience smooth
- [ ] SEO meta tags verified
- [ ] Analytics/monitoring setup
- [ ] Custom domain configured (if applicable)
- [ ] Team members have access to Vercel project
- [ ] Documentation updated
- [ ] Backup/rollback plan understood

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project README**: ./README.md
- **API Documentation**: ./DEPLOYMENT.md

---

## Quick Deploy Command

For subsequent deployments (after first setup):

```bash
git add .
git commit -m "Update: <description>"
git push origin main
# Vercel auto-deploys on push
```

Or use Vercel CLI:
```bash
vercel --prod
```

---

**Status**: ✅ Ready for Deployment  
**Last Check**: 2026-09-13  
**Build Status**: ✅ Passing  
**Security**: ✅ Configured  
**Performance**: ✅ Optimized
