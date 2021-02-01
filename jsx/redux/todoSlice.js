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
      console.log(action);
      state.todo_list = action.payload;
    },
  }
});

export const { increment, decrement, incrementByAmount } = todoSlice.actions

export default todoSlice.reducer

export const selectTest = state => state.todo.test;

export const selectTodoList = state => state.todo.todo_list;

export const loadToDo = () => {
  return (dispatch, getState) => {
    ipcRenderer.invoke("get-todo", (event, data) => {
      let todo_list = [], 
        todo_map = {},
        index, todo;
      
      for (let i=0; i<data.length; i++) {
        if (!(data[i].todo_id in todo_map)) {
          todo_map[data[i].todo_id] = todo_list.length;
          todo = extract_data_to_todo(data[i]);
          if (data[i].task_id !== null) {
            todo.tasks.push(extract_data_to_task(data[i]));
          }

          todo_list.push(todo);
        } else {
          if (data[i].task_id !== null) {
            index = todo_map[data[i].todo_id];
            todo_list[index].tasks.push(extract_data_to_task(data[i]));
          }
        }
      }
      dispatch(setTodo(todo_list));
    });
  }
};