import * as THREE from 'three';

let cachedAtlas = null;
const cardTextureCache = new Map();

const COLOR_PAIRS = [
  ["#00F0FF", "#06121A", "#3B82F6"],
  ["#10B981", "#061510", "#6EE7B7"],
  ["#F59E0B", "#160E05", "#FDE68A"],
  ["#3B82F6", "#07111E", "#93C5FD"],
  ["#EF4444", "#180708", "#FCA5A5"],
  ["#8B5CF6", "#0E071B", "#C4B5FD"],
  ["#2DD4BF", "#051414", "#99F6E4"],
  ["#C084FC", "#11081C", "#E9D5FF"],
  ["#EC4899", "#160711", "#F472B6"],
  ["#F97316", "#140905", "#FDBA74"],
  ["#38BDF8", "#07111E", "#BAE6FD"],
  ["#F43F5E", "#18070B", "#FDA4AF"],
  ["#E5C07B", "#141008", "#FFF3D1"],
  ["#D97706", "#130C05", "#FDE68A"],
  ["#6366F1", "#0A0A16", "#A5B4FC"],
  ["#A855F7", "#10061A", "#D8B4FE"]
];

/**
 * Creates 2048x2048 texture atlas for the 2400 micro-particles
 */
export function getParticleAtlasTexture() {
  if (cachedAtlas) return cachedAtlas;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#09090B';
  ctx.fillRect(0, 0, 2048, 2048);

  for (let i = 0; i < 64; i++) {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const x = col * 256;
    const y = row * 256;
    const [accent, bg, highlight] = COLOR_PAIRS[i % COLOR_PAIRS.length];

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, 256, 256);
    ctx.clip();

    // Background gradient
    const grad = ctx.createLinearGradient(x, y, x + 256, y + 256);
    grad.addColorStop(0, bg);
    grad.addColorStop(1, '#121217');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, 256, 256);

    const styleIdx = i % 6;
    if (styleIdx === 0) {
      const radial = ctx.createRadialGradient(x + 128, y + 122.88, 10.24, x + 128, y + 122.88, 92.16);
      radial.addColorStop(0, highlight);
      radial.addColorStop(0.45, accent);
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(x + 128, y + 122.88, 92.16, 0, 2 * Math.PI);
      ctx.fill();
    } else if (styleIdx === 1) {
      ctx.fillStyle = accent;
      ctx.fillRect(x + 20, y + 20, 216, 107.52);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(String(i % 17 + 1).padStart(2, '0'), x + 24, y + 199.68);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillRect(x + 96, y + 168.96, 138, 8);
      ctx.fillRect(x + 96, y + 192, 108, 8);
    } else if (styleIdx === 2) {
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 18, y + 22, 220, 212);
      ctx.fillStyle = accent;
      ctx.fillRect(x + 30, y + 38, 64, 12);
      for (let n = 0; n < 6; n++) {
        const barH = 32 + ((17 * i + 29 * n) % 85);
        ctx.fillStyle = n === 4 ? accent : 'rgba(255,255,255,0.22)';
        ctx.fillRect(x + 34 + 32 * n, y + 256 - 38 - barH, 20, barH);
      }
    } else if (styleIdx === 3) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(x + 128, y + 128, 64, 0, 1.65 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(x + 166.4, y + 89.6, 16, 0, 2 * Math.PI);
      ctx.fill();
    } else if (styleIdx === 4) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 14;
      for (let e = -2; e < 5; e++) {
        ctx.beginPath();
        ctx.moveTo(x + 56 * e, y + 256);
        ctx.lineTo(x + 56 * e + 140, y);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(10,10,12,0.78)';
      ctx.fillRect(x + 24, y + 148.48, 208, 72);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 36, y + 174.08, 110, 12);
    } else {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(x + 22, y + 22, 212, 212);
      ctx.fillStyle = '#09090B';
      ctx.fillRect(x + 34, y + 34, 188, 133.12);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(x + 128, y + 107.52, 34, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 3, y + 3, 250, 250);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  cachedAtlas = texture;
  return texture;
}

/**
 * Renders high-resolution 3D project card texture with screenshot image, gradients, title, badges
 */
