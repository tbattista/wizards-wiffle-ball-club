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
 * Load schedule data and render game cards
 */
export async function loadScheduleData() {
  try {
    const response = await fetch('data/schedule.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const grid = document.getElementById('schedule-grid');
    if (!grid) return data;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const games = (data.games || []).map(g => ({
      ...g,
      dateObj: new Date(g.date + 'T00:00:00')
    }));

    const nextIdx = games.findIndex(g => g.dateObj >= today && g.status === 'upcoming');

    const escape = s => String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    const calHref = g => {
      const dt = g.dateObj;
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      const start = `${y}${m}${d}T160500`;
      const end = `${y}${m}${d}T190500`;
      const text = encodeURIComponent(`Wizards Wiffle Ball: ${g.opponent}`);
      const location = encodeURIComponent(`${g.location}, 1 W Pontiac St, Warwick, RI 02886`);
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&location=${location}`;
    };

    grid.innerHTML = games.map((g, i) => {
      const isNext = i === nextIdx;
      const isPast = g.dateObj < today;
      const badge = g.homeAway === 'home' ? 'HOME' : 'AWAY';
      const nextBadge = isNext ? '<span class="next-game-badge">NEXT GAME</span>' : '';
      const stateClass = isNext ? ' is-next' : isPast ? ' is-past' : '';
      return `
        <div class="col-md-6 col-lg-4">
          <div class="schedule-card${stateClass}">
            ${nextBadge}
            <div class="schedule-card-header">
              <div class="schedule-date">
                <span class="schedule-date-day">${escape(g.dateDisplay)}</span>
                <span class="schedule-date-year">${escape(String(g.dateObj.getFullYear()))}</span>
              </div>
              <span class="schedule-home-away home-away-${escape(g.homeAway)}">${badge}</span>
            </div>
            <h3 class="schedule-opponent">${escape(g.opponent)}</h3>
            <div class="schedule-meta">
              <div><i class="bi bi-clock"></i> ${escape(g.time)}</div>
              <div><i class="bi bi-geo-alt"></i> ${escape(g.location)}</div>
            </div>
            <div class="schedule-actions">
              <a class="schedule-cal-link" href="${calHref(g)}" target="_blank" rel="noopener"><i class="bi bi-calendar-plus"></i> Add to Calendar</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return data;
  } catch (error) {
    console.error('Error loading schedule data:', error);
  }
}

/**
 * Initialize all data loading
 */
export function initDataLoaders() {
  loadEventData();
  loadRulesData();
  loadFieldInfo();
  loadScheduleData();
}
