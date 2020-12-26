const { app, BrowserWindow, ipcMain }  = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  console.log("HI");
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // Mac - returns darwin
    app.quit();
  }
});

ipcMain.on('test-it', (event, ... args) => {
  console.log(event);
  console.log(args);
  console.log("test-it");
  event.reply('test-it', {1: 11,});
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0)  {
    createWindow();
  }
});