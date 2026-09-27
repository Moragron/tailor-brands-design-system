// Builds the installable package into dist/:
//   dist/index.js         ESM, React external, prefixed with "use client" (every export is a client
//                         component or hook, so Next.js App Router can import it from server components)
//   dist/types/index.d.ts type declarations
//   dist/styles.css       tokens + all component styles, in @layer components
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';

const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' });
run('node', ['scripts/build-tokens-css.mjs']);
run('npx', ['vite', 'build', '--config', 'vite.lib.config.ts', '--logLevel', 'warn']);
run('npx', ['tsc', '-p', 'tsconfig.build.json']);

const js = readFileSync('dist/index.js', 'utf8');
if (!js.startsWith("'use client'")) writeFileSync('dist/index.js', `'use client';\n${js}`);

// Layer order is declared up front and matches Tailwind v4's, so the result is the same whether
// this file loads before or after Tailwind: preflight (base) never beats components, and
// utilities (e.g. className="mt-4") still override component styles.
const tokens = readFileSync('tokens/tokens.css', 'utf8');
const components = readFileSync('dist/components.css', 'utf8');
writeFileSync('dist/styles.css', `/* tailor-brands-design-system — tokens + components. Import once per app (see AGENTS.md). */
@layer theme, base, components, utilities;
${tokens}
@layer components {
${components}
}
`);
rmSync('dist/components.css');
console.log('built dist/index.js, dist/types, dist/styles.css');
