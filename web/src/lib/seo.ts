// Structured data (schema.org JSON-LD) for search engines and AI assistants, built from data/profile.ts so it
// never drifts from what the pages say. Base.astro prints whatever a page passes as `jsonLd`.
import { profile, projects, experience } from '../data/profile';
import type { Project } from '../data/profile';

export const SITE = 'https://yuvambhargav.com';
export const DESCRIPTION =
  'AI and full-stack engineer. Founder of Mystré, President of the Claude Builders Club at ASU, and forward deployed engineer at Automation Interns.';

const personId = `${SITE}/#person`;
const siteId = `${SITE}/#website`;

export const liveLink = (p: Project) =>
  p.links.find((l) => l.href.startsWith('http') && !l.href.includes('github.com'))?.href;
export const repoLink = (p: Project) => p.links.find((l) => l.href.includes('github.com'))?.href;

const person = () => ({
  '@type': 'Person',
  '@id': personId,
  name: profile.name,
  url: `${SITE}/`,
  image: `${SITE}/img/yuvam.webp`,
  email: `mailto:${profile.email}`,
  jobTitle: 'AI and full-stack engineer',
  description: DESCRIPTION,
  address: { '@type': 'PostalAddress', addressLocality: 'Tempe', addressRegion: 'AZ', addressCountry: 'US' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: profile.education.school, url: 'https://www.asu.edu' },
  worksFor: experience
    .filter((e) => e.dates.includes('Present') && e.site)
    .map((e) => ({ '@type': 'Organization', name: e.org, url: e.site?.href })),
  knowsAbout: [
    'Artificial intelligence', 'Machine learning', 'AI agents', 'Product engineering', 'Full-stack development',
    ...profile.skills.flatMap((g) => g.tools.map((t) => t.name)),
  ],
  sameAs: [profile.links.github, profile.links.linkedin, profile.links.x],
});

const website = () => ({
  '@type': 'WebSite',
  '@id': siteId,
  url: `${SITE}/`,
  name: profile.name,
  description: DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': personId },
});

const work = (p: Project) => ({
  '@type': 'CreativeWork',
  name: p.title,
  description: p.summary,
  url: liveLink(p) ?? repoLink(p) ?? `${SITE}/projects/`,
  ...(p.year ? { dateCreated: p.year } : {}),
  keywords: p.tags.join(', '),
  creator: { '@id': personId },
});

/** Home page: the person, the site, the profile page, and Mystré (founded by the person). */
export const homeLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    website(),
    person(),
    { '@type': 'ProfilePage', '@id': `${SITE}/#profile`, url: `${SITE}/`, name: `${profile.name}: portfolio`,
      isPartOf: { '@id': siteId }, mainEntity: { '@id': personId } },
    { '@type': 'Organization', name: 'Mystré', url: 'https://www.mystre.app', founder: { '@id': personId } },
  ],
});

/** Projects page: every project as a list. */
export const projectsLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    website(),
    person(),
    { '@type': 'CollectionPage', url: `${SITE}/projects/`, name: `Projects by ${profile.name}`,
      isPartOf: { '@id': siteId }, about: { '@id': personId },
      mainEntity: { '@type': 'ItemList', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: work(p) })) } },
  ],
});
