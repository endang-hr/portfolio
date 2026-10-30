const fs = require('fs');
const files = fs.readdirSync('./scratch_chunks').filter(f => f.endsWith('.js') && !f.startsWith('find') && !f.startsWith('inspect') && !f.startsWith('extract'));

files.forEach(f => {
  const code = fs.readFileSync('./scratch_chunks/' + f, 'utf8');
  if (code.includes('Scene') && code.includes('PerspectiveCamera')) {
    console.log(f, "has Scene & PerspectiveCamera");
    // let's see if it's the 3d scene logic
    const hasCurve = code.includes('CatmullRomCurve3') || code.includes('curve') || code.includes('Spline') || code.includes('TubeGeometry');
    console.log(f, "hasCurve:", hasCurve);
  }
});
