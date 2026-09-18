import { conferences } from './conferences';
import e2023 from '../src/content/editions/2023.json';
import e2024 from '../src/content/editions/2024.json';
import e2025 from '../src/content/editions/2025.json';
import e2026 from '../src/content/editions/2026.json';
import people from '../src/content/people/index.json';
import events from '../src/content/events/index.json';
import organizations from '../src/content/organizations/index.json';
import css from '../src/overrides/archive-overview.css?raw';

const editions = [e2023, e2024, e2025, e2026];
const copy: Record<number, { intro: string; focus: string; highlights: string[] }> = {
  2026: {
    intro: 'From pixels on a screen to worlds we can inhabit. HarvardXR 2026 explored how spatial computing, artificial intelligence, and immersive design are reshaping the way we create, learn, and connect.',
    focus: 'World models. Intelligent systems. Spatial experiences.',
    highlights: ['keynote-reality-always-wins', 'xr-ai-world-models-and-spatial-understanding', 'ai-spatial-computing-agents', '2026-end-note'],
  },
  2025: {
    intro: 'What becomes possible when technology extends human capability? Augmented Self brought together perspectives on embodied XR, generative worlds, robotics, and immersive storytelling, alongside applications in healthcare, education, and industry.',
    focus: 'Human capability, expanded.',
    highlights: ['industrial-metaverse', 'xr-for-ai-robotics-and-webspatial', 'embodied-xr-hardware-innovation', 'creating-worlds-with-genai-and-developing-for-mr-on-horizon'],
  },
  2024: {
    intro: 'Extended Intelligence explored the meeting point of XR and AI: how new creative platforms, collective intelligence, and immersive tools can shape learning, healthcare, enterprise, and the worlds we build together.',
    focus: 'Where immersive worlds meet collective intelligence.',
    highlights: ['keynote-collective-superintelligence', 'future-prototypes', 'ethics-of-xr-and-ai', 'creative-platforms'],
  },
  2023: {
    intro: 'The inaugural HarvardXR conference opened a conversation across science, technology, art, and entrepreneurship. Its program connected spatial reality and the metaverse with design, healthcare, education, and the future of work.',
    focus: 'The beginning of a shared exploration.',
    highlights: ['sci-tech-art', 'healthcare-and-education', 'spatial-reality', 'future-of-work'],
  },
};
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const asset = (value: string) => escape(
  process.env.NODE_ENV === 'development' && value.startsWith('https://cdn.prod.website-files.com/')
    ? value.replace('https://', '/_ext/')
    : value.startsWith('http') ? value : value.replace('archive/original-media/', '/media/archive/'),
);
const link = (href: string, label: string, className = 'archive-link') => `<a class="${className}" href="${escape(href)}">${escape(label)} <span aria-hidden="true">↗</span></a>`;

export function archiveOverview(path: string): string | undefined {
  const conference = conferences.find(c => path === `/${c.year}`);
  if (!conference) return undefined;
  const { year, theme, program, speakers, sponsors, date, location } = conference;
  const edition = editions.find(e => e.year === year)!;
  const content = copy[year];
  const guests = edition.speakerIds.map(id => people.find(p => p.id === id)).filter(p => p !== undefined);
  const partners = organizations.filter(o => o.year === year);
  const highlights = content.highlights.map(id => events.find(e => e.id === id)).filter(e => e !== undefined);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${year} · ${escape(theme)} — HarvardXR</title><meta name="description" content="${escape(content.intro)}"><style>${css}</style></head><body>
<!--HEADER-->
<main class="archive-overview">
<section class="archive-hero"><div class="archive-hero-art" aria-hidden="true"><span>${year}</span><i></i><i></i><i></i></div><div class="archive-hero-content"><a class="archive-back" href="/">← HarvardXR / Past events</a><p class="eyebrow">XR CONFERENCE · ${year}</p><h1>${escape(theme)}</h1><p class="archive-intro">${escape(content.intro)}</p><div class="archive-hero-actions">${link(program, 'Explore the schedule', 'archive-button')}${link(speakers, 'Meet the speakers')}</div><p class="archive-date">${escape(date)} <span>/</span> ${escape(location)}</p></div></section>
<div class="archive-content"><section class="archive-at-a-glance" aria-label="Conference overview"><div><span class="eyebrow">THE ${year} EDITION</span><h2>${escape(content.focus)}</h2></div><div class="archive-stat"><strong>${edition.eventIds.length}</strong><span>Program entries</span></div><div class="archive-stat"><strong>${guests.length}</strong><span>Listed speakers</span></div></section>
<section id="schedule" class="archive-section"><div class="archive-section-heading"><div><p class="eyebrow">01 / THE CONVERSATIONS</p><h2>Program highlights</h2></div>${link(program, 'Full schedule')}</div><div class="archive-program">${highlights.map((event, i) => `<a href="/events/${escape(event.id)}" class="archive-session"><span class="archive-session-number">0${i + 1}</span><div><h3>${escape(event.title)}</h3><p>${escape(event.speakerIds.map(id => people.find(p => p.id === id)?.name).filter(Boolean).join(' · '))}</p></div><span aria-hidden="true">↗</span></a>`).join('')}</div></section>
<section id="speakers" class="archive-section"><div class="archive-section-heading"><div><p class="eyebrow">02 / THE PEOPLE</p><h2>Voices of ${year}</h2></div>${link(speakers, 'All speakers')}</div><div class="archive-speakers">${guests.slice(0, 6).map(person => `<a href="/people/${escape(person.id)}" class="archive-person">${person.portraitAsset ? `<img src="${asset(person.portraitAsset)}" alt="${escape(person.name)}" loading="lazy" width="400" height="440">` : ''}<h3>${escape(person.name)}</h3><p>${escape(person.title)}${person.organization ? ` · ${escape(person.organization)}` : ''}</p></a>`).join('')}</div></section>
<section id="sponsors" class="archive-section"><div class="archive-section-heading"><div><p class="eyebrow">03 / THE COMMUNITY</p><h2>Sponsors & partners</h2></div>${year !== 2024 ? link(sponsors, `Explore ${year} partners`) : ''}</div>${partners.length ? `<div class="archive-partners">${partners.map(partner => `<div class="archive-partner">${partner.logoAsset ? `<img src="${asset(partner.logoAsset)}" alt="${escape(partner.name)}" loading="lazy" width="180" height="90">` : `<strong>${escape(partner.name)}</strong>`}<p>${escape(partner.name)}</p></div>`).join('')}</div>` : `<p class="archive-note">${year === 2023 ? 'Discover the sponsors and community partners behind the inaugural conference in the 2023 archive.' : 'Sponsor and partner details for this edition have not yet been added to the archive.'}</p>`}</section>
<section class="archive-section"><div class="archive-section-heading"><div><p class="eyebrow">CONTINUE EXPLORING</p><h2>More from HarvardXR</h2></div></div><div class="archive-other-years">${conferences.filter(c => c.year !== year).map(c => `<a href="/${c.year}"><span>${c.year}</span><strong>${escape(c.theme)}</strong><span aria-hidden="true">↗</span></a>`).join('')}</div></section></div></main><footer class="archive-footer"><a href="/">HarvardXR</a><span>Exploring the next dimensions.</span><a href="mailto:info@harvardxr.com">Contact us ↗</a></footer><script type="module" src="/_hxr/header.js"></script></body></html>`;
}
