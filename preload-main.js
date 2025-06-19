(() => {
  const arg = process.argv.find(a => a.startsWith('--session='));
  if (!arg) return;

  const sessionStr = decodeURIComponent(arg.split('=')[1]);

  window.addEventListener('DOMContentLoaded', () => {
    try {
      localStorage.setItem('session', sessionStr);
      document.cookie = `session=${encodeURIComponent(sessionStr)}; path=/`;
      console.log('[preload] ✅ Session set in localStorage and cookie');
    } catch (err) {
      console.error('[preload] ❌ Failed to set session:', err);
    }
  });
})();

const { ipcRenderer } = require('electron');
window.electronAPI = {
  openExternal: (url) => ipcRenderer.send('open-external-url', url)
};