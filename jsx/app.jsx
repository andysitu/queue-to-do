import { ModalMenu } from "./modalmenu.js"

const React = require('react');
const {useState, useEffect} = require('react');
const ReactDom = require('react-dom');
const {ipcRenderer, remote} = require('electron');
const { Menu, MenuItem } = remote;

const { useSelector, useDispatch } = require('react-redux')
import * as todoSlice from './redux/todoSlice.js'


function Test() {
  const test = useSelector(todoSlice.selectTest);
  const dispatch = useDispatch();

  let increase =() => {
    dispatch(todoSlice.increment());
  }

  return (<div>
    <button onClick={increase}>Increase</button>
    <div>{test}</div>
  </div>)
}

function App(props) {
  console.log("props", props);
  const dispatch = useDispatch();

  const todo_list = useSelector(todoSlice.selectTodoList);

  let modalmenu = React.createRef();
  console.log(todo_list);

  useEffect(()=> {
    console.log("test");
  })

  let onClick_create_todo = () => {
    console.log("create");
  }

  const onClick_delete_todo = (e) => {
    const id = e.target.getAttribute("todo_id"),
          index = e.target.getAttribute("index");
    const result = window.confirm(`Are you sure you want to delete todo ${todo_list[index].todo_name}?`);
    if (result)  {
      dispatch(todoSlice.deleteTodo({ index:index}));
    }
  }

  let create_todos = () => {
    return (
      todo_list.map((todo, todo_index)=> {
        return (
          <div key={todo.todo_id} 
          // onContextMenu={this.onContextMenu_todo}
          >
            <div>
              <input type="text" 
                value={todo.todo_name}
                id={todo.todo_id} index={todo_index}
                // onChange={this.onChange_todo_name_timer}
                ></input>
              <button type="button"
                todo_id={todo.todo_id} index={todo_index}
                // onClick={this.onClick_create_task}
              >+</button>
              <button type="button"
                todo_id={todo.todo_id} index={todo_index}
                onClick={onClick_delete_todo}
              >
                x
              </button>
            </div>
            <div>
              <ul>
                {todo.tasks.map((task, task_index) => {
                  return (
                  <li key={"task-"+task.task_id}>
                    <input value={task.task_name}
                      todo_index={todo_index}
                      index={task_index} task_id={task.task_id}
                      // onChange={this.onChange_taskName}
                    ></input>
                  </li>);
                })}
              </ul>
            </div>
          </div>);
      })
    );
  }

  return (<div>
    <Test />
    <button type="button"
      onClick={onClick_create_todo}>Create To-Do
    </button>
    {create_todos()}
    <ModalMenu ref={modalmenu}/>
  </div>)
}

export default App