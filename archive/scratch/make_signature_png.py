from PIL import Image, ImageOps
import numpy as np

img_path = "/Users/muhamadendang/.gemini/antigravity-ide/brain/6c87f289-d59a-4f97-9bdc-c32d1888df30/.user_uploaded/media_1793114252028.png"
out_path = "./public/signature.png"

img = Image.open(img_path).convert("L")
arr = np.array(img).astype(float)

# Signature is black (< 120), background is white (> 240)
# Compute inverted alpha: 255 where black, 0 where white
alpha = 255.0 - arr
# Boost contrast for clean crisp ink lines without background artifacts
alpha = np.clip((alpha - 15.0) * (255.0 / 180.0), 0.0, 255.0)

h, w = arr.shape
rgba = np.zeros((h, w, 4), dtype=np.uint8)
rgba[:, :, 0] = 255  # Pure white core
rgba[:, :, 1] = 255
rgba[:, :, 2] = 255
rgba[:, :, 3] = alpha.astype(np.uint8)

res_img = Image.fromarray(rgba, mode="RGBA")
res_img.save(out_path, "PNG")
print(f"Saved transparent signature to {out_path} (size: {res_img.size})")
