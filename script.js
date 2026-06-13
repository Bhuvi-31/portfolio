document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. GLASS NAVBAR SCROLL EFFECT
     ========================================== */
  const navbar = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once in case page loads scrolled down


  /* ==========================================
     2. MOBILE MENU / HAMBURGER NAVIGATION
     ========================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : ''; // Prevent scroll when open
  };
  
  hamburgerBtn.addEventListener('click', toggleMenu);
  
  // Close menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
  
  // Close menu when clicking outside of navbar
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      toggleMenu();
    }
  });


  /* ==========================================
     3. HIGH-END TYPING ANIMATION (Vanilla JS)
     ========================================== */
  const typingElement = document.getElementById('typing-text');
  const words = [
    "Frontend Developer.",
    "3rd Year B.E. CSE Student.",
    "Computer Vision Enthusiast.",
    "UI/UX Design Explorer."
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  
  const typeEffect = () => {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Erase character
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40;
    } else {
      // Type character
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 90;
    }
    
    // Switch states
    if (!isDeleting && charIndex === currentWord.length) {
      // Completed typing, pause before erasing
      isDeleting = true;
      typingDelay = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      // Completed erasing, move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 300; // Brief pause before starting next word
    }
    
    setTimeout(typeEffect, typingDelay);
  };
  
  if (typingElement) {
    setTimeout(typeEffect, 1000);
  }


  /* ==========================================
     4. ACTIVE LINK TRACKING ON SCROLL
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  
  const trackActiveSection = () => {
    let scrollPosition = window.scrollY + 160; // Offset for header height
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  
  window.addEventListener('scroll', trackActiveSection, { passive: true });
  trackActiveSection();


  /* ==========================================
     5. INTERSECTION OBSERVER - SCROLL REVEALS
     ========================================== */
  const revealElements = document.querySelectorAll('.rv');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  
  revealElements.forEach(element => revealObserver.observe(element));


  /* ==========================================
     6. STATS COUNTER ANIMATION
     ========================================== */
  const statsContainer = document.getElementById('statsContainer');
  const statNumbers = document.querySelectorAll('.stat-num');
  let counterAnimated = false;
  
  const animateStats = () => {
    statNumbers.forEach(stat => {
      const targetVal = parseFloat(stat.dataset.target);
      const isDecimal = stat.dataset.decimal === 'true';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing formula (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = easeProgress * targetVal;
        
        if (isDecimal) {
          stat.textContent = currentVal.toFixed(2);
        } else {
          stat.textContent = Math.floor(currentVal) + '+';
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Final value assignment
          if (isDecimal) {
            stat.textContent = targetVal.toFixed(2);
          } else {
            stat.textContent = targetVal + '+';
          }
        }
      };
      
      requestAnimationFrame(updateCounter);
    });
  };
  
  const statsObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting && !counterAnimated) {
      counterAnimated = true;
      animateStats();
      observer.disconnect(); // Unobserve after triggering
    }
  }, {
    threshold: 0.4
  });
  
  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }


  /* ==========================================
     7. CONTACT FORM VALIDATION & SIMULATED SUBMIT
     ========================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  
  // Input References
  const nameInput = document.getElementById('fname');
  const emailInput = document.getElementById('femail');
  const subjectInput = document.getElementById('fsubject');
  const messageInput = document.getElementById('fmessage');
  
  // Error Message Containers
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  // Regex validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const validateForm = () => {
    let isValid = true;
    
    // Name validation
    if (nameInput.value.trim() === '') {
      nameError.textContent = 'Name is required.';
      nameInput.style.borderColor = '#ff6060';
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      nameError.textContent = 'Name must be at least 2 characters.';
      nameInput.style.borderColor = '#ff6060';
      isValid = false;
    } else {
      nameError.textContent = '';
      nameInput.style.borderColor = 'var(--border)';
    }
    
    // Email validation
    if (emailInput.value.trim() === '') {
      emailError.textContent = 'Email is required.';
      emailInput.style.borderColor = '#ff6060';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.style.borderColor = '#ff6060';
      isValid = false;
    } else {
      emailError.textContent = '';
      emailInput.style.borderColor = 'var(--border)';
    }
    
    // Subject validation
    if (subjectInput.value.trim() === '') {
      subjectError.textContent = 'Subject is required.';
      subjectInput.style.borderColor = '#ff6060';
      isValid = false;
    } else if (subjectInput.value.trim().length < 3) {
      subjectError.textContent = 'Subject must be at least 3 characters.';
      subjectInput.style.borderColor = '#ff6060';
      isValid = false;
    } else {
      subjectError.textContent = '';
      subjectInput.style.borderColor = 'var(--border)';
    }
    
    // Message validation
    if (messageInput.value.trim() === '') {
      messageError.textContent = 'Message is required.';
      messageInput.style.borderColor = '#ff6060';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Message must be at least 10 characters.';
      messageInput.style.borderColor = '#ff6060';
      isValid = false;
    } else {
      messageError.textContent = '';
      messageInput.style.borderColor = 'var(--border)';
    }
    
    return isValid;
  };

  // Clear validation styling when user starts typing again
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = 'var(--border)';
      const errEl = document.getElementById(`${input.id}Error`);
      if (errEl) errEl.textContent = '';
    });
  });
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform validation
      if (!validateForm()) {
        formStatus.style.color = '#ff6060';
        formStatus.textContent = 'Please correct the errors in the fields above.';
        return;
      }
      
      // Validation passed - simulate API call
      const submitBtn = document.getElementById('btnSubmitForm');
      const originalBtnText = submitBtn.innerHTML;
      
      // Set Loading state
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> <span>Sending...</span>';
      submitBtn.disabled = true;
      formStatus.style.color = 'var(--accent-pink)';
      formStatus.textContent = 'Connecting to client mail server...';
      
      setTimeout(() => {
        // Success state
        formStatus.style.color = '#0df09c';
        formStatus.textContent = '✓ Success! Your message has been sent successfully. Thank you!';
        
        // Reset form inputs
        contactForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Clear status text after 5 seconds
        setTimeout(() => {
          formStatus.textContent = '';
        }, 5000);
        
      }, 1800);
    });
  }
});
