// script.js — shared boot code loaded by every page
// Add <script src="js/script.js" defer></script> at the end of each page's <body>.

// === Service Worker registration (makes the app offline-capable) ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  });
}

// === Online/offline status chip (any page that has #status-chip + #offline-banner) ===
function updateConnectivityUI() {
  const chip = document.getElementById('status-chip');
  const banner = document.getElementById('offline-banner');
  const online = navigator.onLine;
  if (chip) chip.textContent = online ? '● Online' : '✈ Offline';
  if (banner) banner.classList.toggle('hidden', online);
}
window.addEventListener('online', updateConnectivityUI);
window.addEventListener('offline', updateConnectivityUI);
document.addEventListener('DOMContentLoaded', updateConnectivityUI);

// === Keyboard shortcut: press "/" from anywhere to focus the search bar ===
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    const search = document.getElementById('searchBar');
    if (search) { e.preventDefault(); search.focus(); }
  }
});

// === Install prompt — Chrome will offer "Add to Home Screen" ===
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  console.log('App is installable — call window.installApp() to prompt');
});
window.installApp = async () => {
  if (!deferredInstallPrompt) { alert('Already installed or not supported'); return; }
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  console.log('Install prompt result:', outcome);
  deferredInstallPrompt = null;
};