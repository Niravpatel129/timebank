const { ipcMain, Notification, BrowserWindow } = require('electron');

class TimerManager {
  constructor(tray) {
    this.time = 0;
    this.tray = tray;
    this.timerInterval = null;
    this.currentTask = null;
    this.uncompletedTasksCount = 0;

    this.setupIpcListeners();
  }

  setupIpcListeners() {
    console.log('🚀  setupIpcListeners:');
    ipcMain.on('start-timer', this.startTimer.bind(this));
    ipcMain.on('stop-timer', this.stopTimer.bind(this));
    ipcMain.on('reset-timer', this.resetTimer.bind(this));
    ipcMain.on('update-uncompleted-tasks', this.updateUncompletedTasks.bind(this));
    ipcMain.on('update-tray-title', this.updateTrayTitleFromRenderer.bind(this));
    ipcMain.on('get-current-task', this.getCurrentTask.bind(this));
    ipcMain.on('set-current-task', this.setCurrentTask.bind(this));
    ipcMain.on('start-active-task', this.startActiveTask.bind(this));
    ipcMain.on('pause-active-task', this.pauseActiveTask.bind(this));
  }

  startActiveTask(event, task) {
    // reply with the current task
    // event.reply('start-active-task', this.currentTask);

    // send the current task to all windows
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('start-active-task', this.currentTask);
    });
  }

  pauseActiveTask(event, task) {
    // reply with the current task
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('pause-active-task', { ...this.currentTask, time: this.time });
    });
  }

  startTimer(event, task) {
    this.currentTask = task;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.currentTask.isCountingUp) {
        this.currentTask.timeSpent += 1;
      } else {
        this.currentTask.timeRemaining = Math.max(0, this.currentTask.timeRemaining - 1);
      }

      // Broadcast timer update to all windows
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('timer-update', this.currentTask);
      });

      this.updateTrayTitle();

      if (this.currentTask.timeRemaining === 0 && !this.currentTask.isCountingUp) {
        this.stopTimer();
        new Notification({
          title: "Time's up!",
          body: `Time's up for task: ${this.currentTask.name}`,
        }).show();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.updateTrayTitle();

    // Broadcast stop timer to all windows
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('timer-stopped', this.currentTask);
    });
  }

  resetTimer(event, task) {
    this.currentTask = task;
    this.stopTimer();

    // Broadcast reset timer to all windows
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('timer-reset', this.currentTask);
    });
  }

  updateUncompletedTasks(event, count) {
    this.uncompletedTasksCount = count;
    this.updateTrayTitle();
  }

  updateTrayTitle() {
    if (!this.timerInterval) {
      if (this.uncompletedTasksCount > 0) {
        this.tray.setTitle(
          `${this.uncompletedTasksCount} ${this.uncompletedTasksCount > 1 ? 'Tasks' : 'Task'}`,
        );
      } else {
        this.tray.setTitle('');
      }
    } else {
      const time = this.currentTask.isCountingUp
        ? this.currentTask.timeSpent
        : this.currentTask.timeRemaining;
      const minutes = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (time % 60).toString().padStart(2, '0');
      this.tray.setTitle(`${minutes}:${seconds}`);
    }
  }

  updateTrayTitleFromRenderer(event, time) {
    // make sure valid time is passed
    if (typeof time !== 'number' || time < 0) {
      return;
    }
    this.time = time;

    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    this.tray.setTitle(`${minutes}:${seconds}`);

    // emit the time to all windows
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('timer-update', time);
    });
  }

  getCurrentTask(event) {
    event.reply('current-task', this.currentTask);
  }

  setCurrentTask(event, task) {
    this.currentTask = task;
    event.reply('current-task-set', this.currentTask);

    // Broadcast current task update to all windows
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('current-task-updated', this.currentTask);
    });
  }
}

module.exports = TimerManager;
