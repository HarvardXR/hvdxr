import { hydrateRoot } from 'react-dom/client';
import { SiteHeader } from './site-header';
const host = document.getElementById('hxr-site-header');
if (host) {
  if (!host.shadowRoot) {
    const template = host.querySelector('template');
    if (template) host.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
  }
  const root = host.shadowRoot?.getElementById('header-root');
  if (root) hydrateRoot(root, <SiteHeader pathname={window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/'} />);
  // Match the video's overlap to the glass row, including mobile wrapping.
  const glassRow = host.shadowRoot?.querySelector('.header-secondary');
  if (glassRow && document.querySelector('.hxr-home-hero')) {
    const updateOverlap = () => {
      document.documentElement.style.setProperty('--hxr-glass-height', `${glassRow.getBoundingClientRect().height}px`);
    };
    updateOverlap();
    new ResizeObserver(updateOverlap).observe(glassRow);
  }
}
