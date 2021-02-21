const lstorage = {
  multipleTasksIds_key: "multipleTasksIds",
  getMultipleTasks() {
    const ids = JSON.parse(localStorage.getItem(this.multipleTasksIds_key));
    if (ids == null) return [];
    return ids;
  },
  saveMultipleTasks(task_ids) {
    localStorage.setItem(this.multipleTasksIds_key, JSON.parse(task_ids))
  }
};