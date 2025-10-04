// Ultimate Interactive Portfolio JavaScript
class PortfolioApp {
  constructor() {
    this.particles = [];
    this.particleCount = 0;
    this.animationCount = 0;
    this.easterEggCount = 0;
    this.particleAnimationId = null;
    this.lastParticleTime = Date.now();
    
    // Project data
    this.projects = {
      'portfolio': {
        title: 'Personal Portfolio Website',
        description: 'Built a responsive and visually engaging personal portfolio to showcase my work and skills. Features custom animated background particles, smooth section transitions, interactive project modals, and adaptive navigation for mobile and desktop. Focused on clean design, accessibility, and performance.',
        technologies: ['JavaScript', 'HTML5', 'CSS3'],
        features: [
          'Animated background particles',
          'Mobile-first responsive design',
          'Smooth transitions and section navigation',
          'Project modals with GitHub integration'
        ],
        github: 'https://github.com/gunnarwrld/PersonalPortfolio',
        image: 'assets/images/portfolioVertical.jpg',
        timeline: '2 months',
        role: 'Frontend Developer & Designer'
      },
      'financetracke': {
        title: 'FinanceTracke Web App',
        description: 'Developed a cross-platform personal finance management PWA using Vanilla JS, HTML, and CSS. Secured with Google OAuth authentication and integrated with a cloud Supabase/PostgreSQL database. Features real-time account balance updates, live currency conversion, visual analytics dashboard, multi-currency support, complete transaction and account CRUD, mobile-first design, and offline-first capabilities.',
        technologies: ['JavaScript', 'HTML5','CSS', 'Supabase', 'Google OAuth', 'PWA', 'PostgreSQL'],
        features: [
          'Multi-account & multi-currency',
          'Google-auth sign-in',
          'Live currency rates',
          'Real-time sync & offline support',
          'Comprehensive analytics dashboard'
        ],        
        github: 'https://github.com/gunnarwrld/personal-finance-web-app',
        image: 'assets/images/financeTrackeVertical.jpg',
        timeline: '4 months',
        role: 'Full Stack Developer'
      },
      'weather': {
        title: 'Weather Dashboard',
        description: 'Created an interactive weather dashboard using vanilla JavaScript and D3.js. Features include current weather conditions, 7-day forecasts, historical weather data analysis, interactive maps, weather alerts, location-based services, data visualization with charts and graphs, and offline functionality with service workers.',
        technologies: ['JavaScript', 'D3.js', 'Weather API', 'Chart.js'],
        features: ['Interactive maps', 'Data visualization', 'Weather alerts', 'Offline support'],
        github: 'https://github.com/gunnar/weather-dashboard',
        image: 'https://via.placeholder.com/600x400/ff7300/ffffff?text=Weather+Dashboard',
        timeline: '2 months',
        role: 'Frontend Developer'
      },
       'crypto': {
        title: 'Cryptocurrency Tracker',
        description: 'Built a comprehensive cryptocurrency tracking application with React and TypeScript. Features include real-time price tracking, advanced charting with TradingView integration, portfolio management, price alerts, market analysis tools, news aggregation, and social sentiment analysis. Implemented WebSocket connections for live data updates.',
        technologies: ['React', 'TypeScript', 'WebSocket', 'TradingView Charts'],
        features: ['Real-time tracking', 'Portfolio management', 'Price alerts', 'Market analysis'],
        github: 'https://github.com/gunnar/crypto-tracker',
        image: 'https://via.placeholder.com/600x400/ff7300/ffffff?text=Crypto+Tracker',
        timeline: '3 months',
        role: 'Frontend Developer'
      }, 
      'social': {
        title: 'Social Media Dashboard',
        description: 'Developed a comprehensive social media management platform using Next.js and GraphQL. Features include multi-platform posting, content scheduling, analytics dashboard, engagement tracking, team collaboration, content calendar, automated responses, and performance reporting. Integrated with major social platforms like Twitter, Instagram, and LinkedIn.',
        technologies: ['Next.js', 'GraphQL', 'Prisma', 'Tailwind CSS'],
        features: ['Multi-platform posting', 'Analytics', 'Team collaboration', 'Content calendar'],
        github: 'https://github.com/gunnar/social-dashboard',
        image: 'https://via.placeholder.com/600x400/ff7300/ffffff?text=Social+Dashboard',
        timeline: '5 months',
        role: 'Full Stack Developer'
      },
      'ai-chat': {
        title: 'AI Chat Application',
        description: 'Created an AI-powered chat application using Python and FastAPI. Features include real-time messaging with WebRTC, AI-powered responses using OpenAI API, voice chat capabilities, message history and search, file sharing, group chats, custom AI personalities, and end-to-end encryption. Implemented advanced NLP for context understanding.',
        technologies: ['Python', 'FastAPI', 'OpenAI API', 'WebRTC'],
        features: ['AI responses', 'Voice chat', 'File sharing', 'End-to-end encryption'],
        github: 'https://github.com/gunnar/ai-chat',
        image: 'https://via.placeholder.com/600x400/ff7300/ffffff?text=AI+Chat+App',
        timeline: '4 months',
        role: 'AI Developer'
      }, 
      'comingsoon': {
        title: 'Coming Soon...',
        description: 'An exciting new project is under development! Stay tuned for updates and new features.',
        technologies: ['Coming Soon'],
        features: ['More info coming soon'],
        github: '',
        image: 'https://via.placeholder.com/600x400/555555/ffffff?text=Coming+Soon...',
        timeline: 'In Progress',
        role: '—'
      }
    };

    this.init();
  }

