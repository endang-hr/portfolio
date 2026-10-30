const fs = require('fs');
const code = fs.readFileSync('./scratch_chunks/app_page-c85d23575c11a6ea.js', 'utf8');

const modules = [8350, 1922, 2299, 1302, 9582];
modules.forEach((modId, i) => {
  const startStr = `${modId}:function`;
  const startIdx = code.indexOf(startStr);
  let nextIdx = code.length;
  if (i < modules.length - 1) {
    nextIdx = code.indexOf(`${modules[i+1]}:function`);
  }
  const modCode = code.slice(startIdx, nextIdx);
  fs.writeFileSync(`./scratch_chunks/mod_${modId}.js`, modCode);
  console.log(`Module ${modId} length: ${modCode.length}`);
});
