/**
 * Generates 2,400 particle positions for portrait point-cloud and deep-space vortex tunnel
 */

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    let t = Math.imul((s = (s + 1831565813) | 0) ^ (s >>> 15), 1 | s);
    return (((t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t) ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function processSamples(samples, totalCount) {
  const rng = makeRng(1338042);
  const sorted = [...samples].sort((a, b) => b.priority - a.priority);
  const selected = [];

  if (sorted.length >= totalCount) {
    const highCount = Math.floor(0.65 * totalCount);
    for (let i = 0; i < highCount; i++) {
      selected.push(sorted[i]);
    }
    const rest = sorted.slice(highCount);
    const needed = totalCount - highCount;
    for (let i = 0; i < needed; i++) {
      const idx = Math.min(rest.length - 1, Math.floor((i / needed) * rest.length));
      selected.push(rest[idx]);
    }
  } else {
    selected.push(...sorted);
    let i = 0;
    while (selected.length < totalCount && sorted.length > 0) {
      const src = sorted[i % sorted.length];
      selected.push({
        u: src.u + (rng() - 0.5) * 0.008,
        v: src.v + (rng() - 0.5) * 0.008,
        luminance: src.luminance * (0.9 + 0.15 * rng()),
        priority: src.priority
      });
      i++;
    }
  }

  const portraitPositions = new Float32Array(3 * totalCount);
  const tunnelPositions = new Float32Array(3 * totalCount);
  const luminances = new Float32Array(totalCount);
  const atlasIndices = new Float32Array(totalCount);
  const randomSeeds = new Float32Array(totalCount);
  const scales = new Float32Array(totalCount);

  for (let i = 0; i < totalCount; i++) {
    const s = selected[i] || { u: 0.5, v: 0.5, luminance: 0.5 };
    const r = rng();
    const jitterX = (rng() - 0.5) * 0.042;
    const jitterY = (rng() - 0.5) * 0.042;

    const px = (s.u - 0.5) * 5.85 + jitterX;
    const py = (0.5 - s.v) * 7.3 + 0.14 + jitterY;
    
    // Depth curve for facial volume
    const uRel = (s.u - 0.5) / 0.19;
    const vRel = (s.v - 0.32) / 0.19;
    const distSq = uRel * uRel + vRel * vRel;
    const shoulderRel = (s.u - 0.5) / 0.46;
    const faceZ = distSq < 1 ? 0.42 * Math.sqrt(1 - distSq) : 0;
    const shoulderZ = s.v > 0.52 && Math.abs(shoulderRel) < 1 ? 0.22 * Math.sqrt(1 - shoulderRel * shoulderRel) : 0;
    const pz = faceZ + shoulderZ + (s.luminance - 0.35) * 0.28 + (rng() - 0.5) * 0.05;

    portraitPositions[3 * i] = px;
    portraitPositions[3 * i + 1] = py;
    portraitPositions[3 * i + 2] = pz;

    // Tunnel spiral placement with clean central corridor for cards
    const tz = 4.5 - (i / totalCount) * 228 + (rng() - 0.5) * 3.5;
    const angle = 2.399963229728653 * i + (rng() - 0.5) * 0.45;
    const radius = rng() < 0.82 ? 4.5 + 8.5 * Math.pow(rng(), 0.8) : 13.0 + 6.5 * rng();
    const tx = Math.cos(angle) * radius * 1.4;
    const ty = Math.sin(angle) * radius * 1.1;

    tunnelPositions[3 * i] = tx;
    tunnelPositions[3 * i + 1] = ty;
    tunnelPositions[3 * i + 2] = tz;

    // Natural photographic luminance range [0.20, 1.0]:
    // Eyes and shadows are soft, rich charcoal (never empty black holes), while highlights are luminous silver/white
    const lumClamped = Math.min(1.0, Math.max(0.20, 1.12 * Math.pow(s.luminance, 0.82)));
    luminances[i] = lumClamped;
    atlasIndices[i] = i % 64;
    randomSeeds[i] = r;
    scales[i] = 0.82 + 0.35 * lumClamped;
  }

  return {
    count: totalCount,
    portraitPositions,
    tunnelPositions,
    luminances,
    atlasIndices,
    randomSeeds,
    scales
  };
}

export function generateFallbackParticles(totalCount = 2400) {
  const samples = [];
  const rng = makeRng(9001);

  for (let r = 0; r < 102; r++) {
    for (let c = 0; c < 76; c++) {
      const u = (c + 0.5) / 76;
      const v = (r + 0.5) / 102;

      const headU = (u - 0.5) / 0.195;
      const headV = (v - 0.31) / 0.185;
      const headSq = headU * headU + headV * headV;

      const hairU = (u - 0.5) / 0.225;
      const hairV = (v - 0.25) / 0.15;
      const hairSq = hairU * hairU + hairV * hairV;

      const neck = Math.abs(u - 0.5) < 0.088 && v >= 0.45 && v <= 0.59;
      const shoulders = v >= 0.57 + 0.16 * Math.pow(Math.abs(u - 0.5) / 0.48, 1.35) && v <= 0.99 && Math.abs(u - 0.5) < 0.48;

      if (headSq <= 1 || hairSq <= 1 || neck || shoulders) {
        let lum = 0.45;
        if (hairSq <= 1 && v < 0.24) {
          lum = hairSq > 0.72 ? 0.78 : 0.22;
        } else if (headSq <= 1) {
          lum = 0.58 - 0.25 * headSq;
          const leftEye = Math.hypot((u - 0.43) / 0.04, (v - 0.305) / 0.022);
          const rightEye = Math.hypot((u - 0.57) / 0.04, (v - 0.305) / 0.022);
          if (leftEye < 1 || rightEye < 1) lum = 0.24;
          if (leftEye < 0.28 || rightEye < 0.28) lum = 0.92;
          if (Math.abs(u - 0.5) < 0.018 && v > 0.3 && v < 0.38) lum = 0.86;
        } else if (neck) {
          lum = 0.34;
        } else if (shoulders) {
          const badgeL = Math.hypot((u - 0.39) / 0.05, (v - 0.59) / 0.06);
          const badgeR = Math.hypot((u - 0.61) / 0.05, (v - 0.59) / 0.06);
          lum = badgeL < 1 || badgeR < 1 ? 0.88 : 0.42 + 0.22 * rng();
        }

        const isFaceZone = u > 0.28 && u < 0.72 && v > 0.13 && v < 0.54;
        samples.push({
          u,
          v,
          luminance: lum,
          priority: lum + (isFaceZone ? 0.65 : 0)
        });
      }
    }
  }

  return processSamples(samples, totalCount);
}

export async function loadPortraitParticles(imageSrc = '/portrait.jpg', totalCount = 2400) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 400;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          return resolve(generateFallbackParticles(totalCount));
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 300, 400);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, 300, 400);

        const imgData = ctx.getImageData(0, 0, 300, 400).data;
        const samples = [];

        for (let r = 0; r < 100; r++) {
          for (let c = 0; c < 75; c++) {
            let totalLum = 0;
            let maxLum = 0;
            const xStart = Math.floor(c * 4);
            const xEnd = Math.floor((c + 1) * 4);
            const yStart = Math.floor(r * 4);
            const yEnd = Math.floor((r + 1) * 4);
            let count = 0;

            let minLum = 1.0;

            for (let y = yStart; y < yEnd; y++) {
              for (let x = xStart; x < xEnd; x++) {
                const idx = (300 * y + x) * 4;
                const lum = 0.299 * (imgData[idx] / 255) + 0.587 * (imgData[idx + 1] / 255) + 0.114 * (imgData[idx + 2] / 255);
                totalLum += lum;
                if (lum > maxLum) maxLum = lum;
                if (lum < minLum) minLum = lum;
                count++;
              }
            }

            const avgLum = count > 0 ? totalLum / count : 0;
            const blended = 0.55 * avgLum + 0.45 * maxLum;
            const lumDiff = maxLum - minLum;

            if (blended > 0.035 || maxLum > 0.12) {
              const u = (c + 0.5) / 75;
              const v = (r + 0.5) / 100;

              // Do not spawn particles below the divider line (v > 0.81)
              if (v > 0.81) continue;

              // Face bounds
              const isFace = u >= 0.28 && u <= 0.72 && v >= 0.10 && v <= 0.54;
              // Distinct high-contrast edges (eyes, nostrils, lips, hair boundary, collar, tie)
              const isFeatureEdge = (maxLum > 0.25 && avgLum < 0.28) || lumDiff > 0.14;

              // Balanced priority so shoulders & suit get full body representation while face is sharp
              const priority = blended * 1.2 + (isFace ? 0.35 : 0) + (isFeatureEdge ? 0.45 : 0);

              // Smooth photographic tonal luminance:
              // Eyes, nose, smile have natural depth; cheeks, forehead and shirt have bright silver highlights
              let cellLum = Math.min(1.0, 1.2 * Math.pow(blended, 0.82));

              samples.push({
                u,
                v,
                luminance: cellLum,
                priority
              });
            }
          }
        }

        if (samples.length < 200) {
          return resolve(generateFallbackParticles(totalCount));
        }

        resolve(processSamples(samples, totalCount));
      } catch {
        resolve(generateFallbackParticles(totalCount));
      }
    };

    img.onerror = () => {
      resolve(generateFallbackParticles(totalCount));
    };

    img.src = imageSrc;
  });
}
