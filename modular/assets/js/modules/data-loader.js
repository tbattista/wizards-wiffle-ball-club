/**
 * Data Loader Module for Wizards Wiffle Ball Club
 * Handles loading and displaying data from JSON files
 */

/**
 * Load event data and update the DOM
 */
export async function loadEventData() {
  try {
    const response = await fetch('data/events.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Update next game details
    const nextGame = data.nextGame;
    const dateElements = document.querySelectorAll('.event-date');
    const timeElements = document.querySelectorAll('.event-time');
    const locationElements = document.querySelectorAll('.event-location');
    
    dateElements.forEach(el => el.textContent = nextGame.date);
    timeElements.forEach(el => el.textContent = nextGame.time);
    locationElements.forEach(el => el.textContent = nextGame.location + ' - ' + nextGame.address);
    
    return data;
  } catch (error) {
    console.error('Error loading event data:', error);
  }
}

/**
 * Load rules data and update the DOM
 */
export async function loadRulesData() {
  try {
    const response = await fetch('data/rules.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // This function doesn't update the DOM directly since the rules are already in the HTML
    // But it could be used to dynamically generate rules content if needed
    
    return data;
  } catch (error) {
    console.error('Error loading rules data:', error);
  }
}

/**
 * Load field information and update the DOM
 */
export async function loadFieldInfo() {
  try {
    const response = await fetch('data/field-info.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // This function doesn't update the DOM directly since the field info is already in the HTML
    // But it could be used to dynamically generate field info content if needed
    
    return data;
  } catch (error) {
    console.error('Error loading field info:', error);
  }
}

/**
 * Initialize all data loading
 */
export function initDataLoaders() {
  loadEventData();
  loadRulesData();
  loadFieldInfo();
}
