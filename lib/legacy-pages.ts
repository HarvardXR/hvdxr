import headerCSS from '../components/header.css?raw';
import headerShells from '../components/header-shells.json';
import { archiveOverview } from './archive-overview';
import pageHeaders from '../src/legacy-headers.json';
import homeHeroOriginal from '../src/overrides/home-hero-original.html?raw';
import homeHero from '../src/overrides/home-hero.html?raw';
import homeHeroCSS from '../src/overrides/home-hero.css?raw';

// Legacy markup keeps the original Webflow asset paths under /_ext/. Serve those
// assets from their canonical hosts instead of shipping a second local mirror.
const externalizeLegacyAssets = (html: string) => html.replaceAll('/_ext/', 'https://');

const pages = import.meta.glob<string>('../src/legacy/**/index.html', {
  query: '?raw', import: 'default', eager: true,
});

export function legacyPage(pathname: string): string | undefined {
  const path = pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
  const relative = path === '/' ? 'index.html' : `${path.slice(1)}/index.html`;
  const overview = archiveOverview(path);
  const original = pages[`../src/legacy/${relative}`];
  const oldHeader = (pageHeaders as Record<string, string>)[relative];
  if (!overview && (!original || !oldHeader)) return undefined;
  const markup = (headerShells as Record<string, string>)[path] ?? headerShells['/'];
  const header = `<div id="hxr-site-header" style="display:block;position:sticky;top:0;z-index:1000"><template shadowrootmode="open"><style>${headerCSS}</style><div id="header-root">${markup}</div></template></div>`;
  if (overview) return externalizeLegacyAssets(overview.replace('<!--HEADER-->', header));
  const page = path === '/'
    ? original.replace(homeHeroOriginal, homeHero).replace('</head>', `<style id="hxr-home-hero-styles">${homeHeroCSS}</style></head>`)
    : original;
  return externalizeLegacyAssets(page.replace(oldHeader, header).replace('</body>', '<script type="module" src="/_hxr/header.js"></script></body>'));
}
