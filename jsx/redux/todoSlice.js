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
    test: 100,
    todo_list: [],
  },
  reducers: {
    increment: state => {
      state.test += 1;
    },
    decrement: state => {
      state.test -= 1;
    },
    incrementByAmount: (state, action) => {
      state.test += action.payload;
    },
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
    }
  }
});

export const { increment, decrement, incrementByAmount, 
                setTodo, deleteTodo, addTodo, editTodo,
                addTask, editTask } = todoSlice.actions

export default todoSlice.reducer

export const selectTest = state => state.todo.test;

export const selectTodoList = state => state.todo.todo_list;