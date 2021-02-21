const { createSlice } = require('@reduxjs/toolkit');
const {ipcRenderer} = require('electron');

export const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks_dict: {}, // [todo_id] : [Array of tasks]
    complete_tasks: {}, // [todo_id] : [Array of tasks]
    incomplete_tasks: {} // [todo_id] : [Array of tasks]
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks_dict = action.payload.tasks_dict;
      state.complete_tasks = action.payload.complete_tasks;
      state.incomplete_tasks = action.payload.incomplete_tasks;
    },
    createdTodo: (state, action) => {
      state.tasks_dict[action.payload.todo_id] = [];
      state.complete_tasks[action.payload.todo_id] = [];
      state.incomplete_tasks[action.payload.todo_id] = [];
    },
    createTask: (state, action) => {
      state.incomplete_tasks[action.payload.todo_id].push(action.payload.task);
    },
    editTask: (state, action) => {
      const task_dict_name = (action.payload.task_type == "complete") ?
        "complete_tasks" : "incomplete_tasks";
      if (action.payload.property == "name") {
        state[task_dict_name][action.payload.todo_id][action.payload.task_index]
          .task_name = action.payload.value;
      }
    },
    deleteTask: (state, action) => {
      if (action.payload.task_type == "complete") {
        state.complete_tasks[action.payload.todo_id].splice(
          action.payload.task_index, 1);  
      } else {
        state.incomplete_tasks[action.payload.todo_id].splice(
          action.payload.task_index, 1);
      }
    },
    switchTasks: (state, action) => {
      const task_dict_name = (action.payload.task_type == "complete") ?
        "complete_tasks" : "incomplete_tasks";
      const tasks = state[task_dict_name][action.payload.todo_id];
      const item1 = tasks[action.payload.task1_index];
      const item2 = tasks[action.payload.task2_index];

      // switch task_order property
      state.state[task_dict_name][action.payload.todo_id][action.payload.task1_index]
        .task_order = item2.task_order;
      state.state[task_dict_name][action.payload.todo_id][action.payload.task2_index]
        .task_order = item1.task_order;
      // switch tasks
      state.state[task_dict_name][action.payload.todo_id][action.payload.task1_index] 
        = item2;
      state.state[task_dict_name][action.payload.todo_id][action.payload.task2_index] 
        = item1;
    },
    completeTask: (state, action) => {
      const todo_id = action.payload.todo_id,
            task_index = action.payload.task_index;
      // Get task from the original tasks dictionary
      const task_dict_name = (action.payload.task_type == "complete") ?
        "complete_tasks" : "incomplete_tasks";
      state[task_dict_name][todo_id][task_index].task_done =
        (action.payload.task_type == "complete") ?
        0: 1;
      const task = state[task_dict_name][todo_id].splice(task_index, 1)[0];

      // Move the task to the other tasks dictionary
      const other_task_dict_name = (action.payload.task_type == "complete") ?
              "incomplete_tasks" : "complete_tasks"
      state[other_task_dict_name][todo_id].push(task);
      state[other_task_dict_name][todo_id].sort(((a,b) => {
        const aValue = (a.task_order != null) ? a.task_order : a.task_id,
          bValue = (b.task_order != null) ? b.task_order : b.task_id;
        return aValue - bValue;
      }));
    }
  }
});

export const { createTask, editTask, deleteTask,
                switchTasks, completeTask, setTasks,
                createdTodo
              } = taskSlice.actions

export default taskSlice.reducer

export const selectTaskDict = state => state.task.tasks_dict;
export const selectCompleteTasks = state => state.task.complete_tasks;
export const selectIncompleteTasks = state => state.task.incomplete_tasks;