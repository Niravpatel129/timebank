const { ipcMain, Notification, BrowserWindow } = require('electron');

class TimerManager {
  constructor(tray) {
    this.tray = tray;
    this.activeTimers = new Map();
    this.currentTask = null;
    this.uncompletedTasksCount = 0;

    this.setupIpcListeners();
  }

  setupIpcListeners() {
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

  startTimer(event, task) {
    this.currentTask = task;
    if (this.activeTimers.has(task._id)) {
      clearInterval(this.activeTimers.get(task._id));
    }

    const intervalId = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(task.timerState.startTime).getTime()) / 1000,
      );
      const newRemainingTime = Math.max(0, task.timerState.remainingTime - elapsedSeconds);

      this.updateTrayTitle(newRemainingTime);

      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('timer-update', newRemainingTime);
      });

      if (newRemainingTime <= 0) {
        this.stopTimer(event, task._id);
        this.showNotification("Time's up!", `Time's up for task: ${task.name}`);
        BrowserWindow.getAllWindows().forEach((window) => {
          window.webContents.send('timer-finished', task._id);
        });
      }
    }, 1000);

    this.activeTimers.set(task._id, intervalId);
  }

  stopTimer(event, taskId) {
    if (this.activeTimers.has(taskId)) {
      clearInterval(this.activeTimers.get(taskId));
      this.activeTimers.delete(taskId);
    }
    this.updateTrayTitle();
  }

  resetTimer(event, task) {
    this.stopTimer(event, task._id);
    this.currentTask = task;
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('timer-reset', this.currentTask);
    });
  }

  updateUncompletedTasks(event, count) {
    this.uncompletedTasksCount = count;
    this.updateTrayTitle();
  }

  updateTrayTitle(time) {
    if (time === undefined) {
      if (this.uncompletedTasksCount > 0) {
        this.tray.setTitle(
          `${this.uncompletedTasksCount} ${this.uncompletedTasksCount > 1 ? 'Tasks' : 'Task'}`,
        );
      } else {
        this.tray.setTitle('');
      }
    } else {
      const minutes = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (time % 60).toString().padStart(2, '0');
      this.tray.setTitle(`${minutes}:${seconds}`);
    }
  }

  updateTrayTitleFromRenderer(event, time) {
    if (typeof time !== 'number') {
      return;
    }
    this.updateTrayTitle(time);
  }

  getCurrentTask(event) {
    event.reply('current-task', this.currentTask);
  }

  setCurrentTask(event, task) {
    this.currentTask = task;
    event.reply('current-task-set', this.currentTask);
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('current-task-updated', this.currentTask);
    });
  }

  startActiveTask(event, task) {
    this.startTimer(event, task);
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('start-active-task', this.currentTask);
    });
  }

  pauseActiveTask(event, task) {
    this.stopTimer(event, task._id);
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('pause-active-task', { ...this.currentTask, time: task.time });
    });
  }

  showNotification(title, body) {
    const notification = new Notification({ title, body });
    notification.show();
  }
}

module.exports = TimerManager;
