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

function App() {
  const dispatch = useDispatch();

  // const todo_list = useSelector(todoSlice.selectTodoList);

  let modalmenu = React.createRef();
  let onClick_create_todo = () => {
    console.log("create_todo");
  }

  useEffect(() => {
    load_todo();
  });

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
      console.log(new_list);
      dispatch(todoSlice.setTodo(new_list));
    });
  }

  const cdreate_todos = () => {
    return this.state.todo_list.map((todo, todo_index) => {
      return (
        <div key={todo.todo_id} onContextMenu={this.onContextMenu_todo}>
          <div>
            <input type="text" 
              value={todo.todo_name}
              id={todo.todo_id} index={todo_index}
              onChange={this.onChange_todo_name_timer}></input>
            <button type="button"
              todo_id={todo.todo_id} index={todo_index}
              onClick={this.onClick_create_task}
            >+</button>
            <button type="button"
              todo_id={todo.todo_id} index={todo_index}
              onClick={this.onClick_delete_todo}
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
                    onChange={this.onChange_taskName}></input>
                </li>);
              })}
            </ul>
          </div>
        </div>);
    });
  };

  let create_todos = () => {
    return (<div>Test</div>);
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