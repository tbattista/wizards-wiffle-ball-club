/**
 * Component Loader Module for Wizards Wiffle Ball Club
 * Handles loading HTML components into the page
 */

/**
 * Load a single component into a container
 * @param {string} elementId - The ID of the container element
 * @param {string} componentPath - The path to the component HTML file
 * @returns {Promise} - A promise that resolves when the component is loaded
 */
export function loadComponent(elementId, componentPath) {
  return fetch(componentPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentPath}`);
      }
      return response.text();
    })
    .then(html => {
      const container = document.getElementById(elementId);
      if (container) {
        container.innerHTML = html;
      } else {
        console.error(`Container element not found: ${elementId}`);
      }
      return html;
    })
    .catch(error => {
      console.error(`Error loading component ${componentPath}:`, error);
    });
}

/**
 * Load all components for the page
 * @returns {Promise} - A promise that resolves when all components are loaded
 */
export function loadAllComponents() {
  const componentPromises = [
    loadComponent('header-container', 'components/header.html'),
    loadComponent('hero-container', 'components/hero.html'),
    loadComponent('rsvp-container', 'components/rsvp.html'),
    loadComponent('game-setup-container', 'components/game-setup.html'),
    loadComponent('rules-container', 'components/rules.html'),
    loadComponent('field-layout-container', 'components/field-layout.html'),
    loadComponent('location-container', 'components/location.html'),
    loadComponent('footer-container', 'components/footer.html')
  ];
  
  return Promise.all(componentPromises);
}

/**
 * Initialize component loading
 */
export function initComponentLoader() {
  return loadAllComponents();
}
