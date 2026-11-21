// Selected work as a 3×3 grid (components/ui/dynamic-frame-layout). The centre frame is the featured project
// (Mystré): its screenshot only, enlarged while nothing else is hovered, and a link to the live site. The eight
// around it are categories: at rest a frame shows its category name and count; hovered or
// focused, it widens and shows that category's projects one at a time, with previous / next arrows inside the
// frame (and swipe on touch). Each project shows its screenshot behind, and in front its name, one line and
// plain GitHub / live icons.
import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DynamicFrameLayout, type Frame } from '@/components/ui/dynamic-frame-layout';

export type FrameProject = {
  slug: string;
  title: string;
  line: string;
  image?: string;
  live?: string;
  repo?: string;
};
export type FrameCategory = { id: string; name: string; projects: FrameProject[] };

// Outer ring, clockwise from the top-left; the centre (4,4) is the featured project.
const RING: { x: number; y: number }[] = [
  { x: 0, y: 0 }, { x: 4, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 4 },
  { x: 8, y: 8 }, { x: 4, y: 8 }, { x: 0, y: 8 }, { x: 0, y: 4 },
];

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

function ProjectFace({ p }: { p: FrameProject }) {
  return (
    <>
      {p.image ? (
        <img className="pf-img absolute inset-0 w-full h-full object-cover object-top" src={p.image} alt="" loading="lazy" decoding="async" />
      ) : (
        <div className="pf-empty absolute inset-0"><span className="pf-empty-mark" aria-hidden="true">{p.title}</span></div>
      )}
      <div className="pf-shade absolute inset-0" />
      <div className="pf-body absolute inset-x-0 bottom-0">
        <h3 className="pf-title">{p.title}</h3>
        <p className="pf-line">{p.line}</p>
        {(p.repo || p.live) && (
          <div className="pf-links">
            {p.repo && <a href={p.repo} target="_blank" rel="noopener" aria-label={`${p.title} on GitHub`} title="GitHub"><GitHubIcon /></a>}
            {p.live && <a href={p.live} target="_blank" rel="noopener" aria-label={`Open ${p.title} live`} title="Live site"><ArrowIcon /></a>}
          </div>
        )}
      </div>
    </>
  );
}

function FeaturedTile({ p, note }: { p: FrameProject; note?: string }) {
  const picture = p.image
    ? <img className="pf-img absolute inset-0 w-full h-full object-cover object-top" src={p.image} alt="" decoding="async" />
    : <div className="pf-empty absolute inset-0"><span className="pf-empty-mark" aria-hidden="true">{p.title}</span></div>;
  const href = p.live ?? p.repo;
  const host = href ? new URL(href).hostname.replace(/^www\./, '') : '';
  // A bar along the bottom edge, full width: what this is, and where it goes.
  const bar = (
    <div className="pf-feat-bar">
      <span className="pf-feat-tag">Featured</span>
      <span className="pf-feat-text"><b>{p.title}</b>{note && <>, {note}</>}</span>
      {href && <span className="pf-feat-go"><span className="pf-feat-host">{host}</span><ArrowIcon /></span>}
    </div>
  );
  return href ? (
    <a className="pf-tile pf-featured absolute inset-0 block" href={href} target="_blank" rel="noopener" aria-label={`Open ${p.title}${note ? `, ${note}` : ''}`}>
      {picture}
      {bar}
    </a>
  ) : (
    <div className="pf-tile pf-featured absolute inset-0">{picture}{bar}</div>
  );
}

function CategoryTile({ c }: { c: FrameCategory }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const n = c.projects.length;
  const go = (d: number) => { setDir(d); setI((k) => (k + d + n) % n); };
  const startX = useRef<number | null>(null);
  const p = c.projects[i];
  const cover = c.projects[0]?.image;
  return (
    <div
      className="pf-tile pf-cat absolute inset-0"
      onPointerDown={(e) => { if (e.pointerType !== 'mouse') startX.current = e.clientX; }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current; startX.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* At rest: the category name over a dimmed picture. */}
      <div className="pf-idle absolute inset-0">
        {cover ? <img className="pf-img absolute inset-0 w-full h-full object-cover object-top" src={cover} alt="" loading="lazy" decoding="async" /> : <div className="pf-empty absolute inset-0" />}
        <div className="pf-idle-shade absolute inset-0" />
        <div className="pf-idle-text absolute">
          <span className="pf-cat-count">{String(n).padStart(2, '0')} {n === 1 ? 'project' : 'projects'}</span>
          <h3 className="pf-cat-name">{c.name}</h3>
        </div>
      </div>

      {/* Hovered or focused: this category's projects, one at a time. */}
      <div className="pf-view absolute inset-0">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={p.slug}
            className="absolute inset-0"
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectFace p={p} />
          </motion.div>
        </AnimatePresence>
        <span className="pf-cat-tag absolute">{c.name}</span>
        {n > 1 && (
          <>
            <button type="button" className="pf-arrow pf-arrow-prev absolute" onClick={() => go(-1)} aria-label={`Previous ${c.name} project`}><Chevron dir="left" /></button>
            <button type="button" className="pf-arrow pf-arrow-next absolute" onClick={() => go(1)} aria-label={`Next ${c.name} project`}><Chevron dir="right" /></button>
            <div className="pf-dots absolute" aria-hidden="true">
              {c.projects.map((x, k) => <i key={x.slug} className={k === i ? 'on' : undefined} />)}
            </div>
            <span className="sr-only" aria-live="polite">{`${p.title}, ${i + 1} of ${n}`}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProjectFrames({ featured, featuredNote, categories }: { featured: FrameProject; featuredNote?: string; categories: FrameCategory[] }) {
  const frames: Frame[] = useMemo(() => {
    const ring = RING.slice(0, categories.length).map((pos, j) => ({
      id: j + 1, defaultPos: { ...pos, w: 4, h: 4 }, mediaSize: 1, isHovered: false,
      content: <CategoryTile c={categories[j]} />,
    }));
    const centre = { id: 99, defaultPos: { x: 4, y: 4, w: 4, h: 4 }, mediaSize: 1, isHovered: false, content: <FeaturedTile p={featured} note={featuredNote} /> };
    return [...ring, centre];
  }, [categories, featured, featuredNote]);

  return (
    <div className="pf">
      <div className="pf-grid-wrap">
        <DynamicFrameLayout frames={frames} className="pf-grid" frameClassName="pf-cell" hoverSize={6} gapSize={10} defaultHovered={{ row: 1, col: 1 }} />
      </div>
    </div>
  );
}
