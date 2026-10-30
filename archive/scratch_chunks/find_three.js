const fs = require('fs');
const pageCode = fs.readFileSync('./scratch_chunks/app_page-c85d23575c11a6ea.js', 'utf8');

// Find occurrences of WebGLRenderer, Scene, PerspectiveCamera, Mesh, Curve, CatmullRomCurve3, or whatever Three.js objects it uses
const chunk3 = fs.readFileSync('./scratch_chunks/610-62390c3ec4fb12f8.js', 'utf8');

console.log("Searching in app_page for Three.js calls...");
const threeCalls = pageCode.match(/[A-Za-z0-9_$]+\.(Scene|PerspectiveCamera|WebGLRenderer|PlaneGeometry|MeshBasicMaterial|Mesh|Group|Vector3|CatmullRomCurve3|Raycaster|TextureLoader)/g);
console.log("Three calls in page:", threeCalls);

const threeCalls610 = chunk3.match(/[A-Za-z0-9_$]+\.(Scene|PerspectiveCamera|WebGLRenderer|PlaneGeometry|MeshBasicMaterial|Mesh|Group|Vector3|CatmullRomCurve3|Raycaster|TextureLoader)/g);
console.log("Three calls in 610:", threeCalls610);
