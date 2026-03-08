export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Define hostnames to ignore (localhost, preview URLs, etc.)
  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isPreview = url.hostname.endsWith('.pages.dev');
  const isWWW = url.hostname.startsWith('www.');

  // If it's a production domain and not starting with www, redirect
  if (!isLocal && !isPreview && !isWWW) {
    url.hostname = `www.${url.hostname}`;
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}