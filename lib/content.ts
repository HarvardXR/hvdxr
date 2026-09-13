import editions2026 from '@/src/content/editions/2026.json';
import events from '@/src/content/events/index.json';
import organizations from '@/src/content/organizations/index.json';
import people from '@/src/content/people/index.json';

export type Person = (typeof people)[number];
export type Event = (typeof events)[number];
export type Organization = (typeof organizations)[number];

export const edition2026 = editions2026;

export function archiveAsset(path: string) {
  return path.startsWith('http')
    ? path
    : path.replace('archive/original-media/', '/media/archive/');
}

export function getPerson(id: string) {
  return people.find((person) => person.id === id);
}

export function getEvent(id: string) {
  return events.find((event) => event.id === id);
}

export function getPeople(ids: string[]) {
  return ids.map(getPerson).filter((person) => person !== undefined);
}

export const speakers2026 = getPeople(edition2026.speakerIds);
export const events2026 = edition2026.eventIds
  .map(getEvent)
  .filter((event) => event !== undefined);
export const organizations2026 = organizations.filter(
  (organization) => organization.year === 2026,
);

export const allPeople = people;
export const allEvents = events;
