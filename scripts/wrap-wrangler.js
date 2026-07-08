const fs = require('fs');
const path = require('path');

try {
  const wranglerBinPath = path.join(__dirname, '../node_modules/wrangler/bin/wrangler.js');
  
  if (fs.existsSync(wranglerBinPath)) {
    console.log('Wrapping wrangler to run build command on deploy...');
    let content = fs.readFileSync(wranglerBinPath, 'utf8');
    
    // Check if we already wrapped it or need to update the wrapper
    if (!content.includes('TALLYWISE_BUILDING') || content.includes('../dist/cli.js')) {
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
require(join(__dirname, "../wrangler-dist/cli.js"));
`;
      
      content = cleanWranglerJs.trim() + '\n' + buildInjection;
      
      fs.writeFileSync(wranglerBinPath, content, 'utf8');
      console.log('Wrangler wrapped successfully with recursion safety and correct binary path!');
    } else {
      console.log('Wrangler is already wrapped with recursion safety.');
    }
  } else {
    console.warn('Wrangler binary path not found, skipping wrap.');
  }
} catch (e) {
  console.error('Failed to wrap wrangler:', e);
}
