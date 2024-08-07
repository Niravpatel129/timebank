const { app, BrowserWindow, Tray, nativeImage, Menu, globalShortcut } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');

let tray = null;
let mainWindow = null;
let settingsWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 710,
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    visualEffectState: 'active',
    opacity: 0.98,
    backgroundColor: '#15093d',
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

  mainWindow.loadURL(startUrl);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.setSize(400, 1);
    mainWindow.show();
    setTimeout(() => {
      mainWindow.hide();
      mainWindow.setSize(400, 710);
    }, 100);
  });

  mainWindow.on('blur', () => {
    mainWindow.hide();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    frame: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const settingsUrl = url.format({
    pathname: path.join(__dirname, 'dist', 'settings.html'),
    protocol: 'file:',
    slashes: true,
  });

  // settingsWindow.loadURL();

  settingsWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      settingsWindow.hide();
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
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Settings', click: () => settingsWindow.show() },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.on('click', (event, bounds) => {
    const { x, y } = bounds;
    const { height, width } = mainWindow.getBounds();

    const yPosition = process.platform === 'darwin' ? y : y - height;

    mainWindow.setBounds({
      x: Math.round(x - width / 2),
      y: Math.round(yPosition),
      height,
      width,
    });

    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}

function cleanup() {
  if (tray) {
    tray.destroy();
  }
  if (mainWindow) {
    mainWindow.destroy();
  }
  if (settingsWindow) {
    settingsWindow.destroy();
  }
}

app.whenReady().then(() => {
  setTimeout(() => {
    createMainWindow();
    createSettingsWindow();
    createTray();

    if (process.env.NODE_ENV === 'development') {
      globalShortcut.register('CommandOrControl+Q', () => {
        cleanup();
        app.quit();
      });
    }
  }, 1000);
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

ipcMain.on('quit-app', () => {
  app.quit();
});

// show-settings
ipcMain.on('show-settings', () => {
  settingsWindow.show();
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
