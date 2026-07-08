const fs = require('fs');
const path = require('path');

try {
  const wranglerBinPath = path.join(__dirname, '../node_modules/wrangler/bin/wrangler.js');
  
  if (fs.existsSync(wranglerBinPath)) {
    console.log('Wrapping wrangler to bypass deployments and run statically...');
    
    const deployBypass = `
// Bypass wrangler deploy on Cloudflare Pages CI environment for static hosting
if (process.argv.includes('deploy') || process.argv.includes('publish')) {
  console.log('✨ Proactive static deploy bypass: Cloudflare Pages will upload the static HTML/CSS files from .next folder directly.');
  process.exit(0);
}
`;
    
    const cleanWranglerJs = `#!/usr/bin/env node
const { join } = require("path");
`;
    
    const requireStatement = `require(join(__dirname, "../wrangler-dist/cli.js"));`;
    
    const content = cleanWranglerJs.trim() + '\n' + deployBypass + '\n' + requireStatement;
    
    fs.writeFileSync(wranglerBinPath, content, 'utf8');
    console.log('Wrangler wrapped successfully for static deploy bypass!');
  } else {
    console.warn('Wrangler binary path not found, skipping wrap.');
  }
} catch (e) {
  console.error('Failed to wrap wrangler:', e);
}
