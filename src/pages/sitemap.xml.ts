import { getCollection } from 'astro:content';

const SITE_URL = 'https://www.elsantransformer.com.ng';

export async function GET() {
  // 1. Get all static pages automatically
  const pageFiles = import.meta.glob('/src/pages/**/*.{astro,md,mdx}');
  const staticPaths = Object.keys(pageFiles)
    .filter((path) => {
      const fileName = path.split('/').pop() || '';
      // Exclude dynamic routes, 404, private files, and API endpoints
      return (
        !fileName.startsWith('[') &&
        !fileName.startsWith('_') &&
        !fileName.includes('404') &&
        !fileName.includes('sitemap') &&
        !fileName.includes('robots')
      );
    })
    .map((path) => {
      // Remove /src/pages prefix and extension
      let route = path
        .replace('/src/pages', '')
        .replace(/\.(astro|md|mdx)$/, '');
      
      // Handle index routes
      if (route.endsWith('/index')) {
        route = route.replace('/index', '');
      }
      
      // Ensure trailing slash
      if (route === '') return '/';
      return `${route}/`;
    });

  // 2. Get dynamic region pages (from src/pages/[slug].astro)
  const regions = [
    'transformer-in-benin',
    'transformer-in-togo',
    'transformer-in-ghana',
    'transformer-in-uganda',
    'transformer-in-zimbabwe',
    'transformer-in-rwanda',
    'transformer-in-sierra-leone'
  ];

  // 3. Get blog posts
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  // Combine all URLs
  const allUrls = [
    // Static pages
    ...staticPaths.map((path) => ({
      loc: `${SITE_URL}${path}`,
      lastmod: new Date().toISOString(),
      priority: path === '/' ? 1.0 : 0.8,
    })),
    // Region pages
    ...regions.map((slug) => ({
      loc: `${SITE_URL}/${slug}/`,
      lastmod: new Date().toISOString(),
      priority: 0.9,
    })),
    // Blog posts
    ...posts.map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}/`,
      lastmod: (post.data.updatedDate || post.data.pubDate).toISOString(),
      priority: 0.7,
    })),
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
