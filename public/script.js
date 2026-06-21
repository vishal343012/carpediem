/**
 * CARPEDIEM SOLUTIONS - PREMIUM INTERACTIVE TECH CONSULTING SCRIPTS
 * ------------------------------------------------------------------
 * Handles:
 * - Canvas Particle (Neural Network) Background in Hero
 * - Sticky Nav & Active Nav Links Highlight on Scroll
 * - Mobile Menu Hamburger Overlay Transitions
 * - Interactive Mouse Hover Spotlight on Glass Cards
 * - Scroll Reveal via IntersectionObserver
 * - Animated Stats Counters (Count Up)
 * - Premium Client Testimonial Slider
 * - Contact Form Validation & Sweet Glass Success Alerts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons for DOM load-in
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set current year in footer copyright if element exists (safety check)
  const copyrightYearEl = document.querySelector('.copyright-text');
  if (copyrightYearEl) {
    const currentYear = new Date().getFullYear();
    copyrightYearEl.innerHTML = `&copy; ${currentYear} Carpediem Solutions Company. All Rights Reserved. Professional IT Consulting & Cloud Architecture Partners.`;
  }

  /* ==========================================================================
     STATION 1: STICKY HEADER & ACTIVE SECTION HIGHLIGHTING
     ========================================================================== */
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Toggle scrolled state on header
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Identify active section and highlight corresponding link
    let currentActive = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentActive = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     STATION 2: MOBILE HAMBURGER NAVIGATION
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileMenu() {
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ==========================================================================
     STATION 3: DYNAMIC GLASS CARDS SPOTLIGHT HOVER EFFECT
     ========================================================================== */
  const glassCards = document.querySelectorAll('.glass-card');
  
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });

  /* ==========================================================================
     STATION 4: HERO SECTION - ANIMATED CANVAS NEURAL PARTICLE NETWORK
     ========================================================================== */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let numberOfParticles = 75; // Balanced for maximum performance
    let mouse = {
      x: null,
      y: null,
      radius: 140
    };

    // Auto-adjust container sizes
    function setCanvasDimensions() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    setCanvasDimensions();
    window.addEventListener('resize', () => {
      setCanvasDimensions();
      initParticles();
    });

    // Track mouse coordinates over the hero stage
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle constructor blueprint
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      // Draw standard nodes
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      // Physics coordinate shifting & bounce logic
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Apply shift
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
      }
    }

    // Seed arrays
    function initParticles() {
      particlesArray = [];
      numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000);
      if (numberOfParticles > 120) numberOfParticles = 120; // Protect render loops on wide grids
      if (numberOfParticles < 30) numberOfParticles = 30;

      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 0.6) - 0.3;
        let directionY = (Math.random() * 0.6) - 0.3;
        // Cyan and Azure particle groupings
        let color = i % 2 === 0 ? 'rgba(0, 229, 255, 0.4)' : 'rgba(0, 120, 212, 0.4)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Connect nodes on screen adjacency
    function connectParticles() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                         ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          
          let maxDistance = 120 * 120;
          if (distance < maxDistance) {
            opacityValue = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacityValue * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }

        // Connect nodes to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          let mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x)) + 
                              ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
          if (mouseDistance < mouse.radius * mouse.radius) {
            opacityValue = 1 - (mouseDistance / (mouse.radius * mouse.radius));
            ctx.strokeStyle = `rgba(0, 225, 255, ${opacityValue * 0.25})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    // Frame loops updater
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connectParticles();
      requestAnimationFrame(animate);
    }

    initParticles();
    animate();
  }

  /* ==========================================================================
     STATION 5: INTERACTIVE SCROLL REVEAL STAGGER ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal only once for performance
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     STATION 6: ANIMATED STATISTICS COUNTERS
     ========================================================================== */
  const statsSection = document.getElementById('statistics');
  const statNumbers = document.querySelectorAll('.stat-number');
  let countTriggered = false;

  function runStatsCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      if (isNaN(target)) return; // Pass arbitrary display types like '24/7'

      let count = 0;
      const speed = target > 50 ? 25 : 50; // Count rate multiplier

      const timer = setInterval(() => {
        count += Math.ceil(target / (1000 / speed));
        if (count >= target) {
          stat.innerText = target;
          clearInterval(timer);
        } else {
          stat.innerText = count;
        }
      }, speed);
    });
  }

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countTriggered) {
          runStatsCounters();
          countTriggered = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     STATION 7: PREMIUM CLIENT TESTIMONIAL SLIDER
     ========================================================================== */
  const testimonialTrack = document.getElementById('testimonial-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonial-prev-btn');
  const nextBtn = document.getElementById('testimonial-next-btn');
  const dotElements = document.querySelectorAll('.slider-dot');
  
  let currentSlideIndex = 0;
  const slideCount = testimonialCards.length;

  function updateSliderPosition() {
    if (!testimonialTrack) return;
    
    // Shift track left
    testimonialTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    // Toggle card active tags
    testimonialCards.forEach((card, i) => {
      if (i === currentSlideIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Toggle dots active tag
    dotElements.forEach((dot, i) => {
      if (i === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToNextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slideCount;
    updateSliderPosition();
  }

  function goToPrevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slideCount) % slideCount;
    updateSliderPosition();
  }

  if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
  if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);

  // Click dot navigation
  dotElements.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentSlideIndex = parseInt(e.target.getAttribute('data-index'));
      updateSliderPosition();
    });
  });

  // Optional: Auto slider track rotations (stops on hover for reader accessibility)
  let sliderInterval = setInterval(goToNextSlide, 7000);
  const sliderWidget = document.querySelector('.testimonial-slider-container');
  if (sliderWidget) {
    sliderWidget.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    sliderWidget.addEventListener('mouseleave', () => {
      sliderInterval = setInterval(goToNextSlide, 7000);
    });
  }

  /* ==========================================================================
     STATION 8: CONSULTATION SECURE FORM CONTROLS
     ========================================================================== */
  const contactForm = document.getElementById('consultation-form');
  const successBanner = document.getElementById('form-success-banner');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Intercept page reload

      // Form local state elements
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const service = document.getElementById('contact-service').value;
      const message = document.getElementById('contact-message').value.trim();

      // Simple rigorous UI-facing safety validation check
      if (name === '' || phone === '' || email === '' || service === '') {
        alert('Please complete all required fields.');
        return;
      }

      // Visual feedback: disable submit button during brief server emulation latency
      const submitBtn = document.getElementById('form-submit-button');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Verifying Security Keys...</span> <i data-lucide="loader" class="animate-spin"></i>';
      submitBtn.style.opacity = '0.7';
      submitBtn.style.pointerEvents = 'none';

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // Imitate short encryption latency API trip
      setTimeout(() => {
        // Trigger glass success card overlay reveal
        successBanner.classList.add('active');
        
        // Restore submit button state
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';

        // Clear input values
        contactForm.reset();
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 1500);
    });
  }

  if (closeSuccessBtn && successBanner) {
    closeSuccessBtn.addEventListener('click', () => {
      successBanner.classList.remove('active');
    });
  }

});