  init() {
    this.initParticleSystem();
    this.initScrollAnimations();
    this.initNavigation();
    this.initTypingAnimation();
    this.initSkillBars();
    this.initProjectModals();
    this.initEasterEggs();
    this.initTooltips();
    this.initRippleEffects();
    this.initScrollToTop();
    this.updateCounters();
    
    // Add some initial particles and start continuous generation
    this.createParticles(30);
    this.startContinuousParticleGeneration();
  }

  // Particle System
  initParticleSystem() {
    this.particlesContainer = document.getElementById('particles-container');
    
    // Mouse trail particles
    let lastMouseParticleTime = 0;
    // Attach mousemove only to the particles container for better performance
    this.particlesContainer.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMouseParticleTime > 50) { // Throttle to every 50ms
        if (Math.random() < 0.05) {
          this.createParticle(e.clientX, e.clientY);
        }
        lastMouseParticleTime = now;
      }
    });

    // Start the main animation loop
    this.animateParticles();
  }

  startContinuousParticleGeneration() {
    // Create new particles periodically to maintain a steady flow
    setInterval(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (this.particles.length < 50) { // Keep particle count reasonable
        this.createParticle(
          Math.random() * width,
          Math.random() * height
        );
      }
    }, 500); // Create a new particle every 500ms

    // Also create particles at random intervals for variety
    setInterval(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (Math.random() < 0.3) {
        this.createParticle(
          Math.random() * width,
          Math.random() * height
        );
      }
    }, 200);
  }

  createParticles(count) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < count; i++) {
      this.createParticle(
        Math.random() * width,
        Math.random() * height
      );
    }
  }

  createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    const opacity = Math.random() * 0.8 + 0.2;
    particle.style.opacity = opacity;

    this.particlesContainer.appendChild(particle);

    const particleData = {
      element: particle,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      life: Date.now() + Math.random() * 5000 + 3000, // Live for 3-8 seconds
      opacity: opacity,
      fadeSpeed: Math.random() * 0.01 + 0.005
    };

    this.particles.push(particleData);
    this.particleCount++;
    this.updateCounters();
  }

  removeParticle(particleData) {
    const index = this.particles.indexOf(particleData);
    if (index > -1) {
      this.particles.splice(index, 1);
      if (particleData.element && particleData.element.parentNode) {
        particleData.element.parentNode.removeChild(particleData.element);
      }
    }
  }

  animateParticles() {
    const currentTime = Date.now();
    
    // Update each particle
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Check if particle should be removed
      if (currentTime > particle.life) {
        this.removeParticle(particle);
        continue;
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x <= 0 || particle.x >= window.innerWidth) {
        particle.vx *= -0.8; // Add some damping
        particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
      }
      if (particle.y <= 0 || particle.y >= window.innerHeight) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
      }
      
      // Fade out over time
      const timeLeft = particle.life - currentTime;
      if (timeLeft < 1000) { // Start fading in last second
        particle.opacity = Math.max(0, particle.opacity - particle.fadeSpeed);
      }
      
      // Apply changes to DOM element
      if (particle.element) {
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
        particle.element.style.opacity = particle.opacity;
      }
    }

    // Continue animation
    this.particleAnimationId = requestAnimationFrame(() => this.animateParticles());
  }

  // Scroll Animations
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          this.animationCount++;
          this.updateCounters();
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
      observer.observe(el);
    });
  }

  // Navigation
  initNavigation() {
    const nav = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll-based navbar styling
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      // Update active nav link
      this.updateActiveNavLink();
    });

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // Typing Animation
  initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    const texts = ['Software Developer', 'Full Stack Engineer', 'Problem Solver', 'Junior Data Scientist'];
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const typeText = () => {
      const currentText = texts[currentTextIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
          isDeleting = false;
          currentTextIndex = (currentTextIndex + 1) % texts.length;
          setTimeout(typeText, 500);
        } else {
          setTimeout(typeText, 50);
        }
      } else {
        typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentText.length) {
          isDeleting = true;
          setTimeout(typeText, 2000);
        } else {
          setTimeout(typeText, 100);
        }
      }
    };

    // Start typing animation after initial animation
    setTimeout(() => {
      typeText();
    }, 2000);
  }

  // Skill Bars Animation
  initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const percentage = entry.target.getAttribute('data-percentage');
          entry.target.style.transform = `scaleX(${percentage / 100})`;
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
  }

  // Project Modals
  initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    projectCards.forEach(card => {
      const viewBtn = card.querySelector('.view-project-btn');
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = card.getAttribute('data-project');
        this.openProjectModal(projectId);
      });
    });

    // Close modal events
    modalClose.addEventListener('click', () => this.closeProjectModal());
    modalBackdrop.addEventListener('click', () => this.closeProjectModal());
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        this.closeProjectModal();
      }
    });
  }

  openProjectModal(projectId) {
    const project = this.projects[projectId];
    const modal = document.getElementById('project-modal');
    
    // Populate modal content
    document.getElementById('modal-project-image').src = project.image;
    document.getElementById('modal-project-title').textContent = project.title;
    document.getElementById('modal-project-description').textContent = project.description;
    document.getElementById('modal-project-timeline').textContent = project.timeline;
    document.getElementById('modal-project-role').textContent = project.role;
    document.getElementById('modal-github-link').href = project.github;

    // Tech icons
    const techIconsContainer = document.getElementById('modal-tech-icons');
    techIconsContainer.innerHTML = '';
    project.technologies.forEach(tech => {
      const icon = document.createElement('span');
      icon.className = 'tech-icon';
      icon.textContent = this.getTechIcon(tech);
      icon.title = tech;
      techIconsContainer.appendChild(icon);
    });

    // Features list
    const featuresList = document.getElementById('modal-features-list');
    featuresList.innerHTML = '';
    project.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });

    modal.classList.remove('hidden');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('show');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 300);
  }

