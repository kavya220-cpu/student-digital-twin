/* assets/js/about.js */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP and ScrollTrigger are available
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // 1. Initial Hero Animations
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .from('.hero-badge', { opacity: 0, y: 20, duration: 0.8, delay: 0.2 })
      .from('.hero-heading', { opacity: 0, y: 30, duration: 1 }, '-=0.6')
      .from('.hero-desc', { opacity: 0, y: 25, duration: 0.8 }, '-=0.7')
      .from('.hero-actions', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
      .from('.hero-illustration-wrapper', { opacity: 0, scale: 0.95, duration: 1.2 }, '-=0.8');

    // 2. Gentle Floating Loop Animations
    gsap.to('.float-widget-1', { y: -15, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.float-widget-2', { y: 12, duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.float-widget-3', { y: -8, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.float-widget-4', { y: 15, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    
    // Orbiting particles float
    gsap.to('.orbit-particle-1', { rotation: 360, transformOrigin: '200px 200px', duration: 15, repeat: -1, ease: 'none' });
    gsap.to('.orbit-particle-2', { rotation: -360, transformOrigin: '200px 200px', duration: 25, repeat: -1, ease: 'none' });
    
    // Floating NexusED Brand Logo in Vision Section
    gsap.to('.vision-logo-wrapper', { y: -20, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.vision-logo-ring', { rotation: 360, duration: 20, repeat: -1, ease: 'none' });

    // 3. ScrollTrigger Fade-Up for standard sections
    gsap.utils.toArray('.scroll-fade-up').forEach(elem => {
      gsap.from(elem, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 4. Staggered Entrance for Cards
    ScrollTrigger.batch('.stagger-card', {
      start: 'top 85%',
      onEnter: batch => gsap.from(batch, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        overwrite: 'auto'
      })
    });

    // 5. Stat Counter Count-up Animation
    const counters = document.querySelectorAll('.stat-counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const obj = { value: 0 };
      
      gsap.to(obj, {
        value: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          if (Number.isInteger(target)) {
            counter.textContent = Math.floor(obj.value) + suffix;
          } else {
            counter.textContent = obj.value.toFixed(0) + suffix; // or 1 decimal if needed
          }
        }
      });
    });

    // 6. Magnetic Mouse Parallax on Hero Illustration
    const heroIllustration = document.querySelector('.hero-illustration-wrapper');
    const heroInner = document.querySelector('.hero-illustration-inner');
    if (heroIllustration && heroInner) {
      heroIllustration.addEventListener('mousemove', (e) => {
        const rect = heroIllustration.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Max rotation 12deg
        const rotY = (x / (rect.width / 2)) * 12;
        const rotX = -(y / (rect.height / 2)) * 12;
        
        gsap.to(heroInner, {
          rotateY: rotY,
          rotateX: rotX,
          duration: 0.6,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });
      
      heroIllustration.addEventListener('mouseleave', () => {
        gsap.to(heroInner, {
          rotateY: 0,
          rotateX: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });
    }
  }

  // 7. Radial Glow Tracker for Bento Grid & Glass Cards
  const glowCards = document.querySelectorAll('.glow-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 8. Custom Button Ripple Effect
  const rippleButtons = document.querySelectorAll('.ripple-btn');
  rippleButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple-span';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});
