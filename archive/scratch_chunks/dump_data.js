const fs = require('fs');
let code = fs.readFileSync('./scratch_chunks/mod_2299.js', 'utf8').trim();

// The code starts with `2299:function(e,t,i){...}`
const firstBrace = code.indexOf('{');
const lastBrace = code.lastIndexOf('}');
let body = code.slice(firstBrace + 1, lastBrace);

const t = {};
const i = {
  d: (obj, map) => {
    for (const k in map) {
      Object.defineProperty(obj, k, { get: map[k], enumerable: true });
    }
  }
};

const fn = new Function('e', 't', 'i', body);
fn({}, t, i);

const result = {};
for (const k of Object.keys(t)) {
  result[k] = t[k];
}

fs.writeFileSync('./scratch_chunks/portfolio_data.json', JSON.stringify(result, null, 2));
console.log("Extracted keys:", Object.keys(result));
console.log("Summary:", Object.entries(result).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length + ' items' : typeof v}`));
