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
        liveDemo: 'https://gunnarwrld.com/', 
        image: 'assets/images/portfolioVertical.jpg',
        timeline: '2 months',
        role: 'Frontend Developer & Designer'
      },
      'financetracker': {
        title: 'FinanceTracker Web App',
        description: 'Developed a cross-platform personal finance management PWA using Vanilla JS, HTML, and CSS. Secured with Google OAuth authentication and integrated with a cloud Supabase/PostgreSQL database. Features real-time account balance updates, live currency conversion, visual analytics dashboard, multi-currency support, complete transaction and account CRUD, mobile-first design, and offline-first capabilities.',
        technologies: ['TypeScript', 'React', 'HTML5','CSS', 'Supabase', 'Google OAuth', 'PWA', 'PostgreSQL'],
        features: [
          'Multi-account & multi-currency',
          'Google-auth sign-in',
          'Live currency rates',
          'Real-time sync & offline support',
          'Comprehensive analytics dashboard'
        ],        
        github: 'https://github.com/gunnarwrld/personal-finance-web-app',
        liveDemo: 'https://personal-finance-web-app-psi.vercel.app/',
        image: 'assets/images/financeTrackeVertical.jpg',
        timeline: '4 months',
        role: 'Full Stack Developer'
      },
      'posthub': {
        title: 'PostHub - Dynamic Blog Application',
        description: 'PostHub is a fully functional web application that demonstrates modern web development practices using pure HTML5, CSS3, and vanilla JavaScript. The application integrates with the DummyJSON API to provide a dynamic content experience, allowing users to browse posts, explore detailed user profiles through an elegant modal system, read comments, and submit contact forms. Built with performance in mind, it implements data caching to minimize API calls, lazy loading for optimal page speed, and comprehensive error handling for a robust user experience. The project showcases clean code architecture, semantic HTML structure, and mobile-first responsive design principles.',
        technologies: ['HTML5', 'CSS', 'REST API', 'JavaScript'],
        features: ['Dynamic Content Loading', 'Smart Catching System', 'Interactive Modal System','DOM Manipulation', 'Lazy Loading', 'Responsive Design', 'Error Handling', 'Hash-Based Navigation'],
        github: 'https://github.com/gunnarwrld/DynamicWebsite',
        liveDemo: 'https://posthub-dynamic-website.vercel.app/',
        image: 'assets/images/posthub_y.png',
        timeline: '4 weeks',
        role: 'Frontend Developer'
      }, 
      'aistudentassistant': {
        title: '🎓 AI-Powered Study Assistant',
        description: 'Built entirely on Cloudflare edge infrastructure, this application provides real-time, context-aware responses to student questions while maintaining conversation history across sessions. Students can ask questions about any subject, receive clear explanations, search through past conversations, and build upon previous learning—all through an intuitive chat interface accessible from anywhere in the world with ultra-low latency.',
        technologies: ['WebSocket', 'WorkersAI API', 'REST API', 'Node.js', 'JavaScript', 'HTML5', 'CSS'],
        features: ['Intelligent AI Conversations', 'Real-time Communication', 'Persistent Memory', 'Advanced Search', 'Responsive UI', 'Global Edge Deployment'],
        github: 'https://github.com/gunnarwrld/cf_ai_study_assistant',
        liveDemo: '',
        image: '',
        timeline: '5 weeks',
        role: 'Full-Stack Developer & Solutions Architect'
      },
      'comingsoon': {
        title: 'Coming Soon...',
        description: 'An exciting new project is under development! Stay tuned for updates and new features.',
        technologies: ['Coming Soon'],
        features: ['More info coming soon'],
        github: '',
        liveDemo: '',
        image: 'assets/images/comingSoonVertical.png',
        timeline: 'In Progress',
        role: '—'
      },
      'comingsoon': {
        title: 'Coming Soon...',
        description: 'An exciting new project is under development! Stay tuned for updates and new features.',
        technologies: ['Coming Soon'],
        features: ['More info coming soon'],
        github: '',
        image: 'assets/images/comingSoonVertical.png',
        timeline: 'In Progress',
        role: '—'
      },
      'comingsoon': {
        title: 'Coming Soon...',
        description: 'An exciting new project is under development! Stay tuned for updates and new features.',
        technologies: ['Coming Soon'],
        features: ['More info coming soon'],
        github: '',
        image: 'assets/images/comingSoonVertical.png',
        timeline: 'In Progress',
        role: '—'
      },
      // 'weather': {
      //   title: 'Weather Dashboard',
      //   description: 'Created an interactive weather dashboard using vanilla JavaScript and D3.js. Features include current weather conditions, 7-day forecasts, historical weather data analysis, interactive maps, weather alerts, location-based services, data visualization with charts and graphs, and offline functionality with service workers.',
      //   technologies: ['JavaScript', 'D3.js', 'Weather API', 'Chart.js'],
      //   features: ['Interactive maps', 'Data visualization', 'Weather alerts', 'Offline support'],
      //   github: 'https://github.com/gunnar/weather-dashboard',
      //   image: 'https://via.placeholder.com/600x400/ff7300/ffffff?text=Weather+Dashboard',
      //   timeline: '2 months',
      //   role: 'Frontend Developer'
      // },
      //  'crypto': {
      //   title: 'Cryptocurrency Tracker',
      //   description: 'Built a comprehensive cryptocurrency tracking application with React and TypeScript. Features include real-time price tracking, advanced charting with TradingView integration, portfolio management, price alerts, market analysis tools, news aggregation, and social sentiment analysis. Implemented WebSocket connections for live data updates.',
      //   technologies: ['React', 'TypeScript', 'WebSocket', 'TradingView Charts'],
      //   features: ['Real-time tracking', 'Portfolio management', 'Price alerts', 'Market analysis'],
      //   github: 'https://github.com/gunnar/crypto-tracker',
      //   image: 'https://via.placeholder.com/600x400/ff7300/ffffff?text=Crypto+Tracker',
      //   timeline: '3 months',
      //   role: 'Frontend Developer'
      // }, 
      // 'social': {
      //   title: 'Social Media Dashboard',
      //   description: 'Developed a comprehensive social media management platform using Next.js and GraphQL. Features include multi-platform posting, content scheduling, analytics dashboard, engagement tracking, team collaboration, content calendar, automated responses, and performance reporting. Integrated with major social platforms like Twitter, Instagram, and LinkedIn.',
      //   technologies: ['Next.js', 'GraphQL', 'Prisma', 'Tailwind CSS'],
      //   features: ['Multi-platform posting', 'Analytics', 'Team collaboration', 'Content calendar'],
      //   github: 'https://github.com/gunnar/social-dashboard',
      //   image: 'https://via.placeholder.com/600x400/ff7300/ffffff?text=Social+Dashboard',
      //   timeline: '5 months',
      //   role: 'Full Stack Developer'
      // }
    };

    this.init();
  }

  init() {
    this.initLoadingScreen();
    this.initParticleSystem();
    this.initScrollAnimations();
    this.initNavigation();
    this.initTypingAnimation();
    this.initStatsCounter();
    this.initSkillBars();
    this.autoPopulateSkills(); // Auto-add skills from projects
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

  // Loading Screen
  initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      
      loadingBar.style.width = progress + '%';
      loadingText.textContent = Math.floor(progress) + '%';
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add('fade-out');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }, 500);
      }
    }, 100);
  }

  // Particle System
  initParticleSystem() {
    this.particlesContainer = document.getElementById('particles-container');
    if (!this.particlesContainer) {
      console.error('Particles container not found!');
      return;
    }

    // Initialize particle array
    this.particles = [];
    
    // Create initial particles
    this.createInitialParticles();
    
    // Start animation loop
    this.animateParticles();
    
    // Add mouse trail effect
    this.addMouseTrail();
  }
  createInitialParticles() {
    const particleCount = Math.min(30, window.innerWidth / 50);
    for (let i = 0; i < particleCount; i++) {
      this.createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }
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
    
    // Random size between 2-6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.opacity = Math.random() * 0.8 + 0.2;
    
    this.particlesContainer.appendChild(particle);
    
    // Store particle data
    const particleData = {
      element: particle,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2, // velocity x
      vy: (Math.random() - 0.5) * 2, // velocity y
      life: Date.now() + Math.random() * 8000 + 5000, // 5-13 seconds
      opacity: parseFloat(particle.style.opacity),
      size: size
    };
    
    this.particles.push(particleData);
    return particleData;
  }

  removeParticle(index) {
    const particle = this.particles[index];
    if (particle && particle.element && particle.element.parentNode) {
      particle.element.parentNode.removeChild(particle.element);
    }
    this.particles.splice(index, 1);
  }

  animateParticles() {
    const currentTime = Date.now();
    
    // Update each particle
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Remove expired particles
      if (currentTime > particle.life) {
        this.removeParticle(i);
        continue;
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x <= 0 || particle.x >= window.innerWidth) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
      }
      
      if (particle.y <= 0 || particle.y >= window.innerHeight) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
      }
      
      // Fade out near end of life
      const timeLeft = particle.life - currentTime;
      if (timeLeft < 2000) {
        particle.opacity = (timeLeft / 2000) * particle.opacity;
      }
      
      // Apply changes to DOM
      particle.element.style.left = `${particle.x}px`;
      particle.element.style.top = `${particle.y}px`;
      particle.element.style.opacity = particle.opacity;
    }
    
    // Maintain particle count
    if (this.particles.length < 20) {
      this.createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }
    
    // Continue animation
    requestAnimationFrame(() => this.animateParticles());
  }
    addMouseTrail() {
    let lastTime = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime > 100 && Math.random() < 0.1) {
        this.createParticle(e.clientX, e.clientY);
        lastTime = now;
      }
    });
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

  // Stats Counter Animation
  initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (element) => {
      const target = parseInt(element.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString();
        }
      };
      
      updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
  }

  // Skill Tags Animation
  initSkillBars() {
    const skillGroups = document.querySelectorAll('.skill-group');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    skillGroups.forEach(group => observer.observe(group));
  }

  // Skill Tag Tooltips
  initTooltips() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
      const skillName = tag.textContent.trim();
      const projectsUsing = this.findProjectsUsingSkill(skillName);
      
      if (projectsUsing.length > 0) {
        // Create tooltip element
        const tooltip = document.createElement('span');
        tooltip.className = 'skill-tooltip';
        
        if (projectsUsing.length === 1) {
          tooltip.textContent = `Used in ${projectsUsing[0]}!`;
        } else if (projectsUsing.length === 2) {
          tooltip.textContent = `Used in ${projectsUsing[0]} and ${projectsUsing[1]}!`;
        } else if (projectsUsing.length === 3) {
          tooltip.textContent = `Used in ${projectsUsing[0]}, ${projectsUsing[1]}, and ${projectsUsing[2]}!`;
        } else {
          tooltip.textContent = `Used in a bunch of projects!`;
        }
        
        tag.appendChild(tooltip);
        tag.classList.add('has-tooltip');
      }
    });
  }

  // Find projects that use a specific skill
  findProjectsUsingSkill(skillName) {
    const projects = [];
    const skillLower = skillName.toLowerCase();
    
    // Skill mapping for variations
    const skillMap = {
      'javascript (es6)': ['javascript', 'js'],
      'html5 & css3': ['html5', 'html', 'css3', 'css'],
      'pwa': ['pwa', 'progressive web apps'],
      'mysql': ['mysql', 'sql'],
      'google oauth 2.0': ['google oauth', 'oauth'],
      'vercel ci/cd': ['vercel'],
      'cloudflare workers': ['cloudflare'],
      'durable objects': ['cloudflare'],
      'llm (llama 3.3)': ['llm', 'workersai api'],
      'websocket programming': ['websocket'],
      'currency apis': ['currency', 'exchange']
    };
    
    Object.values(this.projects).forEach(project => {
      if (project.technologies) {
        const techLower = project.technologies.map(t => t.toLowerCase());
        
        // Check direct match
        let matched = techLower.some(tech => 
          tech.includes(skillLower) || skillLower.includes(tech)
        );
        
        // Check mapping variations
        if (!matched && skillMap[skillLower]) {
          matched = skillMap[skillLower].some(variant => 
            techLower.some(tech => tech.includes(variant) || variant.includes(tech))
          );
        }
        
        if (matched && !projects.includes(project.title)) {
          projects.push(project.title);
        }
      }
    });
    
    return projects;
  }

  // Auto-populate skill tags from projects
  autoPopulateSkills() {
    // Category mapping for auto-categorization
    const categoryMap = {
      'Frontend': ['react', 'next.js', 'typescript', 'javascript', 'html5', 'html', 'css3', 'css', 'pwa', 'responsive design', 'ui/ux'],
      'Backend': ['node.js', 'serverless', 'restful api', 'rest api', 'websocket', 'express', 'python', 'java'],
      'Databases & APIs': ['supabase', 'mysql', 'sql', 'postgresql', 'mongodb', 'redis', 'currency', 'api'],
      'Cloud & DevOps': ['cloudflare', 'workers', 'durable objects', 'vercel', 'google oauth', 'oauth', 'azure', 'aws', 'git', 'github', 'ci/cd', 'bash', 'docker'],
      'AI & Machine Learning': ['llm', 'llama', 'workersai', 'ai', 'neural', 'prompt', 'machine learning'],
      'Specialized': ['distributed', 'edge', 'documentation', 'system design', 'sync', 'cross-device']
    };

    // Collect all unique technologies from projects
    const allTechs = new Set();
    Object.values(this.projects).forEach(project => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => {
          if (tech && tech !== 'Coming Soon') {
            allTechs.add(tech);
          }
        });
      }
    });

    // Add new technologies to appropriate skill groups
    const skillGroups = document.querySelectorAll('.skill-group');
    
    allTechs.forEach(tech => {
      const techLower = tech.toLowerCase();
      let categoryFound = false;

      // Find which category this tech belongs to
      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(keyword => techLower.includes(keyword) || keyword.includes(techLower))) {
          // Find the skill group with this category
          skillGroups.forEach(group => {
            const groupTitle = group.querySelector('.skill-group-title');
            if (groupTitle && groupTitle.textContent.trim() === category) {
              const tagsContainer = group.querySelector('.skill-tags');
              
              // Check if this skill already exists
              const existingTags = Array.from(tagsContainer.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.trim().toLowerCase());
              
              if (!existingTags.includes(techLower)) {
                // Create new skill tag
                const newTag = document.createElement('span');
                newTag.className = 'skill-tag';
                newTag.textContent = tech;
                tagsContainer.appendChild(newTag);
              }
              
              categoryFound = true;
            }
          });
          break;
        }
      }
    });
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

    // Handle GitHub button
    const githubLink = document.getElementById('modal-github-link');
    const statusContainer = document.getElementById('demo-status-container');
    
    if (project.github && project.github.trim() !== '') {
      // GitHub repo is available
      githubLink.href = project.github;
      githubLink.disabled = false;
      githubLink.style.pointerEvents = 'auto';
      githubLink.style.opacity = '1';
    } else {
      // GitHub repo not available
      githubLink.href = '#';
      githubLink.disabled = true;
      githubLink.style.pointerEvents = 'none';
      githubLink.style.opacity = '0.6';
    }

    // Handle Live Demo button
    const liveDemoLink = document.getElementById('modal-live-demo-link');
    
    if (project.liveDemo && project.liveDemo.trim() !== '') {
      // Live demo is available
      liveDemoLink.href = project.liveDemo;
      liveDemoLink.disabled = false;
      liveDemoLink.style.pointerEvents = 'auto';
      liveDemoLink.style.opacity = '1';
    } else {
      // Live demo not available
      liveDemoLink.href = '#';
      liveDemoLink.disabled = true;
      liveDemoLink.style.pointerEvents = 'none';
      liveDemoLink.style.opacity = '0.6';
    }

    // Show status message if either is not available
    if ((!project.liveDemo || project.liveDemo.trim() === '') || (!project.github || project.github.trim() === '')) {
      let messages = [];
      if (!project.liveDemo || project.liveDemo.trim() === '') messages.push('Live demo');
      if (!project.github || project.github.trim() === '') messages.push('GitHub repo');
      statusContainer.innerHTML = `<p class="demo-status-message">🚧 ${messages.join(' and ')} coming soon...</p>`;
    } else {
      statusContainer.innerHTML = '';
    }

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
    'WorkersAI API': '🤖',
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

  // Skeleton Screen Utilities
  showSkeleton(element) {
    element.classList.add('skeleton');
  }

  hideSkeleton(element) {
    element.classList.remove('skeleton');
  }

  // Example: Show skeleton for modal when opening
  showModalSkeleton() {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      this.showSkeleton(modalBody);
      // Simulate loading delay (remove in production or use actual async data)
      setTimeout(() => {
        this.hideSkeleton(modalBody);
      }, 500);
    }
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