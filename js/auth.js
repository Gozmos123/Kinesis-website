// ============================================================
// Shared auth logic — runs on every page that includes it.
// Handles: nav login-state UI, sign up, log in, log out, profile.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. Keep the nav in sync with login state ----------
  const loggedOutBox = document.getElementById('navAuthLoggedOut');
  const loggedInBox = document.getElementById('navAuthLoggedIn');
  const navInitial = document.getElementById('navAvatarInitial');
  const navUserName = document.getElementById('navUserName');

  auth.onAuthStateChanged((user) => {
    if (user) {
      if (loggedOutBox) loggedOutBox.style.display = 'none';
      if (loggedInBox) loggedInBox.style.display = 'flex';
      const name = user.displayName || user.email.split('@')[0];
      if (navInitial) navInitial.textContent = name.charAt(0).toUpperCase();
      if (navUserName) navUserName.textContent = name;
    } else {
      if (loggedOutBox) loggedOutBox.style.display = 'flex';
      if (loggedInBox) loggedInBox.style.display = 'none';
    }
  });

  // ---------- 2. Logout button (present in nav + profile page) ----------
  document.querySelectorAll('.logoutBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await auth.signOut();
      window.location.href = 'index.html';
    });
  });

  // ---------- 3. Sign Up form ----------
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const status = document.getElementById('authStatus');
      const btn = signupForm.querySelector('button[type="submit"]');

      status.textContent = 'Creating your account...';
      status.className = 'form-status pending';
      btn.disabled = true;

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });
        await db.collection('users').doc(cred.user.uid).set({
          name: name,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        status.textContent = 'Account created! Redirecting...';
        status.className = 'form-status ok';
        window.location.href = 'dashboard.html';
      } catch (err) {
        status.textContent = friendlyError(err);
        status.className = 'form-status err';
        btn.disabled = false;
      }
    });
  }

  // ---------- 4. Log In form ----------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const status = document.getElementById('authStatus');
      const btn = loginForm.querySelector('button[type="submit"]');

      status.textContent = 'Logging in...';
      status.className = 'form-status pending';
      btn.disabled = true;

      try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = 'dashboard.html';
      } catch (err) {
        status.textContent = friendlyError(err);
        status.className = 'form-status err';
        btn.disabled = false;
      }
    });
  }

  // ---------- 5. Profile page (protected) ----------
  const profileCard = document.getElementById('profileCard');
  if (profileCard) {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      const name = user.displayName || user.email.split('@')[0];
      document.getElementById('profileInitial').textContent = name.charAt(0).toUpperCase();
      document.getElementById('profileName').textContent = name;
      document.getElementById('profileEmail').textContent = user.email;

      try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists && doc.data().createdAt) {
          const date = doc.data().createdAt.toDate();
          document.getElementById('profileJoined').textContent =
            'Member since ' + date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } else {
          document.getElementById('profileJoined').textContent = '';
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
});

function friendlyError(err) {
  const map = {
    'auth/email-already-in-use': 'That email is already registered — try logging in instead.',
    'auth/invalid-email': 'That email address doesn\'t look right.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password. Try again.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/network-request-failed': 'Network error — check your connection.'
  };
  return map[err.code] || ('Something went wrong: ' + err.message);
}
