// The one source of truth for the site and the AI chat. Edit facts here only.
// Facts match the resume (JobApply/docs/asu_ux) and the 19 Nov 2026 project review.

export type Link = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  short?: string;          // short name for the projects menu
  line?: string;           // one line for the projects grid
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
  // The hero's rotating line: what I've built, one at a time (no client names).
  // Hero highlights. Tag: Shipped when the project is live (it has a live link in `projects`), Built otherwise.
  highlights: [
    { tag: 'Shipped', text: 'Mystré: a fashion app where people react to designs before they’re made.' },
    { tag: 'Shipped', text: 'A full hackathon management system, from applications to results.' },
    { tag: 'Built', text: 'Multi-agent AI operations: CEO, CFO and procurement agents.' },
    { tag: 'Shipped', text: 'A geospatial parcel platform built on 39+ public data sources.' },
    { tag: 'Built', text: 'A personal AI assistant that keeps your data on your own machine.' },
  ] as { tag: 'Shipped' | 'Built'; text: string }[],
  statement:
    'I take products from idea to launch: framing the problem, designing the system, wiring in the AI and shipping an experience people want to use.',
  // Bio as text with linked words; hovering a link shows a preview of the page (About.astro).
  bio: [
    [
      'I build products: AI agents, full-stack platforms and mobile apps. Most of my time goes into ',
      { text: 'Mystré', href: 'https://www.mystre.app', preview: '/work/mystre-desktop.webp' },
      ', the startup I founded. It’s a fashion app where people react to designs before they’re made, so brands can see what to produce before they manufacture. I built the iOS and Android app, the brand portal and the website.',
    ],
    [
      'Alongside it, I work as a forward deployed engineer at Automation Interns, building data-heavy products with clients, and as a teaching assistant for distributed software systems at ASU. I also lead the Claude Builders Club, where I built the platform that runs our hackathon.',
    ],
  ] as (string | { text: string; href: string; preview: string })[][],
  focus: [
    'Applied AI and machine learning',
    'Agents and LLM systems',
    'Product development',
    'Full-stack engineering',
    'Mobile and web apps',
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
    degrees: [
      { name: 'Bachelor of Science', field: 'Computer Science', focus: 'Artificial Intelligence' },
      { name: 'Bachelor of Science', field: 'Data Science', focus: 'Business Analytics' },
    ],
    notes: ['GPA 3.9', 'Dean’s List 2024, 2025 and 2026'],
    seal: '/logos/asu-seal.webp',
  },
  // Toolkit: most relevant first. Icons are Simple Icons slugs in /public/tools. Every tool is used in a
  // project or repo, named on the resumes, or covered by a certificate (pandas, NumPy, scikit-learn and Jupyter:
  // IBM Data Science Professional).
  skills: [
    {
      group: 'AI and machine learning',
      tools: [
        { name: 'Python', icon: 'python' },
        { name: 'PyTorch', icon: 'pytorch' },
        { name: 'TensorFlow', icon: 'tensorflow' },
        { name: 'Hugging Face', icon: 'huggingface' },
        { name: 'scikit-learn', icon: 'scikitlearn' },
        { name: 'pandas', icon: 'pandas' },
        { name: 'NumPy', icon: 'numpy' },
        { name: 'Jupyter', icon: 'jupyter' },
        { name: 'OpenAI', icon: 'openai' },
        { name: 'Claude', icon: 'claude' },
        { name: 'MCP', icon: 'modelcontextprotocol' },
      ],
    },
    {
      group: 'Product and full stack',
      tools: [
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'Node.js', icon: 'nodedotjs' },
        { name: 'Bun', icon: 'bun' },
        { name: 'FastAPI', icon: 'fastapi' },
        { name: 'Flask', icon: 'flask' },
        { name: 'Pydantic', icon: 'pydantic' },
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'SQLAlchemy', icon: 'sqlalchemy' },
        { name: 'Supabase', icon: 'supabase' },
        { name: 'Redis', icon: 'redis' },
        { name: 'Stripe', icon: 'stripe' },
        { name: 'Resend', icon: 'resend' },
        { name: 'PostHog', icon: 'posthog' },
        { name: 'shadcn/ui', icon: 'shadcnui' },
        { name: 'Radix UI', icon: 'radixui' },
      ],
    },
    {
      group: 'Front end and mobile',
      tools: [
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextdotjs' },
        { name: 'Astro', icon: 'astro' },
        { name: 'React Native', icon: 'expo' },
        { name: 'Swift', icon: 'swift' },
        { name: 'JavaScript', icon: 'javascript' },
        { name: 'HTML', icon: 'html5' },
        { name: 'CSS', icon: 'css' },
        { name: 'Tailwind CSS', icon: 'tailwindcss' },
        { name: 'GSAP', icon: 'greensock' },
        { name: 'Framer Motion', icon: 'framer' },
        { name: 'Three.js', icon: 'threedotjs' },
        { name: 'MapLibre', icon: 'maplibre' },
      ],
    },
    {
      group: 'DevOps and workflow',
      tools: [
        { name: 'Git', icon: 'git' },
        { name: 'GitHub', icon: 'github' },
        { name: 'GitHub Actions', icon: 'githubactions' },
        { name: 'Docker', icon: 'docker' },
        { name: 'Vercel', icon: 'vercel' },
        { name: 'Turborepo', icon: 'turborepo' },
        { name: 'Playwright', icon: 'playwright' },
        { name: 'Pytest', icon: 'pytest' },
        { name: 'Jira', icon: 'jira' },
      ],
    },
  ],
};

