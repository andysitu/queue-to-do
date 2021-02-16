const React = require('react');
const { useSelector, useDispatch } = require('react-redux')
const {ipcRenderer} = require('electron');
import * as todoSlice from './redux/todoSlice.js'
import * as taskSlice from './redux/taskSlice.js'

import { TaskRow } from "./TaskRow.js"

export { TodoContainer }

function TodoContainer(props) {
  const dispatch = useDispatch();
  const todo_list = useSelector(todoSlice.selectTodoList);
  const task_dict = useSelector(taskSlice.selectTaskDict);
  
  const todo_index = props.todo_index;
  const modalmenu = props.modalmenu;
  const todo = todo_list[todo_index];
  
  const todo_id = todo.todo_id;
  const tasks = task_dict[todo_id];

  console.log(todo_list);
  console.log(tasks);

  const timer_interval = 700;
  let todo_name_timer = null;

  const onClick_delete_todo = (e) => {
    const result = window.confirm(`Are you sure you want to delete todo ${todo.todo_name}?`);
    if (result)  {
      ipcRenderer.send("delete-todo", {todo_id: todo.todo_id});
      ipcRenderer.once("delete-todo", (event, data) => {
        dispatch(todoSlice.deleteTodo({ index:todo_index}));
      });
    }
  };

  const onChange_todo_name_timer = (e) => {
    const new_name = e.target.value;

    clearTimeout(todo_name_timer);

    dispatch(todoSlice.editTodo(
      { index:todo_index, property: "name", value: new_name}));

    todo_name_timer = setTimeout(() => {
      var data = {
        todo_id: todo.todo_id,
        property: "name",
        value: new_name,
      };
      ipcRenderer.send("edit-todo", data);
    }, timer_interval);
  };

  const onClick_create_task = (e) => {
    modalmenu.current.show_menu(
      "create_task",
      (data) => {
        data.todo_id = todo.todo_id;
        ipcRenderer.send("create-task", data);
        ipcRenderer.once("create-task",  (event, return_data) => {
          dispatch(taskSlice.addTask({
            todo_id: todo_id,
            task: props.extract_data_to_task(return_data),
          }));
        });
      }
    )
  };

  const toggleShowTasks = () => {
    dispatch(todoSlice.toggleShowMultipleTasks({
      todo_index: todo_index,
    }));
  };

  const createTasks = () => {
    if (todo.showMultipleTasks) {
      return (tasks.map((task, task_index) => {
        return (
        <TaskRow key={task.task_id} task_index={task_index} todo_index={todo_index} todo_id={todo_id} />);
      }));
    } else {
      if (tasks.length > 0) {
        const task = tasks[0];
        return (
          <TaskRow key={task.task_id} task_index={0} todo_index={todo_index} todo_id={todo_id} />);
      } else {
        return;
      }
    }
  }

  return (<div
    // onContextMenu={this.onContextMenu_todo}
    >
      <div>
        <input type="text" 
          value={todo.todo_name}
          onChange={onChange_todo_name_timer}
          ></input>
        <button type="button"
          title="Add a task"
          onClick={onClick_create_task}
        >+</button>
        <button type="button"
          title={"Delete `" + todo.todo_name + "`"}
          onClick={onClick_delete_todo}
        >
          x
        </button>
        {
          tasks && tasks.length > 1 ?
          (<button type="button" onClick={toggleShowTasks}>
            { todo.showMultipleTasks ?
              "^" : "v"}
          </button>) : null
        }
        
      </div>
      <div>
        <ul>
          {createTasks()}
        </ul>
      </div>
    </div>);
}