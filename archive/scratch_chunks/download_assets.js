const https = require('https');
const fs = require('fs');
const path = require('path');

const data = require(path.join(__dirname, 'portfolio_data.json'));
const projects = data._G || [];

const urls = [
  '/portrait.jpg',
  '/icon.png',
  '/favicon.ico',
  data.ep?.profileImage || '/images/profile.webp',
  ...projects.map(p => p.mediaUrl).filter(Boolean)
];

const uniqueUrls = [...new Set(urls)];
console.log("Total images to download:", uniqueUrls.length);

async function download(urlPath) {
  const fullUrl = `https://dizzoporto.vercel.app${urlPath}`;
  const localPath = path.join('./public', urlPath);
  fs.mkdirSync(path.dirname(localPath), { recursive: true });

  return new Promise((resolve) => {
    https.get(fullUrl, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded ${urlPath} (${fs.statSync(localPath).size} bytes)`);
          resolve(true);
        });
      } else {
        console.warn(`✗ Failed ${urlPath} status ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.warn(`Error on ${urlPath}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const u of uniqueUrls) {
    await download(u);
  }
  console.log("Finished downloading assets!");
}
run();
