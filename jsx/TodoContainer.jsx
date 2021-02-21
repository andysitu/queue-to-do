const React = require('react')
const {useState, useEffect} = require('react')
const { useSelector, useDispatch } = require('react-redux')
const {ipcRenderer} = require('electron');
import * as todoSlice from './redux/todoSlice.js'
import * as taskSlice from './redux/taskSlice.js'

import { TaskRow } from "./TaskRow.js"

export { TodoContainer }

function TodoContainer(props) {
  const dispatch = useDispatch();
  const todo_list = useSelector(todoSlice.selectTodoList);
  const newlyCreatedId = useSelector(todoSlice.selectNewlyCreatedId);
  
  const todo_index = props.todo_index;
  const modalmenu = props.modalmenu;
  const todo = todo_list[todo_index];
  
  const todo_id = todo.todo_id;
  const complete_tasks = useSelector(taskSlice.selectCompleteTasks)[todo_id];
  const incomplete_tasks = useSelector(taskSlice.selectIncompleteTasks)[todo_id];

  // Select/focus on input if the todo was newly created
  useEffect(()=> {
    if (newlyCreatedId == todo_id) {
      let input = document.getElementById("todo-name-" + todo.todo_id);
      input.select();
      dispatch(todoSlice.delNewlyCreatedId());
    }
  });

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
          dispatch(taskSlice.createTask({
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

  const createTask = (task, task_index, task_type) => {
    return (
      <TaskRow key={task.task_id} task_index={task_index} 
        task_type={task_type}
        todo_index={todo_index} todo_id={todo_id} />);
  }

  const createTasks = () => {
    if (todo.showMultipleTasks) {
      
      const tasksList = [];
      incomplete_tasks.forEach((task, index) => {
        tasksList.push(
          createTask(task, index, "incomplete"));
      });
      complete_tasks.forEach((task, index) => {
        tasksList.push(
          createTask(task, index, "complete"));
      });
      return tasksList;
    } else {
      if (incomplete_tasks.length > 0) {
        let task, task_index;
        for (let i = 0; i < incomplete_tasks.length; i++) {
          if (incomplete_tasks[i].task_done == 0) {
            task = incomplete_tasks[i];
            task_index = i;
            break;
          }
        }
        if (task == null) { return; }
        return (<TaskRow key={task.task_id} task_index={task_index} todo_index={todo_index} todo_id={todo_id} />);
      } else {
        return;
      }
    }
  }

  return (
  <div
    // onContextMenu={this.onContextMenu_todo}
    >
      <div>
        <input type="text" id={"todo-name-" + todo.todo_id}
          value={todo.todo_name}
          onChange={onChange_todo_name_timer}
          ></input> 
        <button type="button"
          title="Add a task"
          onClick={onClick_create_task}
        >
          <i className="bi bi-plus"></i>
        </button>
        <button type="button"
          title={"Delete `" + todo.todo_name + "`"}
          onClick={onClick_delete_todo}
        >
          <i className="bi bi-trash"></i>
        </button>
        {(incomplete_tasks.length > 1 || complete_tasks.length > 0) ?
          (<button type="button" onClick={toggleShowTasks}>
            { todo.showMultipleTasks ? 
              <i className="bi bi-chevron-up"></i> : 
              <i className="bi bi-chevron-down"></i>}
          </button>) : null
        }
        
      </div>
      <div className="tasks-container">
        {createTasks()}
      </div>
    </div>);
}