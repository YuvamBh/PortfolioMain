// The one source of truth for the site and the AI chat. Edit facts here only.
// Facts match the resume (JobApply/docs/asu_ux) and the 19 Nov 2026 project review.

export type Link = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  context: string;          // org or role, one line
  year: string;
  summary: string;          // one sentence
  problem?: string;         // case-study framing on /projects
  points: string[];         // what I designed and built
  tags: string[];
  kind: ('Product design' | 'Web' | 'Mobile' | 'AI')[];
  image?: string;           // desktop screenshot in /public/work
  phone?: string;           // phone screenshot in /public/work
  links: Link[];
  featured?: boolean;
};

export const profile = {
  name: 'Yuvam Bhargav',
  title: 'Product and full-stack engineer, AI and machine learning',
  role: 'Product and Full Stack Engineer · AI and Machine Learning',
  roleWords: ['full-stack engineer', 'product engineer', 'full-stack engineer', 'ai & machine learning'],
  location: 'Tempe, Arizona',
  email: 'yuvambh@gmail.com',
  resume: '/resume/YuvamBhargav_Resume.pdf',
  links: {
    github: 'https://github.com/YuvamBh',
    linkedin: 'https://www.linkedin.com/in/yuvam-bh',
    x: 'https://x.com/yuvambh',
    calendly: 'https://calendly.com/ybharga2-asu/30min',
    source: 'https://github.com/YuvamBh/PortfolioMain',
  },
  // The hero's rotating line: real highlights, one at a time.
  highlights: [
    'I build products end to end: interface, backend and AI.',
    'Founding Mystré, where people shape fashion before it is made.',
    'Built the hackathon platform that 400+ ASU students used.',
    'Created and deployed the Claude Builders Club website.',
    'Shipped a parcel map for land developers at Automation Interns.',
    'Built Claude-based agents that run operations for a construction company.',
  ],
  statement:
    'I build products end to end, from the interface to the data and AI behind it. From a fashion app’s swipe feed to a hackathon platform that 400+ students used, I take ideas all the way to launch.',
  bio: [
    'I’m a Computer Science (AI) and Data Science student at Arizona State University, graduating in December 2027. I work across product design, full-stack engineering and applied AI, so I can take an idea from a sketch to a shipped product.',
    'Right now I’m founding Mystré, a fashion app where people react to designs before they are made. I also lead the Claude Builders Club at ASU, work as a forward deployed engineer at Automation Interns, and teach distributed systems as a TA.',
  ],
  focus: [
    'Product and full-stack engineering',
    'Applied AI and machine learning',
    'Interface and interaction design',
    'Design systems and motion',
    'Accessible, responsive websites',
  ],
  now: [
    'Founding Mystré, a demand-intelligence platform for fashion',
    'President, Claude Builders Club at ASU',
    'Forward deployed engineer, Automation Interns',
    'Undergraduate TA, distributed software systems',
  ],
  education: {
    school: 'Arizona State University',
    degree: 'B.S. Computer Science (Artificial Intelligence) and B.S. Data Science (Business Analytics)',
    dates: 'Expected December 2027',
    notes: ['GPA 3.9', 'Dean’s List 2024, 2025 and 2026'],
  },
  stats: [
    { value: 400, suffix: '+', label: 'participants on the hackathon platform I built' },
    { value: 400, prefix: '~', label: 'students I support as a teaching assistant' },
    { value: 9, suffix: '', label: 'live sites and apps I designed or built' },
  ],
  skills: [
    { group: 'UX and UI', items: ['Figma', 'Canva', 'User flows', 'Wireframes', 'Prototyping', 'Design systems', 'Motion design'] },
    { group: 'Accessibility', items: ['Responsive layouts', 'Semantic HTML', 'ARIA', 'Keyboard navigation', 'Reduced motion'] },
    { group: 'Front end', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Astro', 'React Native', 'Tailwind CSS', 'GSAP', 'Framer Motion'] },
    { group: 'Back end and tools', items: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'REST APIs', 'Git and GitHub', 'Vercel', 'GitHub Pages'] },
    { group: 'AI and machine learning', items: ['Python', 'TensorFlow', 'NLP', 'RAG', 'Embeddings and vector search', 'Claude API', 'OpenAI API', 'Agent workflows'] },
  ],
};

