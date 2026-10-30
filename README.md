# 🌌 Interactive 3D Spatial Portfolio - Muhamad Endang

Website portofolio interaktif 3D spatial flythrough modern yang dibangun dengan arsitektur WebGL/Three.js performa tinggi, custom GLSL shaders, dan tipografi elegan terinspirasi dari [dizzoporto.vercel.app](https://dizzoporto.vercel.app/).

---

## ✨ Fitur Utama

1. **3D Particle Point-Cloud & Deep-Space Vortex**:
   - 2.400 partikel (*instanced meshes*) dengan custom vertex & fragment shader yang membentuk siluet portrait 3D di awal (*hero section*).
   - Saat digulir (*scroll*), 2.400 partikel bertransformasi (*morphing*) menjadi lorong galaksi 3D (*infinite cylinder vortex*) sepanjang 228 unit sumbu Z.
2. **Illuminated Calligraphy Signature**:
   - Kurva spline 3D (*CatmullRom Curve & TubeGeometry*) dengan efek *glow* custom shader neon cyan-putih (`#38BDF8` & `#FFFFFF`).
3. **17 Kartu Proyek 3D Interaktif**:
   - 17 proyek terdistribusi sepanjang jalur penerbangan kamera di ruang 3D.
   - Dilengkapi *dynamic canvas texture*, border neon bercahaya (*luminous rim*), pantulan kaca diagonal (*glass sheen*), dan rotasi *tilt* interaktif mengikuti kursor mouse.
4. **Smooth Inertial Scrolling**:
   - Didukung oleh **Lenis** untuk pergerakan gulir kamera yang halus dan sinematik.
5. **Modals & Drawers Interaktif**:
   - **About & Awards Modal**: 4 tab lengkap (*Biography*, *Experience & Education*, *Awards* dengan link sertifikat, dan *Tech Stack*).
   - **Project Detail View**: Menampilkan metrik, tantangan arsitektur, daftar deliverables, teknologi, dan tombol *Live Demo*.
   - **Contact Modal**: Tindakan cepat salin email dan tautan LinkedIn, GitHub, serta Instagram.

---

## 🛠️ Menjalankan Proyek Secara Lokal

```bash
# Masuk ke direktori
cd portofolio.endang

# Instal dependensi (jika belum)
npm install

# Jalankan development server
npm run dev
```

Buka browser Anda di: `http://localhost:3000`

---

## 🚀 Build untuk Produksi & Deployment

```bash
# Build bundle produksi
npm run build
```

Hasil build akan tersimpan di folder `dist/`. Anda dapat langsung men-deploy folder ini ke platform seperti:
- **Vercel** (`vercel deploy`)
- **Netlify** (`netlify deploy`)
- **GitHub Pages**
- **Cloudflare Pages**

---

## 📝 Mengubah Data & Foto Profil

- Seluruh data teks, riwayat karir, sertifikat, dan 17 proyek dapat diubah di:  
  [src/data/portfolioData.js](file:///Users/muhamadendang/Documents/portofolio.endang/src/data/portfolioData.js)
- Foto portrait 3D dapat diganti di:  
  `public/portrait.jpg`
- Foto profil avatar dapat diganti di:  
  `public/images/profile.webp`
