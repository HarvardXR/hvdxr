import { build } from 'esbuild';
import { writeFile, readdir, unlink } from 'node:fs/promises';
const links = { name: 'standalone-header-links', setup(builder) {
  builder.onResolve({ filter: /^next\/link$/ }, args => ({ path: args.path, namespace: 'header' }));
  builder.onLoad({ filter: /.*/, namespace: 'header' }, () => ({
    contents: 'import { createElement } from "react"; export default function Link(props) { return createElement("a", props); }',
    resolveDir: process.cwd(),
  }));
}};
const options = { bundle: true, format: 'esm', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, plugins: [links] };
await build({ ...options, entryPoints: ['components/header-entry.tsx'], outfile: 'public/_hxr/header.js', minify: true });
// Render the same component for the initial document and browser hydration.
const temporary = '.header-render.mjs';
try {
  await build({ ...options, stdin: { contents: `import { createElement } from 'react'; import { renderToString } from 'react-dom/server'; import { SiteHeader } from './components/site-header'; export const render = pathname => renderToString(createElement(SiteHeader, { pathname }));`, resolveDir: process.cwd(), loader: 'tsx' }, outfile: temporary, platform: 'node', packages: 'external' });
  const { render } = await import(`${process.cwd()}/${temporary}?t=${Date.now()}`);
  const paths = ['/'];
  for (const year of [2023, 2024, 2025, 2026]) {
    paths.push(`/${year}`);
    for (const entry of await readdir(`src/legacy/${year}`, { withFileTypes: true })) {
      if (entry.isDirectory()) paths.push(`/${year}/${entry.name}`);
    }
  }
  await writeFile('components/header-shells.json', JSON.stringify(Object.fromEntries(paths.map(path => [path, render(path)])), null, 2) + '\n');
} finally { await unlink(temporary).catch(() => {}); }
