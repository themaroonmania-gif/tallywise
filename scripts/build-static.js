const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Running standard static export build...');
  execSync('npx next build', { stdio: 'inherit' });

  const outDir = path.join(__dirname, '../out');
  const nextDir = path.join(__dirname, '../.next');

  if (fs.existsSync(outDir)) {
    console.log('Cleaning .next directory...');
    fs.rmSync(nextDir, { recursive: true, force: true });
    fs.mkdirSync(nextDir, { recursive: true });

    console.log('Copying static export files from out/ to .next/ for Cloudflare Pages upload...');
    copyDirSync(outDir, nextDir);
    console.log('Build output preparation complete!');
  } else {
    console.error('Error: out/ directory not found after build!');
    process.exit(1);
  }
} catch (e) {
  console.error('Build script failed:', e);
  process.exit(1);
}
