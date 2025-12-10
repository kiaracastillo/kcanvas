// electron/preload.js
// Aquí podrías exponer APIs seguras al renderer (React)
window.electronAPI = {
  sendMessage: (msg) => console.log("Mensaje desde Electron:", msg),
};
