const fs = require('fs');
const code = fs.readFileSync('./scratch_chunks/app_page-c85d23575c11a6ea.js', 'utf8');

// The file has webpack chunks: (self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{ <modules> }]);
// Let's find all module IDs and their content or extract readable blocks
const moduleMatches = [...code.matchAll(/(\d+):function\(([^)]+)\)\{/g)];
console.log("Module matches found:", moduleMatches.map(m => m[1]));

// Let's write out formatted code or inspect the default component
fs.writeFileSync("./scratch_chunks/page_code_formatted.js", code);
