/**
 * Alternative Main JavaScript file for Wizards Wiffle Ball Club
 * This file imports and initializes all modules
 * Uses the alternative component loader for better compatibility with local files
 */

import { initNavigation } from './modules/navigation.js';
import { initUIEffects } from './modules/ui-effects.js';
import { initDataLoaders } from './modules/data-loader.js';
import { initComponentLoader } from './modules/component-loader-alternative.js';

/**
 * Initialize the application
 */
async function initApp() {
  try {
    // First load all components
    await initComponentLoader();
    
    // Then initialize all other modules
    initNavigation();
    initUIEffects();
    initDataLoaders();
    
    console.log('Wizards Wiffle Ball Club website initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
