const fs = require('fs');
const webpackRuntime = fs.readFileSync('./scratch_chunks/webpack-975384cfebe12791.js', 'utf8');

// Webpack runtime has chunk mappings: u.u = function(e) { return "" + e + "." + { ... }[e] + ".js" }
console.log(webpackRuntime.slice(0, 1500));
