from PIL import Image
import numpy as np

# We want to extract ordered spline coordinates for Muhamad Endang's signature.
# Signature structure:
# Stroke 1: Diagonal up into big left loop -> loop down -> middle waves -> right tall spike -> down descender
# Stroke 2: Horizontal underline across bottom

# Let's map coordinates to Three.js world space:
# Centered around (0, 0), with width ~5.8 units and height ~4.0 units
# X ranges from -2.9 to +2.9
# Y ranges from -1.8 to +2.1
# Z ranges from -0.3 to +0.3 (giving real 3D depth volume to the cursive strokes)

# Let's define key anchor points following the exact geometry of the uploaded signature:

# 1. Main stroke (Bottom left diagonal -> big loop -> middle 'w/u' waves -> right tall peak -> descender)
main_stroke_pts = [
    # Bottom left starting tail
    (-2.1, -1.55, 0.25),
    (-1.95, -1.35, 0.25),
    (-1.75, -1.1, 0.25),
    (-1.55, -0.85, 0.1),
    (-1.38, -0.62, 0.0),
    # Intersection with underline and ascending left side of big loop
    (-1.25, -0.35, -0.15),
    (-1.18, 0.15, -0.3),
    (-1.15, 0.7, -0.45),
    (-1.1, 1.25, -0.55),
    (-1.0, 1.75, -0.65),
    (-0.85, 2.05, -0.6),
    (-0.68, 2.15, -0.5), # Top peak of left loop
    (-0.52, 2.02, -0.35),
    (-0.45, 1.65, -0.2), # Descending right side of left loop
    (-0.42, 1.15, -0.05),
    (-0.45, 0.65, 0.1),
    (-0.55, 0.15, 0.25),
    (-0.7, -0.25, 0.35),
    (-0.82, -0.6, 0.4), # Bottom intersection of left loop
    # Transitioning into middle wave 1
    (-0.72, -0.65, 0.35),
    (-0.55, -0.58, 0.25),
    (-0.42, -0.15, 0.15),
    (-0.35, 0.05, 0.05), # Peak of wave 1
    (-0.28, -0.15, -0.05),
    (-0.2, -0.58, -0.15),
    (-0.12, -0.66, -0.2), # Trough of wave 1
    # Middle wave 2
    (-0.02, -0.58, -0.15),
    (0.08, -0.15, -0.05),
    (0.15, 0.05, 0.05), # Peak of wave 2
    (0.22, -0.15, 0.15),
    (0.3, -0.58, 0.25),
    (0.38, -0.66, 0.3), # Trough of wave 2
    # Ascending into tall right peak
    (0.48, -0.5, 0.25),
    (0.58, 0.1, 0.1),
    (0.68, 0.8, -0.1),
    (0.75, 1.45, -0.3),
    (0.8, 1.95, -0.5),
    (0.82, 2.2, -0.55), # Sharp top peak of right loop
    (0.85, 2.1, -0.5),
    (0.88, 1.6, -0.35),
    (0.92, 1.0, -0.2),
    (0.95, 0.35, -0.05),
    (0.96, -0.3, 0.1),
    (0.92, -0.65, 0.25), # Bottom right turn
    (0.78, -0.68, 0.35),
    # Descender going down straight past underline
    (0.72, -0.4, 0.3),
    (0.7, 0.0, 0.15),
    (0.7, -0.45, 0.0),
    (0.7, -0.95, -0.15),
    (0.7, -1.45, -0.3),
    (0.7, -1.85, -0.4) # Bottom of descender
]

# 2. Horizontal Underline stroke (flowing smoothly from left across to right)
underline_pts = [
    (-2.8, -0.76, 0.1),
    (-2.4, -0.74, 0.1),
    (-1.9, -0.71, 0.05),
    (-1.4, -0.68, 0.0),
    (-0.9, -0.66, -0.05),
    (-0.4, -0.65, -0.1),
    (0.1, -0.65, -0.1),
    (0.6, -0.67, -0.05),
    (1.1, -0.7, 0.0),
    (1.6, -0.73, 0.05),
    (2.1, -0.76, 0.1),
    (2.6, -0.8, 0.12),
    (2.9, -0.83, 0.15)
]

print(f"Main stroke points: {len(main_stroke_pts)}")
print(f"Underline points: {len(underline_pts)}")