export const projects: Project[] = [
  {
    slug: 'mystre',
    line: 'A fashion app where people react to designs before they’re made.',
    short: 'Mystré',
    title: 'Mystré',
    context: 'Founder',
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
    line: 'A full hackathon platform, from applications to results.',
    short: 'HackASU',
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
    line: 'The club’s website, created and deployed end to end.',
    short: 'Claude Club',
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
    line: 'A geospatial parcel platform built on 39+ public data sources.',
    short: 'LandScout',
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
    line: 'A builder portal where student engineers show proof of work.',
    short: 'DevLabs',
    title: 'DevLabs',
    context: 'Industry Relations',
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
    line: 'Booking and video calls with approvals and live status.',
    short: 'MeetOne',
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
    line: 'Career Services web pages, built with ASU staff.',
    short: 'Career Services',
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
    line: 'A 14-page site for an international student community.',
    short: 'GCN',
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
    line: 'AI-personalized academic planning, adopted by ASU Enterprise Technology.',
    short: 'ASU.ai',
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
    line: 'A personal AI assistant that keeps your data on your machine.',
    short: 'duvi',
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
    line: 'Competitor monitoring with before/after change alerts.',
    short: 'Alert SaaS',
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
  {
    slug: 'ai-ops',
    line: 'CEO, CFO and procurement agents that run day-to-day operations.',
    short: 'AI Ops',
    title: 'AI operations assistant',
    context: 'Client work',
    year: '2026',
    summary: 'A multi-agent operations assistant on the Claude API that a non-technical business owner works with over iMessage and calls.',
    points: [
      'Built CEO, CFO and procurement agents on the Claude API, with key decisions always returned to the owner.',
      'Shaped the assistant’s replies from the owner’s feedback and built a web dashboard with live job status and chat history.',
    ],
    tags: ['Claude API', 'Agents', 'Dashboard'],
    kind: ['AI'],
    links: [],
  },
  {
    slug: 'linklead',
    line: 'Self-hosted short links with click analytics and an AI assistant.',
    short: 'LinkLead',
    title: 'LinkLead',
    context: 'Link analytics',
    year: '2026',
    summary: 'Self-hosted short links with a click-analytics console and an assistant that answers questions about the data.',
    points: [
      'Built a short-link and click-analytics console with trend and breakdown charts and per-link pages (Next.js, Supabase, Upstash Redis).',
      'Kept redirects fast by logging clicks after the response, and added an OpenAI assistant for the analytics on screen.',
    ],
    tags: ['Next.js', 'Supabase', 'Redis', 'OpenAI'],
    kind: ['Web', 'AI'],
    links: [
      { label: 'Live', href: 'https://linklead-nine.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/YuvamBh/LinkLead' },
    ],
  },
  {
    slug: 'lifeloop',
    line: 'A SwiftUI habit and reflection app with a map of nearby places.',
    short: 'LifeLoop',
    title: 'LifeLoop',
    context: 'iOS app',
    year: '2026',
    summary: 'A SwiftUI app for habits, reflections with a mood score, and a map of nearby places to grow.',
    points: [
      'Built a four-tab SwiftUI app (SwiftData, MVVM) with empty states, inline validation and filters for goals, mood and progress.',
      'Added MapKit and Core Location with the Overpass API to show nearby parks, libraries and gyms by category.',
    ],
    tags: ['SwiftUI', 'SwiftData', 'MapKit'],
    kind: ['Mobile'],
    links: [{ label: 'GitHub', href: 'https://github.com/YuvamBh/LifeLoop' }],
  },
];

export type Logo = { src: string; mask?: boolean } | { monogram: string };
// A picture or a video shown above a leadership or event card.
export type Media = { image?: string; video?: string; poster?: string; alt: string };

// Categories for the projects grid on the home page: eight tiles around the featured project.
export const categories: { id: string; name: string; projects: string[] }[] = [
  // Each category opens on a different project, and none on Mystré (it has the centre tile).
  { id: 'ai', name: 'AI and machine learning', projects: ['ai-ops', 'duvi', 'asu-ai', 'linklead'] },
  { id: 'platforms', name: 'Full-stack platforms', projects: ['hackathon', 'meetone', 'alert-saas', 'landscout'] },
  { id: 'web', name: 'Web', projects: ['claude-club', 'devlabs', 'gcn', 'career-services'] },
  { id: 'mobile', name: 'Mobile', projects: ['lifeloop', 'mystre'] },
  { id: 'design', name: 'Product design', projects: ['meetone', 'alert-saas', 'hackathon', 'mystre'] },
  { id: 'data', name: 'Data and analytics', projects: ['alert-saas', 'landscout', 'linklead'] },
  { id: 'community', name: 'Community', projects: ['devlabs', 'gcn', 'claude-club', 'hackathon', 'meetone'] },
  { id: 'industry', name: 'Industry projects', projects: ['landscout', 'ai-ops', 'career-services'] },
];

export const experience: {
  org: string; role: string; dates: string; place: string; points: string[];
  logo: Logo; image?: string; site?: Link;
}[] = [
  {
    org: 'Mystré', role: 'Founder', dates: 'Jan 2026 – Present', place: 'Tempe, AZ',
    points: [
      'Founded a demand-intelligence platform for fashion: people react to unreleased designs, and brands learn what to make before they manufacture.',
      'Built the iOS and Android app (React Native, Expo) with a gesture-driven feed, the brand portal for running design tests and reading results, and the website (Next.js, Supabase).',
      'Lead product, engineering and brand outreach.',
    ],
    logo: { src: '/logos/mystre.svg', mask: true }, image: '/work/mystre-desktop.webp', site: { label: 'mystre.app', href: 'https://www.mystre.app' },
  },
  {
    org: 'Automation Interns', role: 'Forward Deployed Engineer', dates: 'Jun 2026 – Present', place: 'Tempe, AZ',
    points: [
      'Built LandScout, a geospatial parcel platform (Next.js, TypeScript, Supabase/Postgres, MapLibre GL) unifying 39+ public data sources across 800K+ parcels.',
      'Wrote a bulk ingestion job that pages King County ArcGIS REST data into a Postgres cache, and 21 API routes that proxy and cache GIS, geocoding and Street View requests.',
      'Shipped OTP sign-in with access requests, saved parcel collections and CSV export, working with the client from data-source research to production on Vercel.',
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
      link: { label: 'claudebuilder.club', href: 'https://claudebuilder.club' }, logo: { src: '/logos/cbc.webp' } as Logo,
      media: { image: '/work/cbc-desktop.webp', alt: 'Claude Builders Club website' } as Media,
    },
    {
      org: 'DevLabs at ASU', role: 'Industry Relations', dates: 'Jan 2025 – Present',
      detail: 'Co-built devlabs.club and its builder portal; led DevHacks ’25 and secured $12,000+ in sponsorships.',
      link: { label: 'devlabs.club', href: 'https://www.devlabs.club' }, logo: { src: '/logos/devlabs.webp' } as Logo,
      media: { image: '/work/devlabs-desktop.webp', alt: 'DevLabs website' } as Media,
    },
  ],
  past: [
    {
      org: 'Global Career Network at ASU', role: 'Director of Finance', dates: '2025',
      detail: 'Co-built the club’s website and ran events for 200+ international students.',
      link: { label: 'gcn-asu.com', href: 'https://gcn-asu.com' }, logo: { src: '/logos/gcn.webp' } as Logo,
      media: { image: '/work/gcn-desktop.webp', alt: 'Global Career Network website' } as Media,
    },
    {
      org: 'Indian Students’ Association', role: 'Director of Finance', dates: 'Past',
      detail: 'Managed event budgets over $15,000 and sponsorships for a community of 4,000+ students.', logo: { monogram: 'ISA' } as Logo,
      media: undefined as Media | undefined,
    },
  ],
  events: [
    {
      title: 'HackASU 2026', org: 'Claude Builders Club', date: 'March 2026', logo: { src: '/logos/cbc.webp' } as Logo,
      media: { image: '/work/hackathon-desktop.webp', alt: 'HackASU platform' } as Media,
      detail: 'Ran on the platform I built: applications, teams, check-in, submissions, judging and results for 400+ participants.',
    },
    {
      title: 'DevHacks ’25', org: 'DevLabs × Strategy', date: 'March 29–30, 2025', logo: { src: '/logos/devlabs.webp' } as Logo,
      detail: 'Lead organiser: 250+ participants, 10 mentors and $12,000+ in sponsorships.',
      media: { video: '/media/devhacks.mp4', poster: '/media/devhacks.webp', alt: 'DevHacks ’25 highlight video' } as Media,
    },
  ],
};

export const certifications: { title: string; issuer: string; logo: Logo }[] = [
  { title: 'Data Science Professional Certificate', issuer: 'IBM', logo: { src: '/logos/ibm.svg', mask: true } },
  { title: 'Introduction to Generative AI', issuer: 'Google Cloud', logo: { src: '/logos/google.webp' } },
  { title: 'Claude Code 101 and other courses', issuer: 'Anthropic Academy', logo: { src: '/logos/anthropic.svg', mask: true } },
];

export const honors: { title: string; detail: string; where: string; logo?: Logo; icon?: string }[] = [
  { title: 'Dean’s List', detail: '2024, 2025 and 2026', where: 'Arizona State University', logo: { src: '/logos/asu-seal.webp' } },
  { title: 'IBM Z Student Ambassador', detail: '', where: 'IBM', logo: { src: '/logos/ibm.svg', mask: true } },
  { title: '3x hackathon winner', detail: 'Recognition at HackPrinceton and HackMIT', where: 'Hackathons', icon: 'trophy' },
  { title: '5x hackathon host and judge', detail: 'Student hackathons', where: 'ASU', icon: 'judge' },
];

// Kept for the chat's context.
export const accomplishments = [
  ...certifications.map((c) => ({ title: `${c.issuer}: ${c.title}`, kind: 'Certification' })),
  ...honors.map((h) => ({ title: `${h.title} (${h.detail})`, kind: 'Honor' })),
];
