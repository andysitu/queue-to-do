// import { Provider } from 'react-redux'
import { store  } from './redux/store.js'
const { Provider } = require("react-redux")
const { useDispatch } = require('react-redux')
import * as todoSlice from './redux/todoSlice.js'
import * as taskSlice from './redux/taskSlice.js'
const {ipcRenderer, remote} = require('electron');

import App from './app.js'

const React = require('react');
const ReactDom = require('react-dom');

function extract_data_to_todo(data) {
  return {
    todo_id: data.todo_id,
    todo_name: data.todo_name,
    todo_order: data.todo_order,
    todo_create_date: data.todo_create_date,
    tasks: [],
    showMultipleTasks: false,
  }
}
function extract_data_to_task(data) {
  return {
    task_done: data.task_done,
    task_name: data.task_name,
    task_id: data.task_id,
    task_order: data.task_order,
    task_create_date: data.task_create_date,
  }
}

let load_todo = () => {
  ipcRenderer.send("get-todo");
  ipcRenderer.once("get-todo", (event, data) => {
    let new_list = [], 
        todo_map = {},
        task_dict = {},
        index, todo;
    
    for (let i=0; i<data.length; i++) {
      if (!(data[i].todo_id in todo_map)) {
        todo_map[data[i].todo_id] = new_list.length;
        todo = extract_data_to_todo(data[i]);

        task_dict[todo.todo_id] = [];

        new_list.push(todo);
      }

      if (data[i].task_id !== null) {
        task_dict[todo.todo_id].push(extract_data_to_task(data[i]));
      }
    }

    // Sort todos by todo_order, id if it doesn't exist
    new_list.sort((a,b) => {
      const aValue = (a.todo_order != null) ? a.todo_order : a.todo_id,
            bValue = (b.todo_order != null) ? b.todo_order : b.todo_id;
      return aValue - bValue;
    });

    let todo_id;
    // Sort tasks in todos by task_order, id if it doesn't exist
    for (let i=0; i< new_list.length; i++) {
      todo_id = new_list[i].todo_id;
      if (task_dict[todo_id].length > 1) {
        task_dict[todo_id].sort((a,b) => {
          const aValue = (a.task_order != null) ? a.task_order : a.task_id,
            bValue = (b.task_order != null) ? b.task_order : b.task_id;
          return aValue - bValue;
        });
      }
    }

    store.dispatch(todoSlice.setTodo(new_list));
    store.dispatch(taskSlice.setTasks(task_dict))

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