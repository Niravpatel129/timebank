const { app, BrowserWindow, Tray, nativeImage } = require('electron');
const path = require('path');
const url = require('url');

let tray = null;
let window = null;

function createWindow() {
  window = new BrowserWindow({
    width: 300,
    height: 500,
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    opacity: 1,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html file or the webpack dev server URL
  const startUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : url.format({
          pathname: path.join(__dirname, 'dist', 'index.html'),
          protocol: 'file:',
          slashes: true,
        });

  window.loadURL(startUrl);

  // Open the DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools({ mode: 'detach' });
  }

  window.on('blur', () => {
    window.hide();
  });
}

function createTray() {
  const icon = nativeImage
    .createFromPath(path.join(__dirname, 'assets', 'tray-icon.png'))
    .resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip('Time Tracker');

  tray.on('click', (event, bounds) => {
    const { x, y } = bounds;
    const { height, width } = window.getBounds();
    window.setBounds({
      x: x - width / 2,
      y: y,
      height,
      width,
    });
    window.isVisible() ? window.hide() : window.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.dock.hide(); // This will hide the app from the Dock

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Enable hot reloading in development
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true,
    });
  } catch (_) {
    console.log('Error');
  }
}
