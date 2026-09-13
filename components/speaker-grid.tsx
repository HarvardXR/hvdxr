'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Speaker = {
  id: string;
  name: string;
  organization: string;
  title: string;
  portraitUrl: string;
  href: string;
};

export function SpeakerGrid({
  speakers,
  collapsedCount = 8,
}: {
  speakers: Speaker[];
  collapsedCount?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const isCollapsible = collapsedCount > 0 && speakers.length > collapsedCount;
  const visibleSpeakers =
    showAll || !isCollapsible ? speakers : speakers.slice(0, collapsedCount);

  return (
    <>
      <div className="speaker-grid">
        {visibleSpeakers.map((person, index) => (
          <Link
            className="speaker-card"
            href={person.href}
            key={person.id}
            aria-label={`View ${person.name}'s speaker profile`}
          >
            <div className="portrait-frame">
              <Image
                src={person.portraitUrl}
                alt={`Portrait of ${person.name}`}
                fill
                sizes="(max-width: 800px) 50vw, 25vw"
              />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3>{person.name}</h3>
            <p>{person.organization || person.title}</p>
          </Link>
        ))}
      </div>

      {isCollapsible && (
        <button
          className="speaker-list-toggle"
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((current) => !current)}
        >
          <span>{showAll ? 'Show featured' : 'View full list'}</span>
          <span aria-hidden="true">{showAll ? '−' : '+'}</span>
        </button>
      )}
    </>
  );
}
