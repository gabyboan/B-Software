import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const target = process.argv[2];
if (!['preview', 'production'].includes(target)) {
  console.error('Use npm run deploy:preview or npm run deploy.');
  process.exit(1);
}
const branch = target === 'production' ? 'main' : 'revision-20261111';
const wrangler = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
const root = fileURLToPath(new URL('../', import.meta.url));
const result = spawnSync(process.execPath, [wrangler, 'pages', 'deploy', 'dist', '--project-name', 'bsoftware', '--branch', branch, ...process.argv.slice(3)], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: '4bcd2f0373e615e04cb8cd9c21a63ccc', WRANGLER_SEND_METRICS: 'false' },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
