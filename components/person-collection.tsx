import { archiveAsset, getPeople } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';

export function PersonCollection({ ids }: { ids: string[] }) {
  const people = getPeople(ids);

  return (
    <div className="person-collection">
      {people.map((person) => (
        <Link
          className="person-tile"
          href={`/people/${person.id}`}
          key={person.id}
        >
          <div className="person-tile-image">
            <Image
              src={archiveAsset(person.portraitAsset)}
              alt={`Portrait of ${person.name}`}
              fill
              sizes="(max-width: 700px) 50vw, 25vw"
            />
          </div>
          <h3>{person.name}</h3>
          <p>{person.title}</p>
          {person.organization && <span>{person.organization}</span>}
        </Link>
      ))}
    </div>
  );
}
