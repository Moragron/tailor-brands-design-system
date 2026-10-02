// Builds the showcase as a shareable preview page (a claude.ai Artifact), for reviewing changes
// without a local dev server:
//
//   npm run preview:build        → preview-dist/index.html + preview-dist/assets/*
//
// Same showcase as `npm run build`, but with relative asset paths and an index.html shaped for
// the Artifact host: it wraps the page in its own <!doctype>/<head>/<body>, so we keep only the
// title, the built CSS/JS tags and the root element. A small stamp at the bottom names the
// branch, commit and build time, so a reviewer can tell which version they're looking at.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { build } from 'vite';

const root = resolve(new URL('..', import.meta.url).pathname);
const outDir = join(root, 'preview-dist');

await build({ root, base: './', logLevel: 'warn', build: { outDir, emptyOutDir: true } });

const git = (cmd) => {
  try {
    return execSync(`git ${cmd}`, { cwd: root }).toString().trim();
  } catch {
    return 'unknown';
  }
};
const branch = git('rev-parse --abbrev-ref HEAD');
const commit = git('rev-parse --short HEAD');
const dirty = git('status --porcelain') ? ' + uncommitted changes' : '';
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const builtAt = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

const html = readFileSync(join(outDir, 'index.html'), 'utf8');
const pick = (re) => [...html.matchAll(re)].map((m) => m[0]);
const assets = [
  ...pick(/<link\b[^>]*rel="stylesheet"[^>]*>/g),
  ...pick(/<link\b[^>]*rel="modulepreload"[^>]*>/g),
  ...pick(/<script\b[^>]*src="[^"]*"[^>]*><\/script>/g),
];

// The design system has no dark theme, so the preview pins the light look and an explicit page
// background regardless of the viewer's theme.
const page = `<title>Tailor Brands DS Preview</title>
<style>
  :root { color-scheme: light; }
  html, body { background: var(--tb-color-surface-page, #ffffff); }
  .tb-preview-stamp {
    padding: var(--tb-space-4, 16px);
    text-align: center;
    font: 13px/1.4 var(--tb-font-family-base, helvetica, arial, sans-serif);
    color: var(--tb-color-text-muted, #727585);
  }
</style>
${assets.join('\n')}
<div id="root"></div>
<p class="tb-preview-stamp">v${version} · ${branch} @ ${commit}${dirty} · built ${builtAt}</p>
`;
writeFileSync(join(outDir, 'index.html'), page);
console.log(`preview-dist/ ready: v${version} · ${branch} @ ${commit}${dirty}`);
