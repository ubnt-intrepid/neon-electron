const electron = require('electron');
const app = electron.app;
var BrowserWindow = electron.BrowserWindow;


app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

var mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width:800, height:600 });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
