const fs = require('fs');
let code = fs.readFileSync('./scratch_chunks/249.dd96d9f236e867d5.js', 'utf8');

// Simple formatting of semicolons and braces to make it readable
let formatted = code
  .replace(/;/g, ';\n')
  .replace(/\{/g, '{\n')
  .replace(/\}/g, '\n}\n');

fs.writeFileSync('./scratch_chunks/scene_readable.js', formatted);
console.log("Formatted chunk 249 saved to scene_readable.js");
