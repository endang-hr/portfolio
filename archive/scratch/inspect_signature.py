from PIL import Image
import numpy as np

img_path = "/Users/muhamadendang/.gemini/antigravity-ide/brain/6c87f289-d59a-4f97-9bdc-c32d1888df30/.user_uploaded/media_1793107317011.png"
img = Image.open(img_path).convert("L")
arr = np.array(img)
print(f"Image shape: {arr.shape}")

# Signature is black on white background: black pixels < 100
is_stroke = arr < 128
print(f"Stroke pixel count: {np.sum(is_stroke)}")

# Bounding box of stroke
y_indices, x_indices = np.where(is_stroke)
print(f"X range: {x_indices.min()} to {x_indices.max()} (width {x_indices.max() - x_indices.min()})")
print(f"Y range: {y_indices.min()} to {y_indices.max()} (height {y_indices.max() - y_indices.min()})")
