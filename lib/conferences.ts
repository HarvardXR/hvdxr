// One route map shared by the header and the archive overview pages.
export const conferences = [
  { year: 2026, theme: 'XR+: From Pixel to Voxel', date: 'APR 11 · 2026', location: 'HARVARD GSD · GUND HALL', program: '/2026/program-2026', speakers: '/2026/speakers-2026', sponsors: '/2026/sponsors-2026' },
  { year: 2025, theme: 'Augmented Self', date: 'APR 19 · 2025', location: 'HARVARD GSD · GUND HALL', program: '/2025/program', speakers: '/2025/speakers', sponsors: '/2025/sponsors' },
  { year: 2024, theme: 'Extended Intelligence', date: 'APR 06 · 2024', location: 'HARVARD · SCIENCE AND ENGINEERING COMPLEX', program: '/2024/events', speakers: '/2024/speakers', sponsors: '/2024#sponsors' },
  { year: 2023, theme: 'Inaugural Conference', date: '2023', location: 'HARVARD UNIVERSITY', program: '/2023/events', speakers: '/2023/speakers', sponsors: '/2023/about#w-node-_303e6270-de11-ca7a-5e90-29b7d308ab32-f1137e35' },
];
export function conferenceForPath(path: string) {
  return conferences.find(c => path === `/${c.year}` || path.startsWith(`/${c.year}/`));
}
