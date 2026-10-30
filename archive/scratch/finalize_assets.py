import shutil
from PIL import Image

# Copy test dithered portrait to public/portrait.jpg
shutil.copyfile("scratch/test_dithered_portrait.jpg", "public/portrait.jpg")
print("Updated public/portrait.jpg with high-contrast dithered pointillist portrait")

# Verify public/portrait.jpg
img = Image.open("public/portrait.jpg")
print("portrait.jpg size:", img.size)

# Verify public/signature.png
sig = Image.open("public/signature.png")
print("signature.png size:", sig.size)