export function getProjectCardTexture(project) {
  const cacheKey = `${project.id}_${project.mediaUrl || ''}`;
  if (cardTextureCache.has(cacheKey)) {
    return cardTextureCache.get(cacheKey);
  }

  const SCALE = 2;
  const canvas = document.createElement('canvas');
  canvas.width = 1024 * SCALE;
  canvas.height = 660 * SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const redraw = (img = null) => {
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = project.bgDark || '#070709';
    ctx.fillRect(0, 0, w, h);

    if (img && img.complete && img.naturalWidth > 0) {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = w / h;
      let drawW = w;
      let drawH = h;
      let dx = 0;
      let dy = 0;

      if (imgAspect > canvasAspect) {
        drawH = h;
        drawW = h * imgAspect;
        dx = (w - drawW) / 2;
      } else {
        drawW = w;
        drawH = w / imgAspect;
        dy = (h - drawH) / 2;
      }
      ctx.drawImage(img, dx, dy, drawW, drawH);

      if (project.hasBakedTypography) {
        texture.needsUpdate = true;
        return;
      }

      // Top soft gradient scrim for label readability
      const topGrad = ctx.createLinearGradient(0, 0, 0, 0.14 * h);
      topGrad.addColorStop(0, 'rgba(5, 5, 8, 0.50)');
      topGrad.addColorStop(1, 'rgba(5, 5, 8, 0.0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, 0.14 * h);

      // Bottom soft gradient scrim for title readability
      const bottomGrad = ctx.createLinearGradient(0, 0.72 * h, 0, h);
      bottomGrad.addColorStop(0, 'rgba(5, 5, 8, 0.0)');
      bottomGrad.addColorStop(0.5, 'rgba(5, 5, 8, 0.35)');
      bottomGrad.addColorStop(1, 'rgba(5, 5, 8, 0.70)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 0.72 * h, w, 0.28 * h);

      // Subtle glow spotlight at bottom left
      const glow = ctx.createRadialGradient(0.15 * w, 0.88 * h, 10 * SCALE, 0.15 * w, 0.88 * h, 0.45 * w);
      glow.addColorStop(0, `${project.accentColor}25`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0.72 * h, w, 0.28 * h);
    } else {
      // Tech grid placeholder while image loads
      const grad = ctx.createRadialGradient(0.68 * w, 0.42 * h, 0.04 * w, 0.62 * w, 0.48 * h, 0.68 * w);
      grad.addColorStop(0, `${project.accentColor}77`);
      grad.addColorStop(0.5, `${project.secondaryColor}2F`);
      grad.addColorStop(1, 'rgba(5,5,5,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1 * SCALE;
      for (let x = 64 * SCALE; x < w; x += 64 * SCALE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 64 * SCALE; y < h; y += 64 * SCALE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    // Top metadata label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = `600 ${20 * SCALE}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.fillText(`${project.formattedIndex}  /  ${project.year}  /  ${project.client}`, 56 * SCALE, 68 * SCALE);

    // Featured Work pill badge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5 * SCALE;
    ctx.beginPath();
    ctx.roundRect(w - 220 * SCALE, 42 * SCALE, 164 * SCALE, 38 * SCALE, 19 * SCALE);
    ctx.stroke();

    ctx.fillStyle = project.accentColor;
    ctx.beginPath();
    ctx.arc(w - 196 * SCALE, 61 * SCALE, 5 * SCALE, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `600 ${13 * SCALE}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.fillText('FEATURED WORK', w - 180 * SCALE, 66 * SCALE);

    // Title at bottom
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `italic 700 ${48 * SCALE}px "Instrument Serif", Georgia, serif`;
    ctx.fillText(project.title, 56 * SCALE, h - 86 * SCALE);

    // Category
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.font = `500 ${18 * SCALE}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.fillText(project.category, 56 * SCALE, h - 48 * SCALE);

    // Arrow indicator circle bottom right
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(w - 70 * SCALE, h - 65 * SCALE, 26 * SCALE, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5 * SCALE;
    ctx.beginPath();
    ctx.moveTo(w - 78 * SCALE, h - 65 * SCALE);
    ctx.lineTo(w - 62 * SCALE, h - 65 * SCALE);
    ctx.moveTo(w - 68 * SCALE, h - 71 * SCALE);
    ctx.lineTo(w - 62 * SCALE, h - 65 * SCALE);
    ctx.lineTo(w - 68 * SCALE, h - 59 * SCALE);
    ctx.stroke();

    texture.needsUpdate = true;
  };

  redraw();

  if (project.mediaUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => redraw(img);
    img.src = project.mediaUrl;
  }

  cardTextureCache.set(cacheKey, texture);
  return texture;
}
