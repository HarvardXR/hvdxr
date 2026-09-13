'use client';

import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { conferences, conferenceForPath } from '../lib/conferences';
import { useEffect, useRef, useState } from 'react';
const currentConference = { year: 2027, theme: 'Agent in Dimensions', date: 'APR 11 · 2027', location: 'HARVARD UNIVERSITY' };
const conferenceLinks = [
  { label: 'Schedule', href: '/2026/program-2026' },
  { label: 'Speakers', href: '/2026/speakers-2026' },
  { label: 'Sponsors', href: '/2026/sponsors-2026' },
];
const ticketUrl = 'https://secure.touchnet.net/C20832_ustores/web/store_main.jsp?STOREID=178&SINGLESTORE=true';

export function SiteHeader({ pathname = '/' }: { pathname?: string }) {
  const edition = conferenceForPath(pathname);
  const links = edition ? [
    { label: 'Schedule', href: edition.program },
    { label: 'Speakers', href: edition.speakers },
    { label: 'Sponsors', href: edition.sponsors },
  ] : conferenceLinks;
  const [pastOpen, setPastOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pastButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const active = (href: string) => pathname === href ? 'page' as const : undefined;

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

  return (
    <header className={`site-header${pastOpen ? ' is-past-events-open' : ''}`} ref={headerRef} onBlur={(event) => {
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
          <Link href="/2026/showcase-2026" aria-current={active('/2026/showcase-2026')}>Showcase</Link>
          <div className="past-events-navigation">
            <button ref={pastButton} type="button" aria-expanded={pastOpen} aria-controls="past-events-menu" onClick={() => setPastOpen(!pastOpen)}>
              Past Events <ChevronDown size={16} aria-hidden="true" />
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
        <nav aria-label={`${edition?.year ?? currentConference.year} conference navigation`}>
          {edition && <Link className="archive-edition" href={`/${edition.year}`} aria-current={active(`/${edition.year}`)}><span>{edition.year}</span><strong>{edition.theme}</strong></Link>}
          {links.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href)}>{link.label}</Link>)}
        </nav>
        <p>{edition?.date ?? currentConference.date} <span>/</span> {edition?.location ?? currentConference.location}</p>
      </div>
      {pastOpen && <nav className="past-events-menu" id="past-events-menu" aria-label="Past conferences">
        {conferences.map(conference => <Link className="past-event-cta" key={conference.year} href={`/${conference.year}`} aria-current={active(`/${conference.year}`)} onClick={() => setPastOpen(false)}>
          <span>{conference.year} · {conference.theme}</span><ChevronRight size={18} aria-hidden="true" />
        </Link>)}
      </nav>}
      {mobileOpen && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
        <Link href="/2026/showcase-2026" onClick={() => setMobileOpen(false)}>Showcase</Link>
        <button type="button" aria-expanded={pastOpen} aria-controls="past-events-menu" onClick={() => { setMobileOpen(false); setPastOpen(!pastOpen); pastButton.current?.focus(); }}>Past Events <ChevronDown size={16} /></button>
        <Link href="/2026/about-2026" onClick={() => setMobileOpen(false)}>About</Link>
      </nav>}
    </header>
  );
}
