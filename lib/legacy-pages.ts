import headerCSS from '../components/header.css?raw';
import headerShells from '../components/header-shells.json';
import { archiveOverview } from './archive-overview';
import pageHeaders from '../src/legacy-headers.json';
import homeHeroOriginal from '../src/overrides/home-hero-original.html?raw';
import homeHero from '../src/overrides/home-hero.html?raw';
import homeHeroCSS from '../src/overrides/home-hero.css?raw';
import legacyTitleSystemCSS from '../src/overrides/legacy-title-system.css?raw';

// During local development, preserve /_ext/ paths so the preview reads the
// archived asset mirror in public/_ext. Production continues using the
// original hosts until an R2 public URL is configured.
const externalizeLegacyAssets = (html: string) => process.env.NODE_ENV === 'development'
  ? html
  : html.replaceAll('/_ext/', 'https://');

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
  if (overview) return externalizeLegacyAssets(overview.replace('<!--HEADER-->', header).replace('</head>', `<style id="hxr-legacy-title-system">${legacyTitleSystemCSS}</style></head>`));
  const page = path === '/'
    ? original.replace(homeHeroOriginal, homeHero).replace('</head>', `<style id="hxr-home-hero-styles">${homeHeroCSS}</style></head>`)
    : original;
  const pageWithHomeAnchors = path === '/'
    ? page
      .replace('<div class="section"><div class="container w-container"><div class="flex vertical-centre">', '<div class="section"><div id="schedule" class="container w-container"><div class="flex vertical-centre">')
      .replace('<div class="section"><div class="container w-container"><div class="speakers-slide-grid">', '<div class="section"><div id="speakers" class="container w-container"><div class="speakers-slide-grid">')
      .replace('<section class="section_logo01">', '<section id="sponsors" class="section_logo01">')
    : page;
  const pageWithTitleSystem = path === '/'
    ? pageWithHomeAnchors
    : pageWithHomeAnchors.replace('</head>', `<style id="hxr-legacy-title-system">${legacyTitleSystemCSS}</style></head>`);
  return externalizeLegacyAssets(pageWithTitleSystem
    .replace(oldHeader, header)
    .replace('</body>', '<script type="module" src="/_hxr/header.js"></script></body>'));
}
