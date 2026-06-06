/* ── chat.js ── */
import { getCurrentSessionId } from './sidebar.js';

const BOT_NAME   = 'Nexus';
const BOT_AVATAR = 'NX';

let isSending = false;

export function setWelcomeTime() {
  const el = document.getElementById('welcome-time');
  if (!el) return;
  const d      = new Date();
  const days   = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  el.textContent = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ── Charger l'historique d'une session ── */
export async function loadHistory(API_BASE, token, sessionId) {
  resetMessages();
  try {
    const res      = await fetch(`${API_BASE}/api/sessions/${sessionId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const messages = await res.json();
    messages.forEach(m => addMsg(m.content, m.role === 'user' ? 'user' : 'bot', false));
    scrollBottom();
  } catch {}
}

/* ── Envoyer un message ── */
export async function sendMsg(API_BASE, session) {
  if (isSending) return;

  const sessionId = getCurrentSessionId();
  if (!sessionId) {
    addMsg('⚠️ Sélectionnez ou créez une conversation dans la barre latérale.', 'bot');
    return;
  }

  const input = document.getElementById('msg-input');
  const msg   = input.value.trim();
  if (!msg) return;

  isSending = true;
  addMsg(msg, 'user');
  input.value = '';
  resizeTextarea(input);

  const typingId = addTyping();
  document.getElementById('send-btn').disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${session.token}`,
      },
      body: JSON.stringify({ session_id: sessionId, message: msg }),
    });

    removeTyping(typingId);

    if (res.status === 401) { window.doLogout(); return; }

    const data = await res.json();
    addMsg(data.response || data.detail || 'Erreur inattendue.', 'bot');
  } catch {
    removeTyping(typingId);
    addMsg('❌ Impossible de contacter le serveur.', 'bot');
  } finally {
    document.getElementById('send-btn').disabled = false;
    isSending = false;
  }
}

/* ── Ajouter un message ── */
export function addMsg(text, type, animate = true) {
  const username = window.__session?.username || 'Vous';
  const box    = document.getElementById('messages');
  const row    = document.createElement('div');
  row.className = `msg-row ${type === 'user' ? 'user' : ''}`;
  if (!animate) row.style.animation = 'none';

  const av       = document.createElement('div');
  av.className   = `msg-av ${type === 'user' ? 'me' : 'bot'}`;
  av.textContent = type === 'user' ? (username[0] || 'U').toUpperCase() : BOT_AVATAR;
  av.setAttribute('aria-hidden', 'true');

  const body     = document.createElement('div');
  body.className = 'msg-body';

  const meta       = document.createElement('div');
  meta.className   = 'msg-meta';
  meta.textContent = type === 'user' ? username : BOT_NAME;

  const bubble       = document.createElement('div');
  bubble.className   = `msg-bubble ${type === 'user' ? 'user' : 'bot'}`;
  bubble.textContent = text;

  body.appendChild(meta);
  body.appendChild(bubble);
  row.appendChild(av);
  row.appendChild(body);
  box.appendChild(row);
  scrollBottom();
}

/* ── Typing indicator ── */
export function addTyping() {
  const id  = `ty_${Date.now()}`;
  const box = document.getElementById('messages');
  const row = document.createElement('div');
  row.className = 'msg-row';
  row.id        = id;
  row.setAttribute('aria-label', `${BOT_NAME} est en train d'écrire`);
  row.innerHTML = `
    <div class="msg-av bot" aria-hidden="true">${BOT_AVATAR}</div>
    <div class="msg-body">
      <div class="msg-meta">${BOT_NAME}</div>
      <div class="msg-bubble bot">
        <div class="typing-wrap" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>`;
  box.appendChild(row);
  scrollBottom();
  return id;
}

export function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/* ── Reset ── */
export function resetMessages(username = '') {
  const box = document.getElementById('messages');
  box.innerHTML = `
    <div class="welcome">
      <div class="welcome-time" id="welcome-time">Aujourd'hui</div>
      <h2>Bonjour, comment puis-je vous aider ?</h2>
      <p>Je suis <strong style="color:var(--accent);font-family:'Syne',sans-serif;">${BOT_NAME}</strong>, votre chatbot personnel</p>
    </div>
    <div class="msg-row">
      <div class="msg-av bot" aria-hidden="true">${BOT_AVATAR}</div>
      <div class="msg-body">
        <div class="msg-meta">${BOT_NAME}</div>
        <div class="msg-bubble bot">👋 Bienvenue ! Posez-moi vos questions, je suis là pour vous aider.</div>
      </div>
    </div>`;
  setWelcomeTime();
}

/* ── Auto-resize textarea ── */
export function resizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

export function useChip(text) {
  const input = document.getElementById('msg-input');
  input.value = text;
  input.focus();
  resizeTextarea(input);
}

function scrollBottom() {
  const box = document.getElementById('messages');
  box.scrollTop = box.scrollHeight;
}