const fs = require('fs');

interface TodoState {
  showMultipleTasks: boolean,
  todo_id: number,
}

const lstorage = {
  todo_settings_key: "todo_settings",
  gApiFilename: "g_settings.json",
  saveSettingsFromTodoList(todo_list: Array<TodoState>) {
    let settings = {};
    todo_list.forEach(todo => {
      settings[todo.todo_id] ={};
      settings[todo.todo_id].showMultipleTasks = todo.showMultipleTasks;
    });
    localStorage.setItem(this.todo_settings_key, JSON.stringify(settings));
  },
  saveSettings(settings) {
    localStorage.setItem(this.todo_settings_key, JSON.stringify(settings));
  },
  getSettings() {
    return JSON.parse(localStorage.getItem(this.todo_settings_key));
  },
  loadGCredentials(callback) {
    fs.readFile(this.gApiFilename, {encoding: 'utf-8'}, function(err, jsonData) {
      console.log(jsonData);
      if (callback) {
        callback(JSON.parse(jsonData));
      }
    });
  },
  saveGCredentials(data, callback) {
    if (data.apiKey && data.clientId) {
      if (!callback) {
        callback = ()=>{};
      }
      fs.writeFile(this.gApiFilename, JSON.stringify(data), 'utf-8', callback);
    }
    
  }
};