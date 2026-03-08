export const SITE = {
  name: 'Elsan Transformers',
  title: 'Elsan Transformers | Engineered for the Grid',
  description: 'Premier manufacturer of high-voltage distribution transformers, power transformers, and critical grid infrastructure.',
  url: (typeof process !== 'undefined' && process.env.SITE_URL) || 'https://fluxcore.systems',
  twitterHandle: '@fluxcoresys',
  socials: {
    twitter: 'https://twitter.com/fluxcoresys',
    linkedin: 'https://www.linkedin.com/company/fluxcore-systems',
  },
  image: {
    src: '/favicon.svg',
    alt: 'FluxCore Systems logo',
  },
} as const;

export type SiteConfig = typeof SITE;
