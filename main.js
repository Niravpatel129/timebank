const {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  Menu,
  globalShortcut,
  dialog,
  Notification,
} = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');
const TimerManager = require('./utils/timerManager');

let tray = null;
let mainWindow = null;
let settingsWindow = null;
let timerManager = null;

// Configure logging for autoUpdater
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Set app icon
app.dock.setIcon(path.join(__dirname, 'icon.icns'));

function checkForUpdates() {
  console.log('Checking for updates...');
  autoUpdater.logger.info('Checking for updates...');

  autoUpdater
    .checkForUpdatesAndNotify()
    .then((result) => {
      if (result === null) {
        dialog.showMessageBox({
          type: 'info',
          title: 'No Updates Available',
          message: 'You are using the latest version of the application.',
        });
      }
    })
    .catch((error) => {
      console.error('Error checking for updates:', error);
      autoUpdater.logger.error('Error checking for updates:', error);
    });
}

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
    icon: path.join(__dirname, 'assets', 'icon.icns'),
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
    icon: path.join(__dirname, 'assets', 'icon.icns'),
  });

  const settingsUrl = url.format({
    pathname: path.join(__dirname, 'dist', 'settings.html'),
    protocol: 'file:',
    slashes: true,
  });

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
  tray.setTitle('');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Settings', click: () => settingsWindow.show() },
    { label: 'Check for Updates', click: () => checkForUpdates() },
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

  timerManager = new TimerManager(tray);
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
    mainWindow.setSize(400, 1);
    mainWindow.show();
    setTimeout(() => {
      mainWindow.hide();
      mainWindow.setSize(400, 710);
    }, 100);

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

ipcMain.on('show-settings', () => {
  settingsWindow.show();
});

ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdatesAndNotify();
    return { updateAvailable: !!result };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return { error: error.message };
  }
});

ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});

// Auto-updater events
autoUpdater.on('update-available', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update available',
      message: 'A new version of Timebank is available. Do you want to update now?',
      buttons: ['Update', 'Later'],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update ready',
      message: 'Install and restart now?',
      buttons: ['Yes', 'Later'],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall(false, true);
      }
    });
});

autoUpdater.on('error', (err) => {
  dialog.showErrorBox('Error: ', err == null ? 'unknown' : (err.stack || err).toString());
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
