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

    const pad = n => String(n).padStart(2, '0');

    const parseTime = (timeStr) => {
      const m = /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/.exec(String(timeStr || '').trim());
      if (!m) return { h: 16, m: 5 };
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2], 10);
      const ap = (m[3] || '').toUpperCase();
      if (ap === 'PM' && h < 12) h += 12;
      if (ap === 'AM' && h === 12) h = 0;
      return { h, m: min };
    };

    const localStamp = (dt, h, m) => {
      const y = dt.getFullYear();
      const mo = pad(dt.getMonth() + 1);
      const d = pad(dt.getDate());
      return `${y}${mo}${d}T${pad(h)}${pad(m)}00`;
    };

    const googleHref = g => {
      const { h, m } = parseTime(g.time);
      const start = localStamp(g.dateObj, h, m);
      const end = localStamp(g.dateObj, h + 3, m);
      const text = encodeURIComponent(`Wizards Wiffle Ball: ${g.opponent}`);
      const location = encodeURIComponent(`${g.location}, 1 W Pontiac St, Warwick, RI 02886`);
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&location=${location}`;
    };

    const icsContent = g => {
      const { h, m } = parseTime(g.time);
      const start = localStamp(g.dateObj, h, m);
      const end = localStamp(g.dateObj, h + 3, m);
      const stamp = localStamp(new Date(), new Date().getHours(), new Date().getMinutes());
      const uid = `wwbc-${g.id}-${start}@wizardswiffleball`;
      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wizards Wiffle Ball Club//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:Wizards Wiffle Ball: ${g.opponent}`,
        `LOCATION:${g.location}\\, 1 W Pontiac St\\, Warwick\\, RI 02886`,
        'DESCRIPTION:Wizards Wiffle Ball Club game. See wizardswiffleball.club for details.',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
    };

    const icsByGameId = {};
    games.forEach(g => { icsByGameId[g.id] = icsContent(g); });

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
              <span class="schedule-cal-label">Add to Calendar:</span>
              <a class="schedule-cal-btn" href="${googleHref(g)}" target="_blank" rel="noopener" title="Google Calendar" aria-label="Add to Google Calendar">
                <i class="bi bi-google"></i>
              </a>
              <a class="schedule-cal-btn" href="#" data-ics-game="${g.id}" title="Apple Calendar / .ics" aria-label="Download .ics for Apple Calendar">
                <i class="bi bi-apple"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.addEventListener('click', (ev) => {
      const link = ev.target.closest('[data-ics-game]');
      if (!link) return;
      ev.preventDefault();
      const id = link.getAttribute('data-ics-game');
      const ics = icsByGameId[id];
      if (!ics) return;
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wwbc-game-${id}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

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
