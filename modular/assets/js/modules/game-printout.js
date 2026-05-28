/**
 * Game Day Printout Generator
 * Builds a printable HTML document for a specific game, including the
 * club rules, field info, scorecard, and attendance sign-in pages.
 */

let rulesCache = null;
let fieldCache = null;

async function loadRefData() {
  if (rulesCache && fieldCache) return { rules: rulesCache, field: fieldCache };
  const [rulesRes, fieldRes] = await Promise.all([
    fetch('data/rules.json'),
    fetch('data/field-info.json')
  ]);
  if (!rulesRes.ok || !fieldRes.ok) throw new Error('Failed to load reference data');
  rulesCache = await rulesRes.json();
  fieldCache = await fieldRes.json();
  return { rules: rulesCache, field: fieldCache };
}

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function ruleList(items) {
  return (items || []).map(i => `<li>${esc(i)}</li>`).join('');
}

function attendanceRows(count) {
  let rows = '';
  for (let i = 1; i <= count; i++) {
    rows += `<tr>
      <td class="num">${i}</td>
      <td class="line"></td>
      <td class="line"></td>
      <td class="line"></td>
      <td class="line"></td>
    </tr>`;
  }
  return rows;
}

function attendancePage(pageNum, totalPages, rowCount) {
  return `
  <section class="attendance-page">
    <header class="att-header">
      <h1>Player Sign-In Sheet</h1>
      <p class="subtitle">Please print your name and sign below before play begins.</p>
      <p class="att-page">Page ${pageNum} of ${totalPages}</p>
    </header>
    <table class="attendance-table">
      <thead>
        <tr>
          <th class="num">#</th>
          <th>Name (Print)</th>
          <th>Age</th>
          <th>Emergency Contact</th>
          <th>Signature</th>
        </tr>
      </thead>
      <tbody>${attendanceRows(rowCount)}</tbody>
    </table>
  </section>`;
}

function formatLongDate(isoDate, fallbackDisplay) {
  try {
    const d = new Date(isoDate + 'T00:00:00');
    if (isNaN(d)) return fallbackDisplay || isoDate;
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return fallbackDisplay || isoDate;
  }
}

export function buildGamePrintoutHtml(game, rules, field) {
  const longDate = formatLongDate(game.date, game.dateDisplay);
  const locationLine = game.address ? `${game.location} — ${game.address}` : game.location;
  const attendancePages = 2;
  const rowsPerPage = 22;

  const dims = field && field.dimensions ? field.dimensions : {};
  const out = dims.outfield || {};
  const inf = dims.infield || {};

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Wizards Wiffle Ball — ${esc(game.opponent)} (${esc(game.dateDisplay)})</title>
<style>
  @page { size: letter; margin: 0.5in; }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, "Times New Roman", serif;
    color: #111;
    margin: 0;
    padding: 24px;
    line-height: 1.4;
  }
  .page { page-break-after: always; }
  .page:last-of-type { page-break-after: auto; }

  header.main-header {
    text-align: center;
    border-bottom: 3px double #111;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  h1 { font-size: 28px; margin: 0 0 4px; letter-spacing: 1px; }
  .subtitle { font-size: 13px; color: #555; margin: 0; }

  .game-banner {
    margin: 14px 0 18px;
    padding: 12px 16px;
    border: 2px solid #111;
    border-radius: 8px;
    background: #f9f6ef;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 18px;
  }
  .game-banner .full { grid-column: 1 / -1; }
  .game-banner strong { display: inline-block; min-width: 80px; }
  .game-banner .opp { font-size: 18px; font-weight: bold; }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 22px;
  }
  section.card {
    border: 1px solid #333;
    border-radius: 6px;
    padding: 10px 14px;
    page-break-inside: avoid;
  }
  section.card.full { grid-column: 1 / -1; }
  h2 {
    font-size: 15px;
    margin: 0 0 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  ul { margin: 6px 0 0; padding-left: 18px; }
  li { margin: 2px 0; font-size: 13px; }
  .field-info { font-size: 13px; }
  .field-info dt { font-weight: bold; display: inline; }
  .field-info dd { display: inline; margin: 0 12px 0 4px; }
  .field-info dl { margin: 4px 0; }

  table.scorecard { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 4px; }
  table.scorecard th, table.scorecard td { border: 1px solid #333; padding: 4px; text-align: center; }
  table.scorecard th.team, table.scorecard td.team { text-align: left; width: 24%; padding: 10px 6px; }
  table.scorecard th.tot, table.scorecard td.tot { background: #eee; }
  table.scorecard td.tot { background: #f6f6f6; }

  footer.main-footer {
    margin-top: 18px;
    text-align: center;
    font-size: 11px;
    color: #666;
    border-top: 1px solid #999;
    padding-top: 8px;
  }

  /* Attendance pages */
  .attendance-page {
    page-break-before: always;
  }
  .att-header { text-align: center; margin-bottom: 12px; border-bottom: 2px solid #111; padding-bottom: 8px; }
  .att-header h1 { margin: 0; font-size: 24px; }
  .att-header .subtitle { font-size: 12px; }
  .att-header .att-page { font-size: 11px; color: #666; margin: 4px 0 0; }
  table.attendance-table { width: 100%; border-collapse: collapse; }
  table.attendance-table th, table.attendance-table td {
    border: 1px solid #333;
    padding: 8px 6px;
    font-size: 12px;
    text-align: left;
  }
  table.attendance-table th { background: #eee; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px; }
  table.attendance-table td.num { width: 30px; text-align: center; color: #666; }
  table.attendance-table td.line { height: 24px; }
  table.attendance-table th:nth-child(2) { width: 26%; }
  table.attendance-table th:nth-child(3) { width: 8%; }
  table.attendance-table th:nth-child(4) { width: 26%; }
  table.attendance-table th:nth-child(5) { width: 36%; }

  .print-controls {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #fff;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 6px 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    font-family: system-ui, sans-serif;
    font-size: 13px;
  }
  .print-controls button {
    border: 1px solid #333;
    background: #f8d048;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  @media print {
    body { padding: 0; }
    .print-controls { display: none; }
  }
</style>
</head>
<body>

<div class="print-controls">
  <button onclick="window.print()">Print / Save as PDF</button>
</div>

<div class="page">
  <header class="main-header">
    <h1>Wizards Wiffle Ball Club</h1>
    <p class="subtitle">Game Day Rules &amp; Scorecard</p>
  </header>

  <div class="game-banner">
    <div class="full opp">${esc(game.opponent)}</div>
    <div><strong>Date:</strong> ${esc(longDate)}</div>
    <div><strong>Time:</strong> ${esc(game.time)}</div>
    <div class="full"><strong>Location:</strong> ${esc(locationLine)}</div>
    <div><strong>Home/Away:</strong> ${esc((game.homeAway || '').toUpperCase())}</div>
    <div><strong>Season:</strong> 2026</div>
  </div>

  <div class="grid">
    <section class="card full">
      <h2>General Rules</h2>
      <ul>${ruleList(rules.generalRules)}</ul>
    </section>

    <section class="card">
      <h2>Game Setup</h2>
      <ul>${ruleList(rules.gameSetup)}</ul>
    </section>

    <section class="card">
      <h2>Batting</h2>
      <ul>${ruleList(rules.battingRules)}</ul>
    </section>

    <section class="card">
      <h2>Pitching</h2>
      <ul>${ruleList(rules.pitchingRules)}</ul>
    </section>

    <section class="card">
      <h2>Fielding</h2>
      <ul>${ruleList(rules.fieldingRules)}</ul>
    </section>

    <section class="card full">
      <h2>Field — ${esc(field.name || '')}</h2>
      <div class="field-info">
        <dl>
          <dt>Left Field:</dt><dd>${esc(out.leftField || '—')}</dd>
          <dt>Center Field:</dt><dd>${esc(out.centerField || '—')}</dd>
          <dt>Right Field:</dt><dd>${esc(out.rightField || '—')}</dd>
        </dl>
        <dl>
          <dt>Base Path:</dt><dd>${esc(inf.basePath || '—')}</dd>
          <dt>Pitcher's Mound:</dt><dd>${esc(inf.pitchersMound || '—')}</dd>
          <dt>Fence:</dt><dd>4 ft high</dd>
        </dl>
      </div>
    </section>

    <section class="card full">
      <h2>Scorecard</h2>
      <table class="scorecard">
        <thead>
          <tr>
            <th class="team">Team</th>
            <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
            <th class="tot">R</th><th class="tot">H</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="team">&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td class="tot"></td><td class="tot"></td></tr>
          <tr><td class="team">&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td class="tot"></td><td class="tot"></td></tr>
        </tbody>
      </table>
    </section>
  </div>

  <footer class="main-footer">
    Wizards Wiffle Ball Club &mdash; Bring the bat, leave the gloves at home.
  </footer>
</div>

${Array.from({ length: attendancePages }, (_, i) => attendancePage(i + 1, attendancePages, rowsPerPage)).join('')}

</body>
</html>`;
}

export async function openGamePrintout(game) {
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow pop-ups to open the game day printout.');
    return;
  }
  win.document.write('<!DOCTYPE html><title>Loading…</title><p style="font-family:sans-serif;padding:24px">Generating game day sheet…</p>');
  try {
    const { rules, field } = await loadRefData();
    const html = buildGamePrintoutHtml(game, rules, field);
    win.document.open();
    win.document.write(html);
    win.document.close();
  } catch (err) {
    console.error(err);
    win.document.body.innerHTML = '<p style="font-family:sans-serif;padding:24px;color:#a00">Failed to generate printout. Please try again.</p>';
  }
}
