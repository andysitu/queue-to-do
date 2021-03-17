const { app, BrowserWindow, ipcMain }  = require('electron');

const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database('todo_db.db');

const  dbService = require('./dbService')(db);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  });
  win.loadFile('index.html');
  dbService.check_db();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // Mac - returns darwin
    console.log("exit");
    db.close();
    app.exit(0);
  }
});

const mainRouter = require("./route/mainRouter");
mainRouter.loadRouter(dbService);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0)  {
    createWindow();
  }
});