'use client';

import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { conferences, conferenceForPath } from '../lib/conferences';
import { useEffect, useRef, useState } from 'react';
const currentConference = { year: 2027, theme: 'Agent in Dimensions', date: 'APR 11 . 2027', location: 'HARVARD UNIVERSITY' };
const conferenceLinks = [
  { label: 'Schedule', href: '/#schedule' },
  { label: 'Speakers', href: '/#speakers' },
  { label: 'Sponsors', href: '/#sponsors' },
];
const ticketUrl = 'https://secure.touchnet.net/C20832_ustores/web/store_main.jsp?STOREID=178&SINGLESTORE=true';

export function SiteHeader({ pathname = '/' }: { pathname?: string }) {
  const edition = conferenceForPath(pathname);
  const isShowcase = pathname === '/2026/showcase-2026';
  const links = edition ? [
    { label: 'Schedule', href: edition.program },
    { label: 'Speakers', href: edition.speakers },
    { label: 'Sponsors', href: edition.sponsors },
  ] : conferenceLinks;
  const [pastOpen, setPastOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showcaseNudging, setShowcaseNudging] = useState(true);
  const [homeSection, setHomeSection] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const pastButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const active = (href: string) => pathname === href || (pathname === '/' && href.startsWith('/#') && homeSection === href.slice(1)) ? 'page' as const : undefined;

  useEffect(() => {
    setPastOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (!event.composedPath().includes(headerRef.current as EventTarget)) {
        setPastOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  useEffect(() => {
    const syncHomeSection = () => setHomeSection(window.location.hash);
    syncHomeSection();
    window.addEventListener('hashchange', syncHomeSection);
    return () => window.removeEventListener('hashchange', syncHomeSection);
  }, []);

  return (
    <header className={`site-header${pastOpen ? ' is-past-events-open' : ''}`} ref={headerRef} onClickCapture={(event) => {
      const target = event.target as Element;
      if (target.closest('a, button') && !target.closest('.showcase-link')) setShowcaseNudging(false);
    }} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) { setPastOpen(false); setMobileOpen(false); }
    }} onKeyDown={(event) => {
      if (event.key === 'Escape') {
        if (pastOpen) pastButton.current?.focus();
        else if (mobileOpen) menuButton.current?.focus();
        setPastOpen(false);
        setMobileOpen(false);
      }
    }}>
      <div className="header-main">
        <Link className="header-brand" href="/" aria-label="Harvard XR home">
          <span className="header-logo" aria-hidden="true" />
        </Link>
        <Link className="edition-navigation" href="/" aria-label={`${currentConference.year} conference home`}>
          <span>{currentConference.year}</span>
          <strong>{currentConference.theme}</strong>
        </Link>
        <nav className="primary-navigation" aria-label="Primary navigation">
          <Link className={`showcase-link${showcaseNudging ? ' is-nudging' : ''}`} href="/2026/showcase-2026" aria-current={active('/2026/showcase-2026')}>Showcase</Link>
          <div className="past-events-navigation">
            <button className={pastOpen ? 'is-active' : undefined} ref={pastButton} type="button" aria-expanded={pastOpen} aria-controls="past-events-menu" onClick={() => setPastOpen(!pastOpen)}>
              {pastOpen && <span className="past-events-indicator" aria-hidden="true" />}Past Events <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
          <Link href="/2026/about-2026" aria-current={active('/2026/about-2026')}>About</Link>
        </nav>
        <button className="mobile-menu-toggle" ref={menuButton} type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <a className="ticket-button" href={ticketUrl} target="_blank" rel="noreferrer">Get Tickets</a>
      </div>
      <div className="header-secondary">
        {pastOpen && <div className="past-events-panel">
          <p className="past-events-breadcrumb">HXR Conference <span>/</span> Past Events</p>
          <nav className="past-events-menu" id="past-events-menu" aria-label="Past conferences">
            {conferences.map(conference => <Link className="past-event-cta" key={conference.year} href={`/${conference.year}`} aria-current={active(`/${conference.year}`)} onClick={() => setPastOpen(false)}>
              <span>{conference.year} · {conference.theme}</span><ChevronRight size={18} aria-hidden="true" />
            </Link>)}
          </nav>
        </div>}
        <div className="header-secondary-main">
          <nav aria-label={`${edition?.year ?? currentConference.year} conference navigation`}>
            {edition && !isShowcase && <Link className="archive-edition" href={`/${edition.year}`} aria-current={active(`/${edition.year}`)}><span>{edition.year}</span><strong>{edition.theme}</strong></Link>}
            {links.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href)}>{link.label}</Link>)}
          </nav>
          <p>TBD April Saturday . 2027</p>
        </div>
      </div>
      {mobileOpen && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
        <Link href="/2026/showcase-2026" onClick={() => setMobileOpen(false)}>Showcase</Link>
        <button type="button" aria-expanded={pastOpen} aria-controls="past-events-menu" onClick={() => { setMobileOpen(false); setPastOpen(!pastOpen); pastButton.current?.focus(); }}>Past Events <ChevronDown size={16} /></button>
        <Link href="/2026/about-2026" onClick={() => setMobileOpen(false)}>About</Link>
      </nav>}
    </header>
  );
}
