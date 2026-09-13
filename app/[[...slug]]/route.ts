import { legacyPage } from '@/lib/legacy-pages';
export function GET(request: Request) {
  const html = legacyPage(new URL(request.url).pathname);
  return html
    ? new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    : new Response('Page not found', { status: 404 });
}
