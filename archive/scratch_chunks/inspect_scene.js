const fs = require('fs');
const code = fs.readFileSync('./scratch_chunks/mod_1922.js', 'utf8');

console.log("Length of mod_1922:", code.length);

// Let's find component names or functions in mod_1922
// Let's search for Canvas, Scene, WebGLRenderer, requestAnimationFrame, or camera positioning
const lines = [];
const rx = /(function\s+[a-zA-Z0-9_$]+|[a-zA-Z0-9_$]+\s*=\s*(?:function|\([^)]*\)\s*=>)|useEffect|useRef|useState)/g;
let match;
while ((match = rx.exec(code)) !== null) {
  lines.push(match[0]);
}
console.log("Functions/hooks count in mod_1922:", lines.length);

// Search for camera or scene setup
const sceneIdx = code.indexOf('Scene');
console.log("Scene snippet:", code.slice(Math.max(0, sceneIdx - 100), sceneIdx + 400));
