const { app, BrowserWindow, Tray, nativeImage } = require('electron');
const path = require('path');

let tray = null;
let window = null;

function createWindow() {
  window = new BrowserWindow({
    width: 300,
    height: 400,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadFile('index.html');

  window.on('blur', () => {
    window.hide();
  });
}

function createTray() {
  const icon = nativeImage
    .createFromPath(path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.png'))
    .resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip('Todo List');

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
