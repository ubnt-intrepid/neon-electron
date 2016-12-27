const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const join = require('path').join;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

var mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width:800, height:600 });
  mainWindow.loadURL('file://' + join(__dirname, '..', 'renderer', 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
