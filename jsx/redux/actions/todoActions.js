export const getTodos = () => ({
  type: "todo/getAll"
});

export const loadTodos = (todo_list) => ({
  type: "todo/load",
  payload: todo_list
});

const extract_data_to_todo = (data) => {
  return {
    todo_id: data.todo_id,
    todo_name: data.todo_name,
    tasks: [],
  }
}
const extract_data_to_task = (data) => {
  return {
    task_name: data.task_name,
    task_id: data.task_id,
  }
}

export function fetchTodos() {
  return async(dispatch) => {
    ipcRenderer.send("get-todo");
    ipcRenderer.once("get-todo", (event, data) => {
      let todo_list = [], 
          todo_map = {},
          index, todo;

      for (let i=0; i<data.length; i++) {
        if (!(data[i].todo_id in todo_map)) {
          todo_map[data[i].todo_id] = todo_list.length;
          todo = this.extract_data_to_todo(data[i]);
          if (data[i].task_id !== null) {
            todo.tasks.push(this.extract_data_to_task(data[i]));
          }

          todo_list.push(todo);
        } else {
          if (data[i].task_id !== null) {
            index = todo_map[data[i].todo_id];
            todo_list[index].tasks.push(this.extract_data_to_task(data[i]));
          }
        }
      }
      dispatch(loadTodos());
    });
  }
}