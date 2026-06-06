/* ── sidebar.js ── */

let currentSessionId = null;
let _creating        = false;   // guard anti-double-création

export function getCurrentSessionId() { return currentSessionId; }
export function setCurrentSessionId(id) { currentSessionId = id; }

/* ── Ouvrir / fermer sidebar (mobile) ── */
export function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('visible');
}

export function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('visible');
}

/* ── Charger la liste des sessions (fetch autonome) ── */
export async function loadSessions(API_BASE, session, onSelectSession) {
  const container = document.getElementById('sessions-list');
  container.innerHTML = `
    <div class="sessions-loading">
      <div class="session-skeleton"></div>
      <div class="session-skeleton"></div>
      <div class="session-skeleton"></div>
    </div>`;

  try {
    const res = await fetch(`${API_BASE}/api/sessions`, {
      headers: { 'Authorization': `Bearer ${session.token}` },
    });
    if (!res.ok) { renderEmpty(container); return; }

    const sessions = await res.json();
    if (!sessions.length) { renderEmpty(container); return; }
    renderSessions(container, sessions, API_BASE, session, onSelectSession);
  } catch {
    container.innerHTML = `<div class="sessions-empty"><p>Erreur de chargement</p></div>`;
  }
}

function renderEmpty(container) {
  container.innerHTML = `
    <div class="sessions-empty">
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
      <p>Aucune conversation.<br>Créez-en une !</p>
    </div>`;
}

function renderSessions(container, sessions, API_BASE, session, onSelectSession) {
  container.innerHTML = `<div class="sessions-label">Conversations</div>`;
  sessions.forEach(s => {
    const item = createSessionItem(s, API_BASE, session, onSelectSession);
    container.appendChild(item);
  });
}

function createSessionItem(s, API_BASE, session, onSelectSession) {
  const item = document.createElement('div');
  item.className  = `session-item${s.id === currentSessionId ? ' active' : ''}`;
  item.dataset.id = s.id;

  const dateStr = formatDate(new Date(s.updated_at));

  item.innerHTML = `
    <div class="session-icon">
      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    </div>
    <div class="session-info">
      <div class="session-title">${escapeHtml(s.titre)}</div>
      <div class="session-date">${dateStr}</div>
    </div>
    <div class="session-actions">
      <button class="session-act-btn rename" title="Renommer" onclick="event.stopPropagation()">
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </button>
      <button class="session-act-btn del" title="Supprimer" onclick="event.stopPropagation()">
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>`;

  item.addEventListener('click', () => { onSelectSession(s.id, s.titre); closeSidebar(); });

  item.querySelector('.rename').addEventListener('click', e => {
    e.stopPropagation();
    startRename(item, s, API_BASE, session);
  });

  item.querySelector('.del').addEventListener('click', async e => {
    e.stopPropagation();
    if (!confirm(`Supprimer "${s.titre}" ?`)) return;
    await deleteSession(s.id, API_BASE, session, item, onSelectSession);
  });

  return item;
}

function startRename(item, s, API_BASE, session) {
  const infoEl    = item.querySelector('.session-info');
  const titleEl   = item.querySelector('.session-title');
  const actionsEl = item.querySelector('.session-actions');
  const oldTitle  = titleEl.textContent;

  actionsEl.style.display = 'none';

  const input = document.createElement('input');
  input.className = 'session-rename-input';
  input.value     = oldTitle;
  infoEl.replaceWith(input);
  input.focus();
  input.select();

  const save = async () => {
    const newTitle = input.value.trim() || oldTitle;
    try {
      const res = await fetch(`${API_BASE}/api/sessions/${s.id}`, {
        method:  'PATCH',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify({ titre: newTitle }),
      });
      if (res.ok) {
        titleEl.textContent = newTitle;
        if (s.id === currentSessionId) {
          const hdTitle = document.getElementById('hd-session-title');
          if (hdTitle) hdTitle.textContent = newTitle;
        }
      }
    } catch {}
    input.replaceWith(infoEl);
    actionsEl.style.display = '';
  };

  input.addEventListener('blur', save);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { input.value = oldTitle; input.blur(); }
  });
}

async function deleteSession(sessionId, API_BASE, session, item, onSelectSession) {
  try {
    await fetch(`${API_BASE}/api/sessions/${sessionId}`, {
      method:  'DELETE',
      headers: { 'Authorization': `Bearer ${session.token}` },
    });
    item.style.cssText += ';opacity:0;transform:translateX(-10px);transition:all 0.2s ease';
    setTimeout(() => {
      item.remove();
      if (sessionId === currentSessionId) { currentSessionId = null; onSelectSession(null, null); }
      const list = document.getElementById('sessions-list');
      if (list && list.querySelectorAll('.session-item').length === 0) renderEmpty(list);
    }, 200);
  } catch {}
}

/* ── Créer une nouvelle session (avec guard anti-double) ── */
export async function createNewSession(API_BASE, session, onSelectSession) {
  if (_creating) return;   // évite les doubles clics / double appels
  _creating = true;

  try {
    const res = await fetch(`${API_BASE}/api/sessions`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${session.token}`,
      },
      body: JSON.stringify({ titre: 'Nouvelle conversation' }),
    });

    if (!res.ok) {
      console.error('createNewSession failed:', res.status, await res.text());
      return;
    }

    const newSession = await res.json();

    const list  = document.getElementById('sessions-list');
    const empty = list.querySelector('.sessions-empty');
    if (empty) empty.remove();

    let label = list.querySelector('.sessions-label');
    if (!label) {
      label = document.createElement('div');
      label.className   = 'sessions-label';
      label.textContent = 'Conversations';
      list.prepend(label);
    }

    const item = createSessionItem(newSession, API_BASE, session, onSelectSession);
    label.after(item);

    onSelectSession(newSession.id, newSession.titre);
    closeSidebar();
  } catch (e) {
    console.error('createNewSession error:', e);
  } finally {
    _creating = false;
  }
}

/* ── Mettre en surbrillance la session active ── */
export function setActiveSession(sessionId) {
  currentSessionId = sessionId;
  document.querySelectorAll('.session-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id) === sessionId);
  });
}

/* ── Helpers ── */
function formatDate(date) {
  const diff = Date.now() - date;
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)   return "À l'instant";
  if (mins < 60)  return `Il y a ${mins} min`;
  if (hrs  < 24)  return `Il y a ${hrs}h`;
  if (days === 1) return 'Hier';
  if (days < 7)   return `Il y a ${days}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}