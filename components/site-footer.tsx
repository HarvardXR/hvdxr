import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer>
      <Link className="wordmark inverse" href="/" aria-label="Harvard XR home">
        Harvard<span>XR</span>
      </Link>
      <nav aria-label="Footer navigation">
        <Link href="/2026/program-2026">Schedule</Link>
        <Link href="/2026/speakers-2026">Speakers</Link>
        <Link href="/2026/sponsors-2026">Sponsors</Link>
        <Link href="/2026/showcase-2026">Showcase</Link>
        <Link href="/2026/about-2026">About</Link>
      </nav>
      <p>© 2022–2026 HarvardXR</p>
    </footer>
  );
}
