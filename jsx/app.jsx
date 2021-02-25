import { ModalMenu } from "./modalmenu.js"
import { TodoContainer } from "./TodoContainer.js"

const React = require('react');
const {useState, useEffect} = require('react');
const ReactDom = require('react-dom');
const {ipcRenderer, remote} = require('electron');
const { Menu, MenuItem } = remote;

const { useSelector, useDispatch } = require('react-redux')
import * as todoSlice from './redux/todoSlice.js'
import * as taskSlice from './redux/taskSlice.js'

// Replace this in App to save todo_list to localStorage upon
// closing / refreshing window
let passTodoList = () => {return null;};
let addedOnload = false;

if (!addedOnload) {
  addedOnload = true;
  window.onbeforeunload = function() {
    let ids = [],
        todo_list = passTodoList();
    if (todo_list == null) {
      todo_list = [];
    }
    lstorage.saveSettingsFromTodoList(todo_list);
  };
}

function App(props) {
  const dispatch = useDispatch();
  
  const todo_list = useSelector(todoSlice.selectTodoList);
  
  let modalmenu = React.createRef();

  // Replace global variable with newest function rendition passTodoList.
  // Returns the newest todo_list that will be saved in localstorage
  // to save user settings
  passTodoList = () => {
    return todo_list;
  }

  useEffect(()=> {
  });

  let onClick_create_todo = () => {
    ipcRenderer.send("create-todo", {name: "New To-Do"});
    ipcRenderer.once("create-todo", (event, data) => {
      var todoData = props.extract_data_to_todo(data)
      // Add to task dictionary/obj also
      dispatch(taskSlice.createdTodo({todo_id: todoData.todo_id}));
      dispatch(todoSlice.addTodo(todoData));
    });
  };

  let onClick_saveFile = () => {
    let data = {
      settings: lstorage.getSettings(),
    };
    ipcRenderer.send("save-file", data);
    ipcRenderer.once("save-file", (event, response)=> {
      if (response == "OK")
        window.alert("Done");
      else
        window.alert("ERROR: " + response);
    });
  };

  let onClick_loadFile = () => {
    ipcRenderer.send('load-file');
    ipcRenderer.once("load-file", (event, data)=> {
      location.reload();
    });
  };

  let create_todos = () => {
    return (
      todo_list.map((todo, todo_index)=> {
        return (
          <TodoContainer key={todo.todo_id}
            extract_data_to_task={props.extract_data_to_task}
            modalmenu={modalmenu}
            todo_index={todo_index}/>);
      })
    );
  };

  return (<div>
    <button type="button" onClick={onClick_create_todo}>
      Create To-Do
    </button>
    <button type="button" onClick={onClick_saveFile}>
      Save File
    </button>
    <button type="button" onClick={onClick_loadFile}>
      Load File
    </button>
    <div>
      {create_todos()}
    </div>
    <ModalMenu ref={modalmenu}/>
  </div>)
}

export default App