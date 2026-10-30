const fs = require('fs');
const files = fs.readdirSync('./scratch_chunks').filter(f => f.endsWith('.js') && f !== 'inspect.js');

files.forEach(f => {
  const content = fs.readFileSync('./scratch_chunks/' + f, 'utf8');
  console.log(`--- ${f} (${content.length} bytes) ---`);
  const matches = content.match(/Three|three\.module|WebGLRenderer|PerspectiveCamera|canvas|requestAnimationFrame|lenis|framer-motion|lucide/g);
  if (matches) {
    const counts = {};
    matches.forEach(m => counts[m] = (counts[m] || 0) + 1);
    console.log(counts);
  }
});
