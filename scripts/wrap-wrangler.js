const fs = require('fs');
const path = require('path');

const originalWranglerContent = `#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

const MIN_NODE_VERSION = "22.0.0";
let wranglerProcess;

/**
 * Executes ../wrangler-dist/cli.js
 */
function runWrangler() {
	if (semiver(process.versions.node, MIN_NODE_VERSION) < 0) {
		// Note Volta and nvm are also recommended in the official docs:
		// https://developers.cloudflare.com/workers/get-started/guide#2-install-the-workers-cli
		console.error(
			\`Wrangler requires at least Node.js v\${MIN_NODE_VERSION}. You are using v\${process.versions.node}. Please update your version of Node.js.

Consider using a Node.js version manager such as https://volta.sh/ or https://github.com/nvm-sh/nvm.\`
		);
		process.exitCode = 1;
		return;
	}

	return spawn(
		process.execPath,
		[
			"--no-warnings",
			...process.execArgv,
			path.join(__dirname, "../wrangler-dist/cli.js"),
			...process.argv.slice(2),
		],
		{
			stdio: ["inherit", "inherit", "inherit", "ipc"],
		}
	)
		.on("exit", (code) =>
			process.exit(code === undefined || code === null ? 0 : code)
		)
		.on("message", (message) => {
			if (process.send) {
				process.send(message);
			}
		})
		.on("disconnect", () => {
			if (process.disconnect) {
				process.disconnect();
			}
		});
}

// semiver implementation via https://github.com/lukeed/semiver/blob/ae7eebe6053c96be63032b14fb0b68e2553fcac4/src/index.js

/**
MIT License

Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

var fn = new Intl.Collator(0, { numeric: 1 }).compare;

function semiver(a, b, bool) {
	a = a.split(".");
	b = b.split(".");

	return (
		fn(a[0], b[0]) ||
		fn(a[1], b[1]) ||
		((b[2] = b.slice(2).join(".")),
		(bool = /[.-]/.test((a[2] = a.slice(2).join(".")))),
		bool == /[.-]/.test(b[2]) ? fn(a[2], b[2]) : bool ? -1 : 1)
	);
}

// end semiver implementation

if (module === require.main) {
	wranglerProcess = runWrangler();
	process.on("SIGINT", () => {
		wranglerProcess && wranglerProcess.kill();
	});
	process.on("SIGTERM", () => {
		wranglerProcess && wranglerProcess.kill();
	});
}
`;

try {
  const wranglerBinPath = path.join(__dirname, '../node_modules/wrangler/bin/wrangler.js');
  
  if (fs.existsSync(wranglerBinPath)) {
    console.log('Restoring and wrapping wrangler with original spawn-based CLI execution...');
    
    // On Windows, write the pure unmodified original file to ensure no local command issues
    if (process.platform === 'win32') {
      fs.writeFileSync(wranglerBinPath, originalWranglerContent, 'utf8');
      console.log('Original wrangler.js restored successfully on Windows (unwrapped).');
      process.exit(0);
    }
    
    // On Linux/Cloudflare CI, prepend the build injection right after the shebang line
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
    
    const shebang = '#!/usr/bin/env node\n';
    const originalBody = originalWranglerContent.replace(shebang, '');
    const content = shebang + buildInjection + originalBody;
    
    fs.writeFileSync(wranglerBinPath, content, 'utf8');
    console.log('Wrangler wrapped successfully on Cloudflare CI using original spawn structure!');
  } else {
    console.warn('Wrangler binary path not found, skipping wrap.');
  }
} catch (e) {
  console.error('Failed to wrap wrangler:', e);
}
