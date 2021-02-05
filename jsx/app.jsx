import { ModalMenu } from "./modalmenu.js"

const React = require('react');
const {useState, useEffect} = require('react');
const ReactDom = require('react-dom');
const {ipcRenderer, remote} = require('electron');
const { Menu, MenuItem } = remote;

const { useSelector, useDispatch } = require('react-redux')
import * as todoSlice from './redux/todoSlice.js'

function App(props) {
  const dispatch = useDispatch();

  const timer_interval = 700;
  let todo_name_timer = null;
  let task_name_timer = null;
  const todo_list = useSelector(todoSlice.selectTodoList);

  let modalmenu = React.createRef();

  useEffect(()=> {
  })

  let onClick_create_todo = () => {
    ipcRenderer.send("create-todo", {name: "New To-Do"});
    ipcRenderer.once("create-todo", (event, data) => {
      var todoData = props.extract_data_to_todo(data)
      dispatch(todoSlice.addTodo(todoData));
    });
  };

  const onClick_delete_todo = (e) => {
    const id = e.target.getAttribute("todo_id"),
          index = e.target.getAttribute("index");
    const result = window.confirm(`Are you sure you want to delete todo ${todo_list[index].todo_name}?`);
    if (result)  {
      ipcRenderer.send("delete-todo", {todo_id: id});
      ipcRenderer.once("delete-todo", (event, data) => {
        dispatch(todoSlice.deleteTodo({ index:index}));
      });
    }
  };

  const onChange_todo_name_timer = (e) => {
    const id = e.target.getAttribute("id"),
          new_name = e.target.value,
          index = parseInt(e.target.getAttribute("index"));

    clearTimeout(todo_name_timer);

    dispatch(todoSlice.editTodo(
      { index:index, property: "name", value: new_name}));

    todo_name_timer = setTimeout(() => {
      var data = {
        todo_id: id,
        property: "name",
        value: new_name,
      };
      ipcRenderer.send("edit-todo", data);
    }, timer_interval);
  };

  const onClick_create_task = (e) => {
    const todo_id = e.target.getAttribute("todo_id"),
          index = e.target.getAttribute("index");
    modalmenu.current.show_menu(
      "create_task",
      (data) => {
        console.log(data);
        data.todo_id = todo_id;
        ipcRenderer.send("create-task", data);
        ipcRenderer.once("create-task",  (event, return_data) => {
          dispatch(todoSlice.addTask({
            task: props.extract_data_to_task(return_data),
            index: index,
          }));
        });
      }
    )
  };

  const onChange_taskName = (e) => {
    const index = e.target.getAttribute("index"),
          task_id = e.target.getAttribute("task_id"),
          todo_index = e.target.getAttribute("todo_index"),
          value = e.target.value;
    dispatch(todoSlice.editTask({
      property: "name",
      index: index,
      todo_index: todo_index,
      value: value,
    }));

    clearTimeout(task_name_timer);
    task_name_timer = setTimeout(() => {
      var data = {
        task_id: task_id,
        property: "name",
        value: value,
      };
      ipcRenderer.send("edit-task", data);
    }, timer_interval);
  }

  const onClick_deleteTask = (e) => {
    const todo_index = e.target.getAttribute("todo_index"),
          task_index = e.target.getAttribute("task_index"),
          task_id = e.target.getAttribute("task_id");
    const result = window.confirm(`Are you sure you want to delete task ${
      todo_list[todo_index].tasks[task_index].task_name}?`);
    if (result) {
      ipcRenderer.send("delete-task", {task_id: task_id});
      ipcRenderer.on("delete-task", () => {
        dispatch(todoSlice.deleteTask({
          todo_index: todo_index,
          task_index: task_index,
        }));
      });
    }
    
  };

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
                onChange={onChange_todo_name_timer}
                ></input>
              <button type="button"
                todo_id={todo.todo_id} index={todo_index}
                onClick={onClick_create_task}
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
                      onChange={onChange_taskName}
                    ></input>
                    <button type="button"
                      todo_index={todo_index}
                      task_index={task_index} task_id={task.task_id}
                      onClick={onClick_deleteTask}
                    >x</button>
                  </li>);
                })}
              </ul>
            </div>
          </div>);
      })
    );
  }

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