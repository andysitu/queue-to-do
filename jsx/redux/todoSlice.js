const { createSlice } = require('@reduxjs/toolkit');

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
    }
  }
});

export const { increment, decrement, incrementByAmount } = todoSlice.actions

export const selectTest = state => state.todo.test;

export default todoSlice.reducer