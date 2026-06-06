/* ── auth.js ── */

export function switchTab(t) {
  const isLogin = t === 'login';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-register').classList.toggle('active', !isLogin);
  document.getElementById('tab-login').setAttribute('aria-selected', isLogin);
  document.getElementById('tab-register').setAttribute('aria-selected', !isLogin);
  document.getElementById('form-login').style.display    = isLogin ? 'block' : 'none';
  document.getElementById('form-register').style.display = isLogin ? 'none'  : 'block';
}

export function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className   = `form-alert ${type}`;
}

export function hideAlert(id) {
  const el = document.getElementById(id);
  el.className   = 'form-alert';
  el.textContent = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

export async function doRegister(API_BASE, onSuccess) {
  const btn  = document.getElementById('register-btn');
  const data = {
    username: document.getElementById('r-username').value.trim(),
    nom:      document.getElementById('r-nom').value.trim(),
    prenom:   document.getElementById('r-prenom').value.trim(),
    email:    document.getElementById('r-email').value.trim(),
    password: document.getElementById('r-password').value,
  };

  if (!data.username || !data.nom || !data.prenom || !data.email || !data.password) {
    showAlert('register-alert', 'Veuillez remplir tous les champs.', 'error'); return;
  }
  if (!isValidEmail(data.email)) {
    showAlert('register-alert', 'Adresse email invalide.', 'error');
    shakeField('r-email'); return;
  }
  if (data.password.length < 6) {
    showAlert('register-alert', 'Le mot de passe doit faire au moins 6 caractères.', 'error');
    shakeField('r-password'); return;
  }

  btn.disabled  = true;
  btn.innerHTML = '<span class="spin"></span>';

  try {
    const res  = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      showAlert('register-alert', json.detail || "Erreur lors de l'inscription.", 'error');
    } else {
      showAlert('register-alert', '✅ Compte créé ! Connectez-vous.', 'success');
      document.getElementById('l-username').value = data.username;
      setTimeout(() => switchTab('login'), 1800);
    }
  } catch {
    showAlert('register-alert', '❌ Serveur inaccessible.', 'error');
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Créer mon compte';
  }
}

export async function doLogin(API_BASE, session, onSuccess) {
  const btn   = document.getElementById('login-btn');
  const uname = document.getElementById('l-username').value.trim();
  const pass  = document.getElementById('l-password').value;

  if (!uname || !pass) {
    showAlert('login-alert', 'Veuillez remplir tous les champs.', 'error'); return;
  }

  btn.disabled  = true;
  btn.innerHTML = '<span class="spin"></span>';

  try {
    const res  = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: uname, password: pass }),
    });
    const json = await res.json();

    if (!res.ok) {
      showAlert('login-alert', json.detail || 'Identifiants incorrects.', 'error');
      shakeField('l-password');
    } else {
      session.token = json.access_token;
      try {
        const payload = JSON.parse(atob(session.token.split('.')[1]));
        session.userId = parseInt(payload.sub) || 1;
      } catch { session.userId = 1; }
      session.username = uname;
      localStorage.setItem('rd_token', session.token);
      localStorage.setItem('rd_uid',   session.userId);
      localStorage.setItem('rd_user',  session.username);
      hideAlert('login-alert');
      onSuccess();
    }
  } catch {
    showAlert('login-alert', '❌ Serveur inaccessible.', 'error');
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Se connecter';
  }
}

export function doLogout(session, onSuccess) {
  localStorage.removeItem('rd_token');
  localStorage.removeItem('rd_uid');
  localStorage.removeItem('rd_user');
  session.token    = null;
  session.userId   = 0;
  session.username = '';
  onSuccess();
}