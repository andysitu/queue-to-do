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
      const new_todos = [...state.todo_list];
      new_todos.splice(action.payload.index, 1);
      state.todo_list = new_todos;
    },
    addTodo: (state, action) => {
      state.todo_list = [...state.todo_list, action.payload];
    },
    editTodo: (state, action) => {
      console.log(action);
      var new_todos = [...state.todo_list];
      if (action.payload.property == "name") {
        new_todos[action.payload.index].todo_name = action.payload.value;
      }
      state.todo_list = new_todos;
    }
  }
});

export const { increment, decrement, incrementByAmount, 
                setTodo, deleteTodo, addTodo, editTodo } = todoSlice.actions

export default todoSlice.reducer

export const selectTest = state => state.todo.test;

export const selectTodoList = state => state.todo.todo_list;