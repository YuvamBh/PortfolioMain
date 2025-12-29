// Projects Showcase JavaScript

class ProjectsShowcase {
  constructor() {
    this.projects = [
      {
        title: "Fashion Discovery",
        description: "TikTok-style product swiper powered by embeddings + vector search with a RAG layer. Focus on fast recommendations, caching, and an eval harness.",
        tech: ["GenAI", "CLIP/embeddings", "Vector DB", "RAG", "FastAPI"],
        type: "AI/ML Project",
        links: { demo: null, github: null }
      },
      {
        title: "Deepfake Detector",
        description: "A web-app that can detect deepfakes with 90% accuracy. Just upload any image or video file and get results within seconds.",
        tech: ["Python", "OpenAI API", "TensorFlow", "Computer Vision"],
        type: "Featured Project",
        links: { demo: "#", github: "#" }
      },
      {
        title: "Global Career Network",
        description: "Community site migration from Flask to a static stack for speed and reliability. Clean content pipeline, analytics, and a lightweight CMS workflow.",
        tech: ["Static Site", "HTML/CSS/JS", "Analytics", "Netlify/Vercel"],
        type: "Web Development",
        links: { demo: "https://gcn-asu.com/", github: "https://github.com/YuvamBh/GCN_WebsiteMain.git" }
      },
      {
        title: "Service-Oriented Suite (WCF)",
        description: "SOAP/REST services (TempService, SortRef, etc.) with clean contracts and tests. Built for reliability, versioning, and easy client generation.",
        tech: ["WCF", "SOAP/REST", "C#", "Contracts", "Tooling"],
        type: "Backend System",
        links: { demo: null, github: null }
      },
      {
        title: "AI Workflow Microservices",
        description: "Containerized workers for async pipelines (Celery) with Redis/Postgres, MQTT events, and API gateway. Emphasis on observability and retries.",
        tech: ["Docker", "Celery", "Redis", "Postgres", "Observability"],
        type: "Microservices",
        links: { demo: null, github: null }
      },
      {
        title: "Checkout Automation",
        description: "Playwright flows for address autocomplete + cart checkout with resilient selectors, fallback keystrokes, and per-site strategies.",
        tech: ["Playwright", "Automation", "Resilient Selectors", "Testing"],
        type: "Automation Tool",
        links: { demo: null, github: null }
      }
    ];

    this.activeIndex = 0;
    this.autoPlayInterval = null;
    this.mouseX = 0;
    this.mouseY = 0;

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.render();
    this.startAutoPlay();
  }

  cacheElements() {
    this.wrapper = document.querySelector('.showcase-wrapper');
    this.numberBg = document.querySelector('.project-number-bg');
    this.typeEl = document.querySelector('.project-type-name');
    this.titleEl = document.querySelector('.project-title');
    this.descEl = document.querySelector('.project-description');
    this.techEl = document.querySelector('.project-tech');
    this.countEl = document.querySelector('.project-count');
    this.progressFill = document.querySelector('.showcase-progress-fill');
    this.prevBtn = document.querySelector('.showcase-nav-btn.prev');
    this.nextBtn = document.querySelector('.showcase-nav-btn.next');
  }

  bindEvents() {
    this.prevBtn.addEventListener('click', () => this.goPrev());
    this.nextBtn.addEventListener('click', () => this.goNext());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.goPrev();
      if (e.key === 'ArrowRight') this.goNext();
    });
  }

  goNext() {
    this.activeIndex = (this.activeIndex + 1) % this.projects.length;
    this.render();
    this.resetAutoPlay();
  }

  goPrev() {
    this.activeIndex = (this.activeIndex - 1 + this.projects.length) % this.projects.length;
    this.render();
    this.resetAutoPlay();
  }

  render() {
    const current = this.projects[this.activeIndex];
    
    // Update progress
    const progress = ((this.activeIndex + 1) / this.projects.length) * 100;
    document.documentElement.style.setProperty('--progress-pct', `${progress}%`);
    
    // Update background number with animation
    this.numberBg.classList.remove('entering');
    void this.numberBg.offsetWidth; // Trigger reflow
    this.numberBg.classList.add('entering');
    this.numberBg.textContent = String(this.activeIndex + 1).padStart(2, '0');
    
    // Update project type
    this.typeEl.parentElement.classList.remove('visible');
    setTimeout(() => {
      this.typeEl.textContent = current.type;
      this.typeEl.parentElement.classList.add('visible');
    }, 50);
    
    // Animate title with word reveal
    this.animateTitle(current.title);
    
    // Animate description with staggered words
    this.animateDescriptionWords(current.description);
    
    // Update tech stack
    this.animateTech(current.tech);
    
    // Update buttons
    this.updateButtons(current.links);
    
    // Update count
    this.countEl.textContent = `${this.activeIndex + 1} / ${this.projects.length}`;
    
    // Animate meta elements
    this.animateMeta();
  }

  updateButtons(links) {
    const buttonsContainer = document.querySelector('.project-buttons');
    const demoBtn = buttonsContainer.querySelector('.demo-link');
    const githubBtn = buttonsContainer.querySelector('.github-link');
    
    buttonsContainer.classList.remove('visible');
    
    setTimeout(() => {
      // Update demo button
      if (links.demo) {
        demoBtn.href = links.demo;
        demoBtn.classList.remove('disabled');
      } else {
        demoBtn.href = '#';
        demoBtn.classList.add('disabled');
      }
      
      // Update github button
      if (links.github) {
        githubBtn.href = links.github;
        githubBtn.classList.remove('disabled');
      } else {
        githubBtn.href = '#';
        githubBtn.classList.add('disabled');
      }
      
      buttonsContainer.classList.add('visible');
    }, 150);
  }

  animateTitle(title) {
    const words = title.split(' ');
    this.titleEl.innerHTML = '';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'project-title-word';
      span.textContent = word;
      this.titleEl.appendChild(span);
      
      setTimeout(() => {
        span.classList.add('visible');
      }, index * 50);
    });
  }

  animateDescriptionWords(description) {
    this.descEl.innerHTML = '';
    const words = description.split(' ');
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'desc-word';
      span.textContent = word; // Spaces handled by CSS margin
      this.descEl.appendChild(span);
      
      // Fast stagger effect
      setTimeout(() => {
        span.classList.add('visible');
      }, 100 + (index * 20)); // Start after 100ms, 20ms per word
    });
  }

  animateTech(techArray) {
    this.techEl.classList.remove('visible');
    setTimeout(() => {
      this.techEl.innerHTML = '';
      techArray.forEach(tech => {
        const span = document.createElement('span');
        span.textContent = tech;
        this.techEl.appendChild(span);
      });
      this.techEl.classList.add('visible');
    }, 150);
  }

  animateMeta() {
    const metaContainer = document.querySelector('.project-meta');
    const metaLine = document.querySelector('.project-meta-line');
    
    metaContainer.classList.remove('visible');
    metaLine.classList.remove('visible');
    
    setTimeout(() => {
      metaContainer.classList.add('visible');
      metaLine.classList.add('visible');
    }, 300);
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.goNext();
    }, 8000); // 12 seconds per slide (changed from 6000)
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProjectsShowcase();
});

// Content Protection - Disable right-click, selection, and copying
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());

// Add CSS to disable text selection
const style = document.createElement('style');
style.textContent = `
  * {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }
`;
document.head.appendChild(style);
