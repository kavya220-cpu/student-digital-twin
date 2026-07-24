/* assets/js/loader.js */

document.addEventListener('DOMContentLoaded', () => {
  // If student profile is already registered, redirect directly to dashboard.html!
  if (localStorage.getItem('nexusED_profile')) {
    window.location.href = 'dashboard.html';
    return;
  }

  const splashScreen = document.querySelector('.splash-screen');
  const progressBar = document.querySelector('.splash-progress');
  const percentText = document.querySelector('.splash-percent');
  
  if (!splashScreen) return;

  // Initialize background floating particles in Splash Screen
  initSplashParticles();

  let progress = 0;
  const duration = 2200; // ~2.2 seconds total load time
  const intervalTime = 30;
  const steps = duration / intervalTime;
  const increment = 100 / steps;

  const loadInterval = setInterval(() => {
    // Generate slight random variance for realistic loading feel
    const variance = (Math.random() * 0.4 + 0.8);
    progress += increment * variance;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      completeLoading();
    }

    progressBar.style.width = `${progress}%`;
    percentText.textContent = `${Math.floor(progress)}%`;
  }, intervalTime);

  function completeLoading() {
    // Fade out and scale down splash screen using GSAP
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          splashScreen.remove();
          // Dispatch custom event to notify other scripts that loading is done
          document.dispatchEvent(new CustomEvent('splashComplete'));
        }
      });

      tl.to('.splash-content', {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in'
      })
      .to(splashScreen, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3');
    } else {
      // Fallback
      splashScreen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      splashScreen.style.opacity = '0';
      splashScreen.style.transform = 'scale(0.95)';
      setTimeout(() => {
        splashScreen.remove();
        document.dispatchEvent(new CustomEvent('splashComplete'));
      }, 600);
    }
  }

  function initSplashParticles() {
    const particleContainer = document.querySelector('.splash-particles');
    if (!particleContainer) return;

    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random positioning and sizes
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}vw`;
      
      // Random timings
      const durationVal = Math.random() * 8 + 6;
      const delay = Math.random() * -10;
      particle.style.animationDuration = `${durationVal}s`;
      particle.style.animationDelay = `${delay}s`;
      
      particleContainer.appendChild(particle);
    }
  }
});
