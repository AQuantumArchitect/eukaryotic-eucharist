const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 480,
    minHeight: 320,
    title: 'Eukaryotic Eucharist',
    backgroundColor: '#050611',  // prevents white flash on load
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // file:// + ES6 module imports work natively in Electron's Chromium renderer
  win.loadFile(path.join(__dirname, 'game', 'index.html'));
  win.setMenuBarVisibility(false);

  // Block navigation away from the game
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) event.preventDefault();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // macOS: re-create window when dock icon clicked with no windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
