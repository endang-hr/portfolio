const fs = require('fs');
const code = fs.readFileSync('./scratch_chunks/249.dd96d9f236e867d5.js', 'utf8');

console.log("Length of chunk 249:", code.length);
// Let's search for keywords like CatmullRomCurve3, particles, meshes, camera, render
const keywords = ["Catmull", "camera", "scroll", "position", "curve", "particles", "points", "geometry", "texture", "raycaster"];
for (const k of keywords) {
  console.log(`${k}: ${(code.match(new RegExp(k, 'gi')) || []).length}`);
}

// Let's find exported Scene component
const match = code.match(/function\s+([A-Za-z0-9_$]+)\s*\([^)]*\)\s*\{[^}]*canvas/);
console.log("Canvas function match:", match ? match[1] : "not found");

fs.writeFileSync('./scratch_chunks/scene_unminified_head.js', code.slice(0, 3000));