export const projects: Project[] = [
  {
    slug: 'mystre',
    title: 'Mystré',
    context: 'Founder, product designer and engineer',
    year: '2026',
    summary: 'A fashion app where people react to designs before they are made, and a portal that tells brands what to make.',
    problem: 'Brands manufacture blind and carry dead stock. People have nowhere to react to unreleased fashion without being sold to.',
    points: [
      'Designed and built, solo, an iOS/Android app and a web portal for brands, from first commit to a live site and an end-to-end demo.',
      'Designed a gesture-driven feed (swipe, double-tap, hold) with Reanimated motion and haptics, and a five-step onboarding.',
      'Built about 40 on-device design switches to compare variants of each element on a real phone before committing to one.',
      'Simplified brand setup into one-question-per-screen wizards, with results that wait for enough responses before giving a verdict.',
      'Established one visual system across app and web: colour, type, spacing and motion tokens, a 40-icon line set, wordmark and app icon.',
      'Designed scroll-driven web pages with GSAP and Lenis, light/dark themes, reduced-motion support and 30 email templates.',
    ],
    tags: ['Product design', 'React Native', 'Next.js', 'GSAP', 'Design system'],
    kind: ['Product design', 'Mobile', 'Web'],
    image: '/work/mystre-desktop.webp',
    phone: '/work/mystre-mobile.webp',
    links: [{ label: 'mystre.app', href: 'https://www.mystre.app' }],
    featured: true,
  },
  {
    slug: 'hackathon',
    title: 'Hackathon platform',
    context: 'Claude Builders Club at ASU',
    year: '2026',
    summary: 'A hackathon application system and event platform that 400+ participants used from application to results.',
    problem: 'The club ran its hackathon across forms, spreadsheets and a third-party submission site. Officers needed one place to run the whole event.',
    points: [
      'Architected the platform end to end: ASU-only sign-in, a four-step application with saved drafts, and officer review to accept or reject.',
      'Designed team formation by invite code, live announcements and notifications.',
      'Designed event-day check-in by login and location, or by officer QR scan.',
      'Moved project submission, judging with per-criterion scores and per-track rankings onto the platform, replacing the third-party tools; results were announced there.',
    ],
    tags: ['Next.js', 'Supabase', 'Framer Motion', 'QR check-in'],
    kind: ['Product design', 'Web'],
    image: '/work/hackathon-desktop.webp',
    phone: '/work/hackathon-mobile.webp',
    links: [
      { label: 'GitHub', href: 'https://github.com/YuvamBh/claude-club-website-myVersion' },
      { label: 'Platform', href: 'https://claude-club-website-my-version.vercel.app/hackathon2.0' },
    ],
    featured: true,
  },
  {
    slug: 'claude-club',
    title: 'Claude Builders Club website',
    context: 'President and Claude Ambassador',
    year: '2026',
    summary: 'The club’s website, created and deployed end to end, with scroll-driven and shader-based motion.',
    points: [
      'Created and deployed the club’s entire website, merging work through GitHub pull requests with the club’s developers.',
      'Redesigned the home, about and team pages with GSAP ScrollTrigger text reveals, a Three.js hero and a touch-driven parallax gallery.',
      'Designed the three-step officer application with step validation, progress and animated transitions.',
    ],
    tags: ['Next.js', 'GSAP', 'Three.js', 'Tailwind CSS'],
    kind: ['Web'],
    image: '/work/cbc-desktop.webp',
    phone: '/work/cbc-mobile.webp',
    links: [
      { label: 'claudebuilder.club', href: 'https://claudebuilder.club' },
      { label: 'GitHub', href: 'https://github.com/YuvamBh/claude-club-website-myVersion' },
    ],
    featured: true,
  },
  {
    slug: 'landscout',
    title: 'LandScout',
    context: 'Automation Interns, forward deployed engineer',
    year: '2026',
    summary: 'A map tool that puts 39+ public data sources on 800K+ Seattle-area parcels in one place for land developers.',
    problem: 'Land developers were piecing parcel facts together from a dozen county websites before they could judge a single lot.',
    points: [
      'Partnered directly with the client, from data-source research to launch on Vercel.',
      'Designed parcel search with filters, a basemap switcher and detail panels for assessor, zoning, permit, sales and tax records.',
      'Added saved parcel collections, CSV export and invite-only sign-in, on 21 Next.js API routes with sub-second spatial queries.',
    ],
    tags: ['Next.js', 'MapLibre GL', 'Supabase', 'Client work'],
    kind: ['Product design', 'Web'],
    image: '/work/landscout-desktop.webp',
    links: [{ label: 'Live (invite only)', href: 'https://landscout-8yi5.vercel.app' }],
    featured: true,
  },
  {
    slug: 'devlabs',
    title: 'DevLabs',
    context: 'Vice President, Industry Relations',
    year: '2025',
    summary: 'Co-built devlabs.club and its builder portal, where student engineers show proof of work to early-stage founders.',
    points: [
      'Co-developed the Astro site and its builder portal with the DevLabs team.',
      'Led DevHacks ’25 for 250+ participants and secured $12,000+ in sponsorships.',
    ],
    tags: ['Astro', 'Portal', 'Community'],
    kind: ['Web'],
    image: '/work/devlabs-desktop.webp',
    phone: '/work/devlabs-mobile.webp',
    links: [
      { label: 'devlabs.club', href: 'https://www.devlabs.club' },
      { label: 'GitHub', href: 'https://github.com/Devlabs-club/website' },
    ],
    featured: false,
  },
  {
    slug: 'meetone',
    title: 'MeetOne',
    context: 'Built for the Claude Builders Club',
    year: '2026',
    summary: 'A booking and video-call tool for meetings with club leadership, with its own design system.',
    points: [
      'Designed a three-step booking wizard with live slot availability and server-side double-booking protection.',
      'Built the approval flow: an admin dashboard that approves or declines, then creates a LiveKit video room and emails the visitor.',
      'Created a live status page with a countdown, so visitors always know where their request stands.',
    ],
    tags: ['Next.js', 'Supabase', 'LiveKit', 'Custom CSS'],
    kind: ['Product design', 'Web'],
    image: '/work/meetone-desktop.webp',
    phone: '/work/meetone-mobile.webp',
    links: [
      { label: 'Live', href: 'https://meet-one-eight.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/YuvamBh/MeetOne' },
    ],
    featured: true,
  },
  {
    slug: 'career-services',
    title: 'ASU Career Services website',
    context: 'Career Peer, web and UX',
    year: '2025',
    summary: 'Built and maintained the Career Services website with ASU staff.',
    points: [
      'Built and maintained the department’s web pages alongside the ASU Career Services team.',
      'Advised 350+ students on portfolios and professional branding, and hosted 25+ career workshops.',
    ],
    tags: ['ASU', 'Content design', 'Web'],
    kind: ['Web'],
    image: '/work/career-desktop.webp',
    phone: '/work/career-mobile.webp',
    links: [{ label: 'career.asu.edu', href: 'https://career.asu.edu/cpt-opt-employers' }],
  },
  {
    slug: 'gcn',
    title: 'Global Career Network at ASU',
    context: 'Club website',
    year: '2025',
    summary: 'Co-built a 14-page site for international students: events, team, mentorship, resources and a feedback form.',
    points: [
      'Wrote the first version’s 13 page templates and stylesheet.',
      'Published the static rebuild on GitHub Pages with a teammate, with responsive layouts and a keyboard-closable mobile menu.',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    kind: ['Web'],
    image: '/work/gcn-desktop.webp',
    phone: '/work/gcn-mobile.webp',
    links: [
      { label: 'gcn-asu.com', href: 'https://gcn-asu.com' },
      { label: 'GitHub', href: 'https://github.com/YuvamBh/GCN_WebsiteMain' },
    ],
  },
  {
    slug: 'asu-ai',
    title: 'ASU.ai',
    context: 'AI academic planning',
    year: '2024',
    summary: 'An AI tool that personalizes academic planning for students, adopted by ASU Enterprise Technology.',
    points: [
      'Engineered an AI tool that personalizes academic planning for students with Python, the OpenAI API and PostgreSQL.',
      'Adopted by ASU Enterprise Technology as one of its initiatives.',
    ],
    tags: ['Python', 'OpenAI API', 'PostgreSQL'],
    kind: ['AI'],
    links: [],
  },
  {
    slug: 'duvi',
    title: 'duvi',
    context: 'Personal AI assistant for macOS',
    year: '2026',
    summary: 'An assistant that answers texts and email in its owner’s voice, designed around trust and consent.',
    points: [
      'Designed the trust model: per-contact rules, and an approval code before anything leaves the machine.',
      'Replaced per-message alerts with one summary per conversation once it goes quiet.',
      'Built a 10-tab local console with light/dark themes, ARIA labels and keyboard support.',
    ],
    tags: ['Trust design', 'TypeScript', 'Claude'],
    kind: ['AI', 'Product design'],
    links: [{ label: 'About duvi', href: '/duvi' }],
  },
  {
    slug: 'alert-saas',
    title: 'Alert SaaS',
    context: 'Competitor monitoring',
    year: '2026',
    summary: 'Watches competitors’ websites and alerts on change, with before/after screenshots.',
    points: [
      'Designed the full journey: landing page, sign-up, three-step onboarding, product tour, watchlist, alert dashboard and a before/after change viewer.',
      'Moved scans to a queue of Playwright workers, so the app answers in under 100 ms instead of 90 s.',
    ],
    tags: ['Next.js', 'Tailwind CSS', 'Playwright'],
    kind: ['Product design', 'Web'],
    image: '/work/alert-desktop.webp',
    phone: '/work/alert-mobile.webp',
    links: [
      { label: 'Live', href: 'https://alert-saas.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/YuvamBh/alert-saas' },
    ],
  },
];

export type Logo = { src: string; mask?: boolean } | { monogram: string };

export const experience: {
  org: string; role: string; dates: string; place: string; points: string[];
  logo: Logo; image?: string; site?: Link;
}[] = [
  {
    org: 'Mystré', role: 'Founder, Product Designer and Engineer', dates: 'Jan 2026 – Present', place: 'Tempe, AZ',
    points: [
      'Designed and built an iOS/Android app and a brand portal on my own.',
      'Set up one visual system across app and web, and 30 email templates.',
    ],
    logo: { src: '/logos/mystre.svg', mask: true }, image: '/work/mystre-desktop.webp', site: { label: 'mystre.app', href: 'https://www.mystre.app' },
  },
  {
    org: 'Automation Interns', role: 'Forward Deployed Engineer', dates: 'Jun 2026 – Present', place: 'Tempe, AZ',
    points: [
      'Delivered LandScout, a map tool uniting 39+ public data sources on 800K+ parcels.',
      'Worked directly with the client from research to launch.',
    ],
    logo: { src: '/logos/automationinterns.webp' }, image: '/work/company/automationinterns.webp', site: { label: 'automationinterns.com', href: 'https://www.automationinterns.com' },
  },
  {
    org: 'School of Computing and Augmented Intelligence, ASU', role: 'Undergraduate Teaching Assistant', dates: 'Dec 2025 – Present', place: 'Tempe, AZ',
    points: [
      'Teach distributed software systems in weekly lectures and office hours.',
      'Review code and system design for about 400 students.',
    ],
    logo: { src: '/logos/asu.webp' }, image: '/work/company/scai.webp', site: { label: 'scai.engineering.asu.edu', href: 'https://scai.engineering.asu.edu' },
  },
  {
    org: 'ASU Career Services', role: 'Career Peer, Web and UX', dates: 'Aug 2025 – Dec 2025', place: 'Tempe, AZ',
    points: [
      'Built and maintained the department’s website with ASU staff.',
      'Advised 350+ students on portfolios; hosted 25+ career workshops.',
    ],
    logo: { src: '/logos/asu.webp' }, image: '/work/career-desktop.webp', site: { label: 'career.asu.edu', href: 'https://career.asu.edu/cpt-opt-employers' },
  },
  {
    org: 'Torc Constructions', role: 'AI Engineer', dates: 'Mar 2026 – May 2026', place: 'Tempe, AZ',
    points: [
      'Built a multi-agent operations assistant on the Claude API for a construction company.',
      'Designed it for a non-technical owner who uses it over iMessage and calls, and built its web dashboard.',
    ],
    logo: { monogram: 'TC' },
  },
  {
    org: 'Futurristic', role: 'AR/VR Development and Data Analyst Intern', dates: 'Jun 2024 – Aug 2024', place: 'Remote',
    points: [
      'Prototyped AR/VR experiences with A-Frame and AR.js using user-centred principles, lifting engagement by 35%.',
      'Strengthened data pipelines with quality checks, raising accuracy by 20%.',
    ],
    logo: { src: '/logos/futurristic.webp' }, image: '/work/company/futurristic.webp', site: { label: 'futurristic.com', href: 'https://futurristic.com' },
  },
  {
    org: 'ELDAAS', role: 'Data Analyst Intern', dates: 'Oct 2023 – Dec 2023', place: 'Raleigh, NC',
    points: [
      'Analysed AI-assisted circuit and PCB designs, contributing to a 5% performance improvement.',
      'Automated data flow with Python and PostgreSQL across 700+ responses.',
    ],
    logo: { src: '/logos/eldaas.webp' }, site: { label: 'eldaas.com', href: 'https://eldaas.com' },
  },
];

export const leadership = {
  current: [
    {
      org: 'Claude Builders Club at ASU', role: 'President and Claude Ambassador', dates: 'Mar 2026 – Present',
      detail: 'Lead the club, created its website, and built the hackathon platform that ran HackASU for 400+ participants.',
      link: { label: 'claudebuilder.club', href: 'https://claudebuilder.club' },
    },
    {
      org: 'DevLabs at ASU', role: 'Vice President, Industry Relations', dates: 'Jan 2025 – Present',
      detail: 'Co-built devlabs.club and its builder portal; led DevHacks ’25 and secured $12,000+ in sponsorships.',
      link: { label: 'devlabs.club', href: 'https://www.devlabs.club' },
    },
  ],
  past: [
    {
      org: 'Global Career Network at ASU', role: 'Director of Finance', dates: '2025',
      detail: 'Co-built the club’s website and ran events for 200+ international students.',
      link: { label: 'gcn-asu.com', href: 'https://gcn-asu.com' },
    },
    {
      org: 'Indian Students’ Association', role: 'Director of Finance', dates: 'Past',
      detail: 'Managed event budgets over $15,000 and sponsorships for a community of 4,000+ students.',
    },
  ],
  events: [
    {
      title: 'HackASU 2026', org: 'Claude Builders Club', date: 'March 2026',
      detail: 'Ran on the platform I built: applications, teams, check-in, submissions, judging and results for 400+ participants.',
    },
    {
      title: 'DevHacks ’25', org: 'DevLabs × Strategy', date: 'March 29–30, 2025',
      detail: 'Lead organiser: 250+ participants, 10 mentors and $12,000+ in sponsorships.',
      video: '/media/devhacks.mp4', poster: '/media/devhacks.webp',
    },
  ],
};

export const certifications: { title: string; issuer: string; logo: Logo }[] = [
  { title: 'Data Science Professional Certificate', issuer: 'IBM', logo: { src: '/logos/ibm.webp' } },
  { title: 'Introduction to Generative AI', issuer: 'Google Cloud', logo: { src: '/logos/google.webp' } },
  { title: 'Claude Code 101 and other courses', issuer: 'Anthropic Academy', logo: { src: '/logos/anthropic.svg', mask: true } },
];

export const honors: { title: string; detail: string; where: string; logo?: Logo; icon?: string }[] = [
  { title: 'Dean’s List', detail: '2024, 2025 and 2026', where: 'Arizona State University', logo: { src: '/logos/asu.webp' } },
  { title: 'IBM Z Student Ambassador', detail: '', where: 'IBM', logo: { src: '/logos/ibm.webp' } },
  { title: '3x hackathon winner', detail: 'Recognition at HackPrinceton and HackMIT', where: 'Hackathons', icon: 'trophy' },
  { title: '5x hackathon host and judge', detail: 'Student hackathons', where: 'ASU', icon: 'mic' },
];

// Kept for the chat's context.
export const accomplishments = [
  ...certifications.map((c) => ({ title: `${c.issuer}: ${c.title}`, kind: 'Certification' })),
  ...honors.map((h) => ({ title: `${h.title} (${h.detail})`, kind: 'Honor' })),
];