getTechIcon(tech) {
  const icons = {
    'HTML5': '🌐',
    'CSS': '🎨',
    'Tailwind CSS': '🖌️',
    'React': '⚛️',
    'Vue.js': '💚',
    'Node.js': '🟢',
    'JavaScript': '⚡',
    'TypeScript': '🔷',
    'Python': '🐍',
    'MongoDB': '🍃',
    'PostgreSQL': '🐘',
    'Supabase': '🟩',
    'Express.js': '🚀',
    'FastAPI': '🚀',
    'Next.js': '▲',
    'GraphQL': '◉',
    'D3.js': '📉',
    'Chart.js': '📊',
    'Socket.io': '🔌',
    'WebSocket': '🔗',
    'Stripe API': '💳',
    'Redux': '🔄',
    'Prisma': '⟁',
    'Weather API': '🌤️',
    'OpenAI API': '🤖',
    'WebRTC': '📞',
    'TradingView Charts': '📈',
    'PWA': '📱',
    'Google OAuth': '🔐',
    'OAuth': '🔑',
    'Service Worker': '🛠️',
    'Manifest': '🗃️',
    'Vercel': '▲',
    'Netlify': '🦙',
    'Day.js': '🕒',
    'REST API': '🌐',
    'exchangerate.host': '💱',
    'Coming Soon': '🚧'
  };
  return icons[tech] || '❔';
}


  // Easter Eggs
  initEasterEggs() {
    document.addEventListener('keydown', (e) => {
      // Special key shortcuts
      if (e.code === 'KeyP' && e.ctrlKey) {
        e.preventDefault();
        this.togglePartyMode();
      }
      if (e.code === 'KeyR' && e.ctrlKey) {
        e.preventDefault();
        this.toggleRainbowMode();
      }
    });

    // Logo double-click for matrix effect
    const logo = document.getElementById('logo');
    logo.addEventListener('dblclick', () => {
      this.triggerMatrixEffect();
      this.easterEggCount++;
      this.updateCounters();
    });
  }

  triggerMatrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const drops = [];
    const fontSize = 10;
    const columns = canvas.width / fontSize;

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ff7300';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    
    setTimeout(() => {
      clearInterval(interval);
      canvas.classList.remove('active');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
  }

  togglePartyMode() {
    document.body.classList.toggle('party-mode');
  }

  toggleRainbowMode() {
    document.body.classList.toggle('rainbow-mode');
  }

  // Ripple Effects
  initRippleEffects() {
    const rippleButtons = document.querySelectorAll('.ripple-btn');

    rippleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ripple = btn.querySelector('.ripple');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        ripple.style.transform = 'scale(0)';
        ripple.style.opacity = '1';
        
        requestAnimationFrame(() => {
          ripple.style.transform = 'scale(4)';
          ripple.style.opacity = '0';
        });
      });
    });
  }

  // Scroll to Top
  initScrollToTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.createParticles(10); // Add some particles on scroll to top
    });
  }

  // Update counters for developer panel
  updateCounters() {
    const particleCountEl = document.getElementById('particle-count');
    const animationCountEl = document.getElementById('animation-count');
    const easterEggCountEl = document.getElementById('easter-egg-count');
    
    if (particleCountEl) particleCountEl.textContent = this.particles.length;
    if (animationCountEl) animationCountEl.textContent = this.animationCount;
    if (easterEggCountEl) easterEggCountEl.textContent = this.easterEggCount;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Add some extra interactive features
document.addEventListener('DOMContentLoaded', () => {
  // Logo pulse effect
  const logo = document.getElementById('logo');
  setInterval(() => {
    if (Math.random() < 0.1) {
      logo.classList.add('pulse');
      setTimeout(() => {
        logo.classList.remove('pulse');
      }, 600);
    }
  }, 5000);

  // Name highlight click effect
  const nameHighlight = document.querySelector('.name-highlight');
  if (nameHighlight) {
    nameHighlight.addEventListener('click', () => {
      const colors = ['#ff7300', '#ff9500', '#ffb347', '#ff6b35', '#ff4500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      nameHighlight.style.color = randomColor;
      nameHighlight.style.textShadow = `0 0 30px ${randomColor}`;
      
      setTimeout(() => {
        nameHighlight.style.color = '#ff7300';
        nameHighlight.style.textShadow = '0 0 30px rgba(255, 115, 0, 0.5)';
      }, 1000);
    });
  }

  // Project card tilt effect
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Smooth reveal animations for text elements
  const textElements = document.querySelectorAll('h1, h2, h3, p');
  const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  textElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    textObserver.observe(el);
  });

  // Dynamic background gradient
  let gradientAngle = 0;
  const header = document.querySelector('body');
  if (header) {
    setInterval(() => {
      gradientAngle += 1;
      header.style.background = 
        `linear-gradient(${gradientAngle}deg, var(--color-slate-900) 0%, var(--color-charcoal-800) 100%)`;
    }, 500);
  }

  // Add keyboard shortcuts info
  console.log(`
    🎯 Easter Eggs & Shortcuts:
    - Double-click the logo
    - Ctrl+P: Party mode
    - Ctrl+R: Rainbow mode
  `);
});