const fs = require('fs');
let code = fs.readFileSync('./scratch_chunks/mod_2299.js', 'utf8');

// Let's replace module wrapper to export in Node
code = code.replace(/2299:function\(e,t,i\)\{"use strict";i\.d\(t,\{[^}]+\}\);var [^;]+;/, '');
fs.writeFileSync('./scratch_chunks/mod_2299_raw.js', code);
console.log("Raw written. Length:", code.length);
