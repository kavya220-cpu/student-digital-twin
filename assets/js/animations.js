/* assets/js/animations.js */

document.addEventListener('DOMContentLoaded', () => {
  // Cursor glow movement
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      // Use requestAnimationFrame for high-performance rendering
      window.requestAnimationFrame(() => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      });
    });
  }

  // Mouse Parallax for blobs and decorative objects
  document.addEventListener('mousemove', (e) => {
    window.requestAnimationFrame(() => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;

      // Parallax multiplier based on offset from center
      const moveX = (wWidth / 2 - mouseX) / 45;
      const moveY = (wHeight / 2 - mouseY) / 45;

      // Move decorative elements
      const decors = document.querySelectorAll('.decor-object');
      decors.forEach((decor, idx) => {
        const factor = (idx + 1) * 0.5;
        // Keep the floating animation baseline but apply translation
        decor.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });

      // Move background blobs slightly
      const blobs = document.querySelectorAll('.blob');
      blobs.forEach((blob, idx) => {
        const factor = (idx + 1) * 0.25;
        blob.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    });
  });

  // Handle standard buttons micro-scale ripples
  const buttons = document.querySelectorAll('.btn-premium');
  buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.97)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // GSAP animations triggered once loading ends
  document.addEventListener('splashComplete', () => {
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();

      // Left panel header and branding
      tl.from('.left-brand', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.out'
      })
      // Headlines
      .from('.left-headline', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.3')
      .from('.left-subheading', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      // Immersive background image entrance
      .from('.left-student-bg-container', {
        opacity: 0,
        scale: 0.95,
        x: 30,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.5')
      // Feature list items stagger slide-in
      .from('.feature-item-list', {
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.8')
      // Floating vector indicators
      .from('.decor-object', {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.6')
      // Active Login Card Entrance
      .from('.auth-card.active', {
        opacity: 0,
        scale: 0.96,
        y: 25,
        duration: 0.8,
        ease: 'back.out(1.2)'
      }, '-=0.8');
    }

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-quad'
      });
    }
  });
});
