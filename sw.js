/*!
 * sw.js - site-wide injector (service worker).
 * Registered once from index.html. After that it automatically adds
 * /system-font.js to EVERY html page on this site, including pages made in future.
 * No other page needs to be edited.
 */
const TAG = '<script src="/system-font.js"></script>';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.mode !== 'navigate') return;           // only page loads
  event.respondWith((async () => {
    const res = await fetch(req);
    const type = res.headers.get('content-type') || '';
    if (!type.includes('text/html')) return res;
    let html = await res.text();
    if (html.includes('system-font.js')) return new Response(html, res);
    html = /<head[^>]*>/i.test(html)
      ? html.replace(/<head[^>]*>/i, m => m + TAG)
      : TAG + html;
    const headers = new Headers(res.headers);
    headers.delete('content-length');
    return new Response(html, { status: res.status, statusText: res.statusText, headers });
  })());
});
