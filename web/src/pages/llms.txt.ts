// /llms.txt: a plain Markdown summary of the site for AI assistants (format: llmstxt.org). Built at deploy
// time from data/profile.ts, so it always matches the pages.
import type { APIRoute } from 'astro';
import { profile, projects, experience, certifications, honors } from '../data/profile';
import { SITE, DESCRIPTION, liveLink, repoLink } from '../lib/seo';

export const prerender = true;

const line = (s: string) => s.replace(/\s+/g, ' ').trim();

export const GET: APIRoute = () => {
  const out: string[] = [];
  out.push(`# ${profile.name}`, '');
  out.push(`> ${DESCRIPTION} Based in ${profile.location}. Open to AI and machine learning roles, and to product and full-stack engineering.`, '');
  out.push(
    `${profile.name} is studying ${profile.education.degree} at ${profile.education.school} (${profile.education.dates}; ${profile.education.notes.join(', ')}).`,
    '',
  );

  out.push('## Links', '');
  out.push(`- [Portfolio](${SITE}/): about, selected work, toolkit, experience, leadership and contact`);
  out.push(`- [All projects](${SITE}/projects/): every project with the problem, what was built, the tools and live links`);
  out.push(`- [Resume (PDF)](${SITE}${profile.resume})`);
  out.push(`- [GitHub](${profile.links.github})`);
  out.push(`- [LinkedIn](${profile.links.linkedin})`);
  out.push('');

  out.push('## Experience', '');
  for (const e of experience) {
    out.push(`- **${e.role}, ${e.org}** (${e.dates}, ${e.place}): ${line(e.points[0] ?? '')}`);
  }
  out.push('');

  out.push('## Projects', '');
  for (const p of projects) {
    const url = liveLink(p) ?? repoLink(p) ?? `${SITE}/projects/`;
    out.push(`- [${p.title}](${url}): ${line(p.summary)} (${p.tags.join(', ')})`);
  }
  out.push('');

  out.push('## Toolkit', '');
  for (const g of profile.skills) out.push(`- ${g.group}: ${g.tools.map((t) => t.name).join(', ')}`);
  out.push('');

  out.push('## Certifications and honors', '');
  for (const c of certifications) out.push(`- ${c.title} (${c.issuer})`);
  for (const h of honors) out.push(`- ${h.title}${h.where ? ` (${h.where})` : ''}${h.detail ? `: ${line(h.detail)}` : ''}`);
  out.push('');

  out.push('## Contact', '');
  out.push(`- Email: ${profile.email}`);
  out.push(`- Book a call: ${profile.links.calendly}`);
  out.push('');

  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
