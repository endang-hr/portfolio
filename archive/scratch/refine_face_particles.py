import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from scipy.ndimage import label, gaussian_filter

source_path = "/Users/muhamadendang/.gemini/antigravity-ide/brain/6c87f289-d59a-4f97-9bdc-c32d1888df30/.user_uploaded/media_1793105703275.jpg"
out_portrait = "./public/portrait.jpg"

img = Image.open(source_path).convert("RGB")
w, h = img.size

# Target: 768 x 1024
target_w, target_h = 768, 1024
aspect_ratio = target_w / target_h

# Center crop slightly from top to upper chest
crop_box = (0, 0, w, int(h * 0.94))
cropped = img.crop(crop_box)
w_c, h_c = cropped.size

current_aspect = w_c / h_c
if current_aspect > aspect_ratio:
    new_w = int(h_c * aspect_ratio)
    left = (w_c - new_w) // 2
    cropped = cropped.crop((left, 0, left + new_w, h_c))
else:
    new_h = int(w_c / aspect_ratio)
    cropped = cropped.crop((0, 0, w_c, new_h))

resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
rgb_arr = np.array(resized).astype(float)
r, g, b = rgb_arr[:, :, 0], rgb_arr[:, :, 1], rgb_arr[:, :, 2]

# Segment White Background
is_white = (r > 230) & (g > 230) & (b > 230)
labeled, _ = label(is_white)
border_labels = set(labeled[0, :]).union(set(labeled[-1, :])).union(set(labeled[:, 0])).union(set(labeled[:, -1]))
border_labels.discard(0)
is_bg = np.isin(labeled, list(border_labels))
person_mask = ~is_bg

# Grayscale & Edges
gray = resized.convert("L")
gray_arr = np.array(gray).astype(float)
edges = np.array(gray.filter(ImageFilter.FIND_EDGES)).astype(float)

# Skin detection based on RGB color ratios (skin has R > G > B)
is_skin = person_mask & (r > g) & (g > b) & (r > 90) & (gray_arr > 60) & (gray_arr < 235)

# Hair detection (darker pixels in upper 45% of image)
y_coords, _ = np.mgrid[0:target_h, 0:target_w]
is_hair = person_mask & (y_coords < int(target_h * 0.44)) & (gray_arr <= 85)

# White shirt & collar
is_shirt = person_mask & (gray_arr >= 210)

# Black suit & tie (dark pixels in lower half)
is_suit_tie = person_mask & (y_coords >= int(target_h * 0.44)) & (gray_arr < 210) & (~is_skin)

# Base luminance map
lum = np.zeros_like(gray_arr)

# 1. Skin / Face & Neck:
# High-contrast mapping so facial features (eyes, nose, smile, cheeks) are clearly distinct
skin_normalized = (gray_arr - 60) / (235 - 60 + 1e-5)
# S-curve for punchy contrast
skin_curved = 1.0 / (1.0 + np.exp(-7.0 * (skin_normalized - 0.5)))
lum[is_skin] = 40 + skin_curved[is_skin] * 190

# 2. Hair:
# Keep hair textured with strands and volume highlights
lum[is_hair] = 75 + edges[is_hair] * 0.65

# 3. White shirt / collar:
lum[is_shirt] = 230

# 4. Suit & tie:
# Subdued luminance with clear lapel and shoulder contour so particles frame the body without overpowering the face
lum[is_suit_tie] = 55 + edges[is_suit_tie] * 0.6

# 5. Add edge detail to skin for defined eyes, eyebrows, nose tip, and smiling mouth
lum[is_skin] = np.clip(lum[is_skin] + edges[is_skin] * 0.45, 25, 255)

# 6. Film grain / halftone stippling
rng = np.random.default_rng(42)
noise = rng.normal(0, 10, lum.shape)
lum[person_mask] = np.clip(lum[person_mask] + noise[person_mask], 20, 255)

# Pure black background
lum[~person_mask] = 0

out_img = Image.fromarray(lum.astype(np.uint8))
out_img.save(out_portrait, "JPEG", quality=95)
print(f"Flawless 3D particle portrait saved: {out_portrait}")
