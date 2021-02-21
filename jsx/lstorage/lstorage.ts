interface TodoState {
  showMultipleTasks: boolean,
  todo_id: number,
}

const lstorage = {
  multipleTasksIds_key: "multipleTasksIds",
  todo_settings_key: "todo_settings",
  getMultipleTasks() {
    const ids = JSON.parse(localStorage.getItem(this.multipleTasksIds_key));
    if (ids == null) return [];
    return ids;
  },
  saveMultipleTasks(task_ids) {
    localStorage.setItem(this.multipleTasksIds_key, JSON.stringify(task_ids))
  },
  saveSettings(todo_list: Array<TodoState>) {
    let settings = {};
    todo_list.forEach(todo => {
      settings[todo.todo_id] ={};
      settings[todo.todo_id].showMultipleTasks = todo.showMultipleTasks;
    });
    localStorage.setItem(this.todo_settings_key, JSON.stringify(settings));
  },
  getSettings() {
    return JSON.parse(localStorage.getItem(this.todo_settings_key));
  }
};