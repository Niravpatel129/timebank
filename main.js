const { app, BrowserWindow, Tray, nativeImage, Menu, globalShortcut } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');

let tray = null;
let window = null;

function createWindow() {
  window = new BrowserWindow({
    width: 400,
    height: 700,
    show: true,
    frame: false,
    resizable: false,
    transparent: true,
    // vibrancy: 'under-window',
    visualEffectState: 'active',
    opacity: 0.98,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : url.format({
          pathname: path.join(__dirname, 'dist', 'index.html'),
          protocol: 'file:',
          slashes: true,
        });

  window.loadURL(startUrl);

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools({ mode: 'detach' });
  }

  ipcMain.on('quit-app', () => {
    app.quit();
  });

  window.on('blur', () => {
    window.hide();
  });

  window.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      window.hide();
    }
    return false;
  });
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'trayIconTemplate.png'));
  icon.setTemplateImage(true);

  tray = new Tray(icon);
  tray.setToolTip('Time Tracker');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => window.show() },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  // tray.setContextMenu(contextMenu);

  tray.on('click', (event, bounds) => {
    const { x, y } = bounds;
    const { height, width } = window.getBounds();

    const yPosition = process.platform === 'darwin' ? y : y - height;

    window.setBounds({
      x: Math.round(x - width / 2),
      y: Math.round(yPosition),
      height,
      width,
    });

    window.isVisible() ? window.hide() : window.show();
  });

  tray.on('right-click', (event, bounds) => {
    tray.popUpContextMenu();
  });
}

function cleanup() {
  if (tray) {
    tray.destroy();
  }
  if (window) {
    window.destroy();
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  if (process.env.NODE_ENV === 'development') {
    globalShortcut.register('CommandOrControl+Q', () => {
      cleanup();
      app.quit();
    });
  }
});

app.dock.hide();

app.on('before-quit', cleanup);

app.on('will-quit', cleanup);

app.on('window-all-closed', () => {
  if (tray) {
    tray.destroy();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

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
