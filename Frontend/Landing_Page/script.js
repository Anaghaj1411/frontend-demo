document.addEventListener("DOMContentLoaded", () => {

  // ===== Display user role from localStorage =====
  const role = localStorage.getItem("role") || "Guest";
  const badgeElement = document.querySelector(".badge");
  if (badgeElement) {
    badgeElement.textContent = role.charAt(0).toUpperCase() + role.slice(1);
  }

  // ===== Logout functionality =====
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../login%20page/login.html";
    });
  }

  // ===== Button handlers =====
  const primaryBtns = document.querySelectorAll(".primary-btn");
  const secondaryBtns = document.querySelectorAll(".secondary-btn");

  primaryBtns.forEach(btn => {
    if (btn.textContent.includes("Get Started")) {
      btn.addEventListener("click", () => {
        window.location.href = "../login%20page/register.html";
      });
    } else if (btn.textContent.includes("Client")) {
      btn.addEventListener("click", () => {
        localStorage.setItem("role", "client");
        window.location.href = "../login%20page/login.html";
      });
    }
  });

  secondaryBtns.forEach(btn => {
    if (btn.textContent.includes("Login")) {
      btn.addEventListener("click", () => {
        window.location.href = "../login%20page/login.html";
      });
    } else if (btn.textContent.includes("Freelancer")) {
      btn.addEventListener("click", () => {
        localStorage.setItem("role", "freelancer");
        window.location.href = "../login%20page/login.html";
      });
    }
  });

  // ===== Enhanced Navbar on scroll =====
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.backdropFilter = "blur(20px)";
        navbar.style.boxShadow = "0 4px 30px rgba(0,0,0,0.1)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.backdropFilter = "blur(10px)";
        navbar.style.boxShadow = "none";
      }
    });
  }

  // ===== Animated Counter for Stats =====
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      if (target >= 1000) {
        element.textContent = Math.floor(current).toLocaleString();
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  // ===== Intersection Observer for Animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Handle counter animations
        if (entry.target.classList.contains('animate-counter')) {
          const statNumber = entry.target.querySelector('.stat-number');
          if (statNumber && !statNumber.dataset.animated) {
            const target = parseInt(statNumber.dataset.target);
            animateCounter(statNumber, target);
            statNumber.dataset.animated = 'true';
          }
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // ===== Observe elements for animations =====
  const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-up, .animate-counter');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });

  // ===== Mobile Menu Toggle =====
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle && navMenu) {
    let isMenuOpen = false;
    
    mobileMenuToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      
      if (isMenuOpen) {
        navMenu.style.display = 'flex';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'rgba(255, 255, 255, 0.98)';
        navMenu.style.backdropFilter = 'blur(20px)';
        navMenu.style.flexDirection = 'column';
        navMenu.style.padding = '2rem';
        navMenu.style.borderTop = '1px solid rgba(0, 0, 0, 0.1)';
        navMenu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        
        // Animate menu items
        const navLinks = navMenu.querySelectorAll('.nav-link, .badge, .logout-btn');
        navLinks.forEach((link, index) => {
          link.style.opacity = '0';
          link.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            link.style.transition = 'all 0.3s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateX(0)';
          }, index * 100);
        });
        
        // Animate hamburger to X
        mobileMenuToggle.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 5px)';
        mobileMenuToggle.querySelector('span:nth-child(2)').style.opacity = '0';
        mobileMenuToggle.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        navMenu.style.display = 'none';
        
        // Reset hamburger
        mobileMenuToggle.querySelector('span:nth-child(1)').style.transform = 'none';
        mobileMenuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
        mobileMenuToggle.querySelector('span:nth-child(3)').style.transform = 'none';
      }
    });
  }

  // ===== Smooth Scroll for Navigation Links =====
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Parallax Effect for Hero Section =====
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  
  if (hero && heroVisual) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      
      if (scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    });
  }

  // ===== Floating Cards Animation =====
  const floatingCards = document.querySelectorAll('.floating-card');
  floatingCards.forEach((card, index) => {
    // Add random floating animation
    const randomDelay = Math.random() * 2;
    const randomDuration = 4 + Math.random() * 4;
    
    card.style.animationDelay = `${randomDelay}s`;
    card.style.animationDuration = `${randomDuration}s`;
  });

  // ===== Button Ripple Effect =====
  const buttons = document.querySelectorAll('.primary-btn, .secondary-btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      // Add ripple styles if not already present
      if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
          .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
          }
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          .primary-btn, .secondary-btn {
            position: relative;
            overflow: hidden;
          }
        `;
        document.head.appendChild(style);
      }
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // ===== Testimonial Carousel (if multiple testimonials) =====
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  if (testimonialCards.length > 3) {
    let currentIndex = 0;
    
    const showTestimonial = (index) => {
      testimonialCards.forEach((card, i) => {
        card.style.display = i === index ? 'block' : 'none';
      });
    };
    
    // Auto-rotate testimonials
    setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonialCards.length;
      showTestimonial(currentIndex);
    }, 5000);
  }

  // ===== Dynamic Background Particles =====
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = Math.random() * 4 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'rgba(31, 165, 154, 0.6)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    
    document.body.appendChild(particle);
    
    const duration = Math.random() * 3000 + 2000;
    const horizontalMovement = (Math.random() - 0.5) * 100;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${horizontalMovement}px, -${window.innerHeight + 100}px) scale(0)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'ease-out'
    }).onfinish = () => particle.remove();
  };
  
  // Create particles periodically
  setInterval(createParticle, 300);

  // ===== Mouse Move Effect for Hero Visual =====
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angleX = (y - centerY) / 30;
      const angleY = (centerX - x) / 30;
      
      floatingCards.forEach((card, index) => {
        const depth = (index + 1) * 0.5;
        card.style.transform = `rotateX(${angleX * depth}deg) rotateY(${angleY * depth}deg) translateZ(${depth * 10}px)`;
      });
    });
    
    heroVisual.addEventListener('mouseleave', () => {
      floatingCards.forEach(card => {
        card.style.transform = '';
      });
    });
  }

});
