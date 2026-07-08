const fs = require('fs');
const path = require('path');

// Disable wrapping on Windows to prevent local development command conflicts
if (process.platform === 'win32') {
  console.log('Skipping wrangler wrapping on Windows to prevent local execution conflicts.');
  process.exit(0);
}

try {
  const wranglerBinPath = path.join(__dirname, '../node_modules/wrangler/bin/wrangler.js');
  
  if (fs.existsSync(wranglerBinPath)) {
    console.log('Wrapping wrangler for Cloudflare CI build execution...');
    
    const buildInjection = `
// Wrapped by Tallywise build script to guarantee OpenNext compilation before deployment in CI
if ((process.argv.includes('deploy') || process.argv.includes('publish')) && !process.env.TALLYWISE_BUILDING) {
  process.env.TALLYWISE_BUILDING = 'true'; // Set environment variable globally to block recursion in spawned grandchild processes
  const { execSync } = require('child_process');
  try {
    console.log('Running proactive OpenNext build on Cloudflare CI...');
    execSync('npx opennextjs-cloudflare build', { stdio: 'inherit' });
  } catch (e) {
    console.error('Proactive OpenNext build failed:', e);
    process.exit(1);
  }
}
`;
    
    const cleanWranglerJs = `#!/usr/bin/env node
const { join } = require("path");
`;
    
    const requireStatement = `require(join(__dirname, "../wrangler-dist/cli.js"));`;
    
    const content = cleanWranglerJs.trim() + '\n' + buildInjection + '\n' + requireStatement;
    
    fs.writeFileSync(wranglerBinPath, content, 'utf8');
    console.log('Wrangler wrapped successfully on Cloudflare CI environment!');
  } else {
    console.warn('Wrangler binary path not found, skipping wrap.');
  }
} catch (e) {
  console.error('Failed to wrap wrangler:', e);
}
