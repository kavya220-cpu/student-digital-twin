/* home.js – Premium SaaS landing interactions */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Transparent Header scroll detection
  const header = document.querySelector('.landing-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mouseglow radial tracking on bento grid cards
  const bentoGrid = document.querySelector('.bento-grid');
  if (bentoGrid) {
    bentoGrid.addEventListener('mousemove', (e) => {
      const cards = bentoGrid.querySelectorAll('.bento-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // 3. FAQ Accordions Handler
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Collapse all others
        faqItems.forEach(i => i.classList.remove('open'));
        
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // 4. GSAP Scroll Animations initialization
  if (typeof gsap !== 'undefined') {
    // Fade up sections on viewport entering
    gsap.utils.toArray('section').forEach(sec => {
      gsap.from(sec, {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
          trigger: sec,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    });
  }

  // 5. Dynamic timeline preview scroll animation
  const scrollContainer = document.querySelector('.timeline-scroll-container');
  const fillLine = document.getElementById('timeline-line-preview');
  if (scrollContainer && fillLine) {
    scrollContainer.addEventListener('scroll', () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      fillLine.style.height = `${progress}%`;
    });
  }
});
