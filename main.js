const { app, BrowserWindow, ipcMain }  = require('electron');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const  dbService = require('./dbService')(db);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  win.loadFile('index.html');
  dbService.check_db();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // Mac - returns darwin
    app.quit();
    db.close();
  }
});

ipcMain.on('test-it', (event, ... args) => {
  // console.log(args);
  console.log("test-it");
  event.reply('test-it', {1: 11,});
});

ipcMain.on("get-todo", (event) => {
  dbService.get_todos();
});

ipcMain.on("create-todo", (event, ...args) => {
  if (args.length > 0) {
    dbService.create_todo(args[0].name);
  }
  console.log("create", args);
  event.reply("create-todo", {name: args.name,})
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0)  {
    createWindow();
  }
});