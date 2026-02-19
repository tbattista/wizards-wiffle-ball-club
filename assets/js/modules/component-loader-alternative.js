/**
 * Alternative Component Loader Module for Wizards Wiffle Ball Club
 * Uses XMLHttpRequest instead of fetch for better compatibility with local files
 */

/**
 * Load a single component into a container
 * @param {string} elementId - The ID of the container element
 * @param {string} componentPath - The path to the component HTML file
 */
export function loadComponent(elementId, componentPath) {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', componentPath, false); // Synchronous request
    xhr.send();
    
    if (xhr.status === 200) {
      const container = document.getElementById(elementId);
      if (container) {
        container.innerHTML = xhr.responseText;
      } else {
        console.error(`Container element not found: ${elementId}`);
      }
    } else {
      console.error(`Failed to load component: ${componentPath}`);
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

/**
 * Load all components for the page
 */
export function loadAllComponents() {
  loadComponent('header-container', 'components/header.html');
  loadComponent('hero-container', 'components/hero.html');
  loadComponent('rsvp-container', 'components/rsvp.html');
  loadComponent('game-setup-container', 'components/game-setup.html');
  loadComponent('rules-container', 'components/rules.html');
  loadComponent('field-layout-container', 'components/field-layout.html');
  loadComponent('location-container', 'components/location.html');
  loadComponent('footer-container', 'components/footer.html');
}

/**
 * Initialize component loading
 */
export function initComponentLoader() {
  // Load components immediately
  loadAllComponents();
  return Promise.resolve(); // Return a resolved promise for compatibility
}
