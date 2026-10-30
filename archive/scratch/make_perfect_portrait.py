import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import label, binary_fill_holes, gaussian_filter

src_path = "/Users/muhamadendang/.gemini/antigravity-ide/brain/6c87f289-d59a-4f97-9bdc-c32d1888df30/.user_uploaded/media_1793112735773.jpg"
out_portrait = "public/portrait.jpg"

img = Image.open(src_path).convert("L")
w, h = img.size

# 1. Segment background
arr = np.array(img).astype(float)
is_white = arr > 240
labeled, _ = label(is_white)
borders = set(labeled[0, :]).union(set(labeled[-1, :])).union(set(labeled[:, 0])).union(set(labeled[:, -1]))
borders.discard(0)
is_bg = np.isin(labeled, list(borders))
person_mask = binary_fill_holes(~is_bg)

# 2. Crop centered around head and broad shoulders (3:4 ratio)
target_w, target_h = 768, 1024
y_indices, x_indices = np.where(person_mask)
head_top = y_indices.min()

crop_top = max(0, head_top - 40)
crop_bottom = min(h, crop_top + int(w * (4.0 / 3.0)))
if crop_bottom - crop_top < int(w * (4.0 / 3.0)):
    crop_top = max(0, crop_bottom - int(w * (4.0 / 3.0)))

cropped_arr = arr[crop_top:crop_bottom, :]
cropped_mask = person_mask[crop_top:crop_bottom, :]

crop_img = Image.fromarray(cropped_arr.astype(np.uint8)).resize((target_w, target_h), Image.Resampling.LANCZOS)
mask_img = Image.fromarray(cropped_mask).resize((target_w, target_h), Image.Resampling.NEAREST)

p_arr = np.array(crop_img).astype(float)
p_mask = np.array(mask_img) > 0

cx = target_w * 0.5
y_grid, x_grid = np.mgrid[0:target_h, 0:target_w]
dx = np.abs(x_grid - cx)

# 3. Tone Mapping with rich photographic contrast:
norm = np.clip(p_arr / 255.0, 0.0, 1.0)

# Unsharp mask for crisp eyes, eyebrows, nose, and lips
blurred = gaussian_filter(p_arr, sigma=1.2)
unsharp = p_arr - blurred

# Deep blacks for hair, eyes, eyebrows, nostrils (< 0.40): values 10 to 45
dark_curve = np.power(norm / 0.40, 1.6) * 45.0 + 10.0
# Smooth luminous silver/ivory for skin (0.40 to 0.75): values 75 to 220
mid_curve = 75.0 + np.power((norm - 0.40) / 0.38, 0.8) * 155.0
enhanced = np.where(norm < 0.40, dark_curve, mid_curve)

# Add unsharp mask to facial details (eyes, nose, mouth)
enhanced = np.clip(enhanced + unsharp * 0.45, 10.0, 250.0)

# 4. Clean, Symmetrical White Shirt Collar:
# Center tie line: dx <= 26, y >= 615
is_tie = (y_grid >= 615) & (dx <= 28) & p_mask

# White shirt collar:
# Clean symmetrical V-opening below chin (y >= 540)
# Between dx >= 18 and dx <= 125, y from 540 down to jacket lapel
real_shirt = (p_arr > 180) & (y_grid >= 530) & (dx <= 135) & p_mask & (~is_tie)
# Fill the left collar triangle that had a dark shadow in the source photo
left_collar_fill = (x_grid >= 265) & (x_grid <= 365) & (y_grid >= 540) & (y_grid <= 750) & p_mask & (~is_tie) & (y_grid <= 540 + (cx - x_grid) * 2.2)

clean_white_shirt = (real_shirt | left_collar_fill) & (~is_tie)
enhanced[clean_white_shirt] = 255.0
enhanced[is_tie] = 18.0

out = np.zeros_like(p_arr)
out[p_mask] = enhanced[p_mask]
out[~p_mask] = 0.0

final_img = Image.fromarray(out.astype(np.uint8))

# Dither blend: 85% continuous tone + 15% fine pointillist stippling
dithered = final_img.convert("1", dither=Image.Dither.FLOYDSTEINBERG).convert("L")
result = Image.blend(final_img, dithered, 0.15)
result.save(out_portrait, "JPEG", quality=95)
print("Saved clean symmetrical white collar portrait to public/portrait.jpg")
