import os
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import label

source_path = "/Users/muhamadendang/.gemini/antigravity-ide/brain/6c87f289-d59a-4f97-9bdc-c32d1888df30/.user_uploaded/media_1793105703275.jpg"
out_avatar = "./public/images/profile.webp"
out_portrait = "./public/portrait.jpg"

img = Image.open(source_path).convert("RGBA")
w, h = img.size
print(f"Original image size: {img.size}")

# 1. Avatar Image (high quality webp)
crop_top = int(h * 0.02)
crop_bottom = int(h * 0.95)
crop_h = crop_bottom - crop_top
crop_w = int(crop_h * 0.85)
crop_left = max(0, (w - crop_w) // 2)
crop_right = min(w, crop_left + crop_w)

avatar_img = img.crop((crop_left, crop_top, crop_right, crop_bottom))
avatar_img.convert("RGB").save(out_avatar, "WEBP", quality=95)
print(f"Saved avatar to {out_avatar}")

# 2. 3D Particle Portrait:
rgb_arr = np.array(img.convert("RGB"))
r = rgb_arr[:, :, 0].astype(float)
g = rgb_arr[:, :, 1].astype(float)
b = rgb_arr[:, :, 2].astype(float)

# White threshold
is_white = (r > 230) & (g > 230) & (b > 230)

# Connect background from image edges only
labeled, num_features = label(is_white)

# Border labels
border_labels = set(labeled[0, :]).union(set(labeled[-1, :])).union(set(labeled[:, 0])).union(set(labeled[:, -1]))
border_labels.discard(0)

# True background mask
is_bg = np.isin(labeled, list(border_labels))
person_mask = ~is_bg

# Grayscale of image
gray = img.convert("L")
gray_arr = np.array(gray).astype(float)
edges = np.array(gray.filter(ImageFilter.FIND_EDGES)).astype(float)

lum = np.zeros_like(gray_arr)

# Face and skin
is_face = person_mask & (gray_arr > 95) & (gray_arr < 225)
lum[is_face] = gray_arr[is_face] * 0.95

# Hair and suit (boost dark tones so particles give full volume to hair and suit)
is_dark = person_mask & (gray_arr <= 95)
lum[is_dark] = 85 + (gray_arr[is_dark] * 0.4)

# White shirt
is_shirt = person_mask & (gray_arr >= 225)
lum[is_shirt] = 210

# Add edge detail for crisp eyes, lips, jaw, and lapel lines
lum[person_mask] = np.clip(lum[person_mask] + edges[person_mask] * 0.35, 30, 255)

# Subtle organic stippling
rng = np.random.default_rng(42)
noise = rng.normal(0, 15, lum.shape)
lum[person_mask] = np.clip(lum[person_mask] + noise[person_mask], 35, 255)

# Zero out background
lum[~person_mask] = 0

processed_img = Image.fromarray(lum.astype(np.uint8))
processed_img = processed_img.resize((768, 1024), Image.Resampling.LANCZOS)
processed_img.convert("RGB").save(out_portrait, "JPEG", quality=95)
print(f"Saved refined 3D particle portrait to {out_portrait}")
