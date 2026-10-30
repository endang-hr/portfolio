const fs = require('fs');
const pageCode = fs.readFileSync('./scratch_chunks/app_page-c85d23575c11a6ea.js', 'utf8');

// Find where projects are declared. Let's find patterns like:
// [{id: or title: or thumbnail: or category:
const match = pageCode.match(/(\[\{[^;]+id:[^;]+\])/);
if (match) {
  console.log("Found matched array:", match[1].slice(0, 500));
}

// Let's search for "17 Projects" or explore all occurrences of project titles
const idx = pageCode.indexOf("Explore 17 Projects");
console.log("Index of Explore 17 Projects:", idx);

// Let's find all project titles/objects in the code
const titles = pageCode.match(/title:"([^"]+)"/g);
console.log("Titles found:", titles);

// Let's find images
const images = pageCode.match(/([a-zA-Z0-9_\-\/]+\.(?:png|jpg|webp|jpeg|svg))/g);
console.log("Images found:", [...new Set(images)]);
