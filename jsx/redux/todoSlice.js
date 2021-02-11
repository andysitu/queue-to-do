const { createSlice } = require('@reduxjs/toolkit');
const {ipcRenderer} = require('electron');

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

export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todo_list: [],
  },
  reducers: {
    setTodo: (state, action) => {
      state.todo_list = action.payload;
    },
    deleteTodo: (state, action) => {
      state.todo_list.splice(action.payload.index, 1);
    },
    addTodo: (state, action) => {
      state.todo_list.push(action.payload);
    },
    editTodo: (state, action) => {
      if (action.payload.property == "name") {
        state.todo_list[action.payload.index].todo_name = action.payload.value;
      }
    },
    addTask: (state, action) => {
      state.todo_list[action.payload.index].tasks.unshift(action.payload.task);
    },
    editTask: (state, action) => {
      if (action.payload.property == "name") {
        state.todo_list[action.payload.todo_index]
          .tasks[action.payload.index].task_name = action.payload.value;
      }
    },
    deleteTask: (state, action) => {
      state.todo_list[action.payload.todo_index].tasks.splice(
        action.payload.task_index, 1);
    },
    switchTasks: (state, action) => {
      const tasks = state.todo_list[action.payload.todo_index]
                      .tasks;
      const item1 = tasks[action.payload.task1_index];
      const item2 = tasks[action.payload.task2_index];

      // switch task_order property
      state.todo_list[action.payload.todo_index]
        .tasks[action.payload.task1_index].task_order = item2.task_order;
      state.todo_list[action.payload.todo_index]
        .tasks[action.payload.task2_index].task_order = item1.task_order;
      // switch tasks
      state.todo_list[action.payload.todo_index]
        .tasks[action.payload.task1_index] = item2;
      state.todo_list[action.payload.todo_index]
        .tasks[action.payload.task2_index] = item1;
    },
    toggleShowMultipleTasks: (state, action) => {
      state.todo_list[action.payload.todo_index].showMultipleTasks = 
        !state.todo_list[action.payload.todo_index].showMultipleTasks;
    },
  }
});

export const { setTodo, deleteTodo, addTodo, editTodo,
                addTask, editTask, deleteTask,
                switchTasks, toggleShowMultipleTasks
              } = todoSlice.actions

export default todoSlice.reducer

export const selectTest = state => state.todo.test;

export const selectTodoList = state => state.todo.todo_list;