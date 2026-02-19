/**
 * UI Effects Module for Wizards Wiffle Ball Club
 * Handles animations, effects, and UI interactions
 */

/**
 * Initialize AOS (Animate On Scroll) library
 */
export function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
}

/**
 * Initialize GLightbox for image galleries
 */
export function initGLightbox() {
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }
}

/**
 * Initialize Swiper sliders
 */
export function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  
  document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
    let config = JSON.parse(
      swiperElement.querySelector(".swiper-config").innerHTML.trim()
    );

    if (swiperElement.classList.contains("swiper-tab")) {
      initSwiperWithCustomPagination(swiperElement, config);
    } else {
      new Swiper(swiperElement, config);
    }
  });
}

/**
 * Scroll top button functionality
 */
export function initScrollTop() {
  let scrollTop = document.querySelector('.scroll-top');
  
  if (!scrollTop) return;

  function toggleScrollTop() {
    window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
  }
  
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);
}

/**
 * Handle preloader
 */
export function initPreloader() {
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }
}

/**
 * Correct scrolling position for hash links
 */
export function initHashLinkScrolling() {
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });
}

/**
 * Initialize all UI effects
 */
export function initUIEffects() {
  initAOS();
  initGLightbox();
  initSwiper();
  initScrollTop();
  initPreloader();
  initHashLinkScrolling();
}
