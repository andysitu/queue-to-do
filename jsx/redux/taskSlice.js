const { createSlice } = require('@reduxjs/toolkit');
const {ipcRenderer} = require('electron');

export const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks_dict: {}, // [todo_id] : [Array of tasks]
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks_dict = action.payload;
    },
    createdTodo: (state, action) => {
      state.tasks_dict[action.payload.todo_id] = [];
    },
    addTask: (state, action) => {
      state.tasks_dict[action.payload.todo_id].push(action.payload.task);
    },
    editTask: (state, action) => {
      if (action.payload.property == "name") {
        state.tasks_dict[action.payload.todo_id][action.payload.task_index]
          .task_name = action.payload.value;
      }
    },
    deleteTask: (state, action) => {
      state.tasks_dict[action.payload.todo_id].splice(
        action.payload.task_index, 1);
    },
    switchTasks: (state, action) => {
      const tasks = state.tasks_dict[action.payload.todo_id];
      const item1 = tasks[action.payload.task1_index];
      const item2 = tasks[action.payload.task2_index];

      // switch task_order property
      state.tasks_dict[action.payload.todo_id][action.payload.task1_index]
        .task_order = item2.task_order;
      state.tasks_dict[action.payload.todo_id][action.payload.task2_index]
        .task_order = item1.task_order;
      // switch tasks
      state.tasks_dict[action.payload.todo_id][action.payload.task1_index] 
        = item2;
      state.tasks_dict[action.payload.todo_id][action.payload.task2_index] 
        = item1;
    },
    completeTask: (state, action) => {
      const todo_id = action.payload.todo_id,
            task_index = action.payload.task_index
      state.tasks_dict[todo_id][task_index].done =
        (state.tasks_dict[todo_id][task_index].done == 0) ?
        1: 0;
    }
  }
});

export const { addTask, editTask, deleteTask,
                switchTasks, completeTask, setTasks,
                createdTodo
              } = taskSlice.actions

export default taskSlice.reducer

export const selectTaskDict = state => state.task.tasks_dict;