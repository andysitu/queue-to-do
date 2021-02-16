const { createSlice } = require('@reduxjs/toolkit');
const {ipcRenderer} = require('electron');

export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todo_list: [],
    newlyCreatedId: -1,
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
      state.newlyCreatedId = action.payload.todo_id;
    },
    editTodo: (state, action) => {
      if (action.payload.property == "name") {
        state.todo_list[action.payload.index].todo_name = action.payload.value;
      }
    },
    toggleShowMultipleTasks: (state, action) => {
      state.todo_list[action.payload.todo_index].showMultipleTasks = 
        !state.todo_list[action.payload.todo_index].showMultipleTasks;
    },
    delNewlyCreatedId: state => {
      state.newlyCreatedId = -1;
    }
  }
});

export const { setTodo, deleteTodo, addTodo, editTodo,
                toggleShowMultipleTasks, delNewlyCreatedId
              } = todoSlice.actions

export default todoSlice.reducer

export const selectTodoList = state => state.todo.todo_list;
export const selectNewlyCreatedId = state => state.todo.newlyCreatedId;