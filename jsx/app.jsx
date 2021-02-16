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

function App(props) {
  const dispatch = useDispatch();
  
  const todo_list = useSelector(todoSlice.selectTodoList);

  let modalmenu = React.createRef();

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
    <button type="button"
      onClick={onClick_create_todo}>Create To-Do
    </button>
    <div>
      {create_todos()}
    </div>
    <ModalMenu ref={modalmenu}/>
  </div>)
}

export default App