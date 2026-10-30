import os
import numpy as np
from PIL import Image, ImageOps, ImageFilter
from scipy.ndimage import label, binary_fill_holes

print("Starting portrait and signature processing...")

# 1. Process Signature from media_1793114252028.png
sig_source = "/Users/muhamadendang/.gemini/antigravity-ide/brain/6c87f289-d59a-4f97-9bdc-c32d1888df30/.user_uploaded/media_1793114252028.png"
sig_out = "./public/signature.png"

sig_img = Image.open(sig_source).convert("L")
sig_arr = np.array(sig_img).astype(float)
h, w = sig_arr.shape

# The signature has black ink on white background
# Inverted alpha: ink is black (< 100), paper is white (> 240)
# Antialiased linear alpha
alpha = np.clip((245.0 - sig_arr) * (255.0 / 180.0), 0.0, 255.0)

# Create RGBA image with pure white ink (#FFFFFF) and smooth alpha
sig_rgba = np.zeros((h, w, 4), dtype=np.uint8)
sig_rgba[:, :, 0] = 255
sig_rgba[:, :, 1] = 255
sig_rgba[:, :, 2] = 255
sig_rgba[:, :, 3] = alpha.astype(np.uint8)

res_sig = Image.fromarray(sig_rgba, mode="RGBA")
# Crop bounding box of signature to avoid empty margins
bbox = res_sig.getbbox()
if bbox:
    # Add a slight padding
    pad = 20
    b_left = max(0, bbox[0] - pad)
    b_top = max(0, bbox[1] - pad)
    b_right = min(w, bbox[2] + pad)
    b_bottom = min(h, bbox[3] + pad)
    res_sig = res_sig.crop((b_left, b_top, b_right, b_bottom))

res_sig.save(sig_out, "PNG")
print(f"Signature successfully saved to {sig_out}, size={res_sig.size}")

# 2. Process Portrait from media_1793112735773.jpg
portrait_source = "/Users/muhamadendang/.gemini/antigravity-ide/brain/6c87f289-d59a-4f97-9bdc-c32d1888df30/.user_uploaded/media_1793112735773.jpg"
portrait_out = "./public/portrait.jpg"

port_img = Image.open(portrait_source).convert("RGB")
pw, ph = port_img.size
print(f"Portrait source dimensions: {pw}x{ph}")

# Segment the background (the studio background is white)
port_arr = np.array(port_img).astype(float)
r, g, b = port_arr[:, :, 0], port_arr[:, :, 1], port_arr[:, :, 2]
gray = 0.299 * r + 0.587 * g + 0.114 * b

# White background detection (> 240)
is_white = (gray > 240)
labeled, _ = label(is_white)
# Connected to borders
border_labels = set(labeled[0, :]).union(set(labeled[-1, :])).union(set(labeled[:, 0])).union(set(labeled[:, -1]))
border_labels.discard(0)
is_bg = np.isin(labeled, list(border_labels))
# Fill any holes in the person mask
person_mask = ~is_bg
person_mask = binary_fill_holes(person_mask)

# Target aspect ratio: 3:4 (e.g. 768 x 1024)
target_w, target_h = 768, 1024
y_indices, x_indices = np.where(person_mask)
min_y, max_y = y_indices.min(), y_indices.max()
min_x, max_x = x_indices.min(), x_indices.max()

# Center x
center_x = (min_x + max_x) // 2
head_top = min_y
crop_top = max(0, int(head_top - 0.08 * ph))
crop_h = int(pw * (4.0 / 3.0))
if crop_top + crop_h > ph:
    crop_h = ph - crop_top
crop_w = int(crop_h * (3.0 / 4.0))

crop_left = max(0, center_x - crop_w // 2)
if crop_left + crop_w > pw:
    crop_left = pw - crop_w

cropped_img = port_img.crop((crop_left, crop_top, crop_left + crop_w, crop_top + crop_h))
cropped_mask = Image.fromarray(person_mask).crop((crop_left, crop_top, crop_left + crop_w, crop_top + crop_h))

# Resize to 768 x 1024
resized_img = cropped_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
resized_mask = np.array(cropped_mask.resize((target_w, target_h), Image.Resampling.NEAREST)) > 0

# Extract grayscale
g_arr = np.array(resized_img.convert("L")).astype(float)

out_lum = np.zeros_like(g_arr)
norm = np.clip(g_arr / 255.0, 0.0, 1.0)
enhanced = np.power(norm, 1.15) * 255.0

edges = np.array(resized_img.convert("L").filter(ImageFilter.FIND_EDGES)).astype(float)
enhanced[resized_mask] = np.clip(enhanced[resized_mask] + edges[resized_mask] * 0.25, 10.0, 255.0)

out_lum[resized_mask] = enhanced[resized_mask]
out_lum[~resized_mask] = 0.0

final_portrait = Image.fromarray(out_lum.astype(np.uint8)).convert("RGB")
final_portrait.save(portrait_out, "JPEG", quality=95)
print(f"Refined portrait saved to {portrait_out}, size={final_portrait.size}")
