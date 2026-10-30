const fs = require('fs');
const pageCode = fs.readFileSync('./scratch_chunks/app_page-c85d23575c11a6ea.js', 'utf8');

// Look for data array or project objects:
// e.g., titles, descriptions, categories, images, etc.
// Let's search for JSON-like objects or arrays
const regex = /\{id:[^}]+title:[^}]+\}/g;
let m;
console.log("Searching for project objects...");
let idx = 0;
// Search for text snippets like "PT Indah Kiat", "Geasy", "W2W App", etc.
const texts = pageCode.match(/"[^"\\]*(?:\\.[^"\\]*)*"/g) || [];
console.log("Total quoted strings:", texts.length);

const projectRelated = texts.filter(t => t.length > 5 && (
  t.includes("Serang") || t.includes("W2W") || t.includes("Geasy") || 
  t.includes("Medal") || t.includes("Figma") || t.includes("Apprentice") ||
  t.includes("NutriAI") || t.includes("Award") || t.includes("http") || t.includes(".png") || t.includes(".jpg")
));
console.log("Sample strings:", projectRelated.slice(0, 30));

fs.writeFileSync("./scratch_chunks/extracted_strings.json", JSON.stringify([...new Set(texts.map(s => JSON.parse(s)))], null, 2));
