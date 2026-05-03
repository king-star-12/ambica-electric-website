document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Sticky Navbar background change on scroll + Back to Top button
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
    
    // Show/hide back to top button
    if (backToTopBtn) {
      if (window.scrollY > 600) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll Reveal Animations
  const reveals = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load

  // Animated Number Counters
  const counters = document.querySelectorAll('.stat-number, .workforce-number');
  let hasAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // ms
      const increment = target / (duration / 16); // 60fps

      let current = 0;
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current) + (counter.getAttribute('data-suffix') || '');
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target + (counter.getAttribute('data-suffix') || '');
        }
      };
      updateCounter();
    });
  };

  // Trigger counter animation when stats section is in view
  const statsSections = document.querySelectorAll('.hero-stats, .workforce-grid');
  
  const checkStatsScroll = () => {
    statsSections.forEach(section => {
      // check if section has been animated yet via a data attribute
      if (section.getAttribute('data-animated') === 'true') return;
      
      const elementTop = section.getBoundingClientRect().top;
      if (elementTop < window.innerHeight) {
        // Animate only counters within this specific section
        const localCounters = section.querySelectorAll('.stat-number, .workforce-number');
        localCounters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000; // ms
          const increment = target / (duration / 16); // 60fps

          let current = 0;
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.innerText = Math.ceil(current) + (counter.getAttribute('data-suffix') || '');
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target + (counter.getAttribute('data-suffix') || '');
            }
          };
          updateCounter();
        });
        section.setAttribute('data-animated', 'true');
      }
    });
  };
  
  window.addEventListener('scroll', checkStatsScroll);
  checkStatsScroll(); // Check on load

  // Contact Form Handling (API Integration)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      
      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/SendContactEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          submitBtn.innerText = 'Message Sent Successfully!';
          submitBtn.style.backgroundColor = '#4CAF50'; // Green
          submitBtn.style.color = '#fff';
          contactForm.reset();
        } else {
          throw new Error('Failed to send message.');
        }
      } catch (error) {
        console.error(error);
        submitBtn.innerText = 'Error Sending Message';
        submitBtn.style.backgroundColor = '#F44336'; // Red
        submitBtn.style.color = '#fff';
      } finally {
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.backgroundColor = ''; // Reset to default
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  }
});
