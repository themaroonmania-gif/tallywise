const fs = require('fs');
const path = require('path');

try {
  const wranglerBinPath = path.join(__dirname, '../node_modules/wrangler/bin/wrangler.js');
  
  if (fs.existsSync(wranglerBinPath)) {
    console.log('Wrapping wrangler to bypass deployments and run build dynamically...');
    
    const deployBypass = `
// Bypass wrangler deploy on Cloudflare Pages CI environment for static hosting
if (process.argv.includes('deploy') || process.argv.includes('publish')) {
  console.log('✨ Proactive static deploy bypass: Triggering static build in deploy phase...');
  const { execSync } = require('child_process');
  try {
    // Run the build script dynamically since the dashboard build command is set to "None"
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✨ Dynamic build complete! Cloudflare Pages will now upload the static HTML/CSS files from the .next folder directly.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Dynamic build failed inside deploy wrapper:', e);
    process.exit(1);
  }
}
`;
    
    const cleanWranglerJs = `#!/usr/bin/env node
const { join } = require("path");
`;
    
    const requireStatement = `require(join(__dirname, "../wrangler-dist/cli.js"));`;
    
    const content = cleanWranglerJs.trim() + '\n' + deployBypass + '\n' + requireStatement;
    
    fs.writeFileSync(wranglerBinPath, content, 'utf8');
    console.log('Wrangler wrapped successfully for dynamic static compilation!');
  } else {
    console.warn('Wrangler binary path not found, skipping wrap.');
  }
} catch (e) {
  console.error('Failed to wrap wrangler:', e);
}
