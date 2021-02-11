// import { Provider } from 'react-redux'
import { store  } from './redux/store.js'
const { Provider } = require("react-redux")
const { useDispatch } = require('react-redux')
import * as todoSlice from './redux/todoSlice.js'
const {ipcRenderer, remote} = require('electron');

import App from './app.js'

const React = require('react');
const ReactDom = require('react-dom');

function extract_data_to_todo(data) {
  return {
    todo_id: data.todo_id,
    todo_name: data.todo_name,
    todo_order: data.todo_order,
    tasks: [],
    showMultipleTasks: false,
  }
}
function extract_data_to_task(data) {
  return {
    done: data.task_done,
    task_name: data.task_name,
    task_id: data.task_id,
    task_order: data.task_order,
  }
}

let load_todo = () => {
  ipcRenderer.send("get-todo");
  ipcRenderer.once("get-todo", (event, data) => {
    let new_list = [], 
        todo_map = {},
        index, todo;
    
    for (let i=0; i<data.length; i++) {
      if (!(data[i].todo_id in todo_map)) {
        todo_map[data[i].todo_id] = new_list.length;
        todo = extract_data_to_todo(data[i]);
        if (data[i].task_id !== null) {
          todo.tasks.push(extract_data_to_task(data[i]));
        }

        new_list.push(todo);
      } else {
        if (data[i].task_id !== null) {
          index = todo_map[data[i].todo_id];
          new_list[index].tasks.push(extract_data_to_task(data[i]));
        }
      }
    }

    // Sort todos by todo_order, id if it doesn't exist
    new_list.sort((a,b) => {
      const aValue = (a.todo_order != null) ? a.todo_order : a.todo_id,
            bValue = (b.todo_order != null) ? b.todo_order : b.todo_id;
      return aValue - bValue;
    });
    // Sort tasks in todos by task_order, id if it doesn't exist
    for (let i=0; i< new_list.length; i++) {
      if (new_list[i].tasks && new_list[i].tasks.length > 1) {
        new_list[i].tasks.sort((a,b) => {
          const aValue = (a.task_order != null) ? a.task_order : a.task_id,
            bValue = (b.task_order != null) ? b.task_order : b.task_id;
          return aValue - bValue;
        });
      }
    }

    store.dispatch(todoSlice.setTodo(new_list));

    ReactDom.render(
      (<Provider store={store}>
        <App 
          extract_data_to_todo={extract_data_to_todo}
          extract_data_to_task={extract_data_to_task}
        />
      </Provider>), 
      document.getElementById("main-container")
    );
  });
}

load_todo();