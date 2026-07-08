const fs = require('fs');
const path = require('path');

try {
  const wranglerBinPath = path.join(__dirname, '../node_modules/wrangler/bin/wrangler.js');
  
  if (fs.existsSync(wranglerBinPath)) {
    console.log('Wrapping wrangler to run build command on deploy...');
    
    const buildInjection = `
// Wrapped by Tallywise build script to guarantee OpenNext compilation before deployment
if ((process.argv.includes('deploy') || process.argv.includes('publish')) && !process.env.TALLYWISE_BUILDING) {
  const { execSync } = require('child_process');
  try {
    console.log('Running proactive OpenNext build...');
    execSync('npx opennextjs-cloudflare build', { 
      stdio: 'inherit',
      env: { ...process.env, TALLYWISE_BUILDING: 'true' }
    });
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
    
    // Write buildInjection BEFORE requireStatement to ensure the build completes before Wrangler boots
    const content = cleanWranglerJs.trim() + '\n' + buildInjection + '\n' + requireStatement;
    
    fs.writeFileSync(wranglerBinPath, content, 'utf8');
    console.log('Wrangler wrapped successfully with build-before-require order!');
  } else {
    console.warn('Wrangler binary path not found, skipping wrap.');
  }
} catch (e) {
  console.error('Failed to wrap wrangler:', e);
}
