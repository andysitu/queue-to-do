const React = require('react');
const { useSelector, useDispatch } = require('react-redux')
const {ipcRenderer} = require('electron');
import * as todoSlice from './redux/todoSlice.js'
import * as taskSlice from './redux/taskSlice.js'

export { TaskRow }

function TaskRow(props) {
  const dispatch = useDispatch();

  const todo_list = useSelector(todoSlice.selectTodoList);
    
  const timer_interval = 700;
  const task_index = props.task_index,
        todo_index = props.todo_index,
        todo_id = props.todo_id;
  const tasks = (props.task_type == "complete") ?
          useSelector(taskSlice.selectCompleteTasks)[todo_id] :
          useSelector(taskSlice.selectIncompleteTasks)[todo_id];
  const task = tasks[task_index];

  let task_name_timer = null;

  const onChange_taskName = (e) => {
    const value = e.target.value;
    dispatch(taskSlice.editTask({
      property: "name",
      task_type: props.task_type,
      task_index: task_index,
      todo_id: todo_id,
      value: value,
    }));

    clearTimeout(task_name_timer);
    task_name_timer = setTimeout(() => {
      var data = {
        task_id: task.task_id,
        property: "name",
        value: value,
      };
      ipcRenderer.send("edit-task", data);
    }, timer_interval);
  }

  const onClick_deleteTask = (e) => {
    const result = window.confirm(`Are you sure you want to delete task ${
      task.task_name}?`);
    if (result) {
      ipcRenderer.send("delete-task", {task_id: task.task_id});
      ipcRenderer.once("delete-task", () => {
        dispatch(taskSlice.deleteTask({
          todo_id: todo_id,
          task_index: task_index,
          task_type: props.task_type,
        }));
      });
    }
  };

  const onClick_moveUp = (e) => {
    if (task_index >= 1) {
      ipcRenderer.send("switch-task-order", {
        task1: task.task_id, 
        task2: tasks[task_index-1].task_id
      });
      ipcRenderer.once("switch-task-order", () => {
        dispatch(taskSlice.switchTasks({
          task_type: props.task_type,
          todo_id: todo_id,
          task1_index: task_index,
          task2_index: task_index-1
        }));
      });
    }
  };
  const onCilck_moveDown = (e) => {
    if (task_index < tasks.length - 1) {
      ipcRenderer.send("switch-task-order", {
        task1: task.task_id, 
        task2: tasks[task_index+1].task_id
      });
      ipcRenderer.once("switch-task-order", () => {
        dispatch(taskSlice.switchTasks({
          task_type: props.task_type,
          todo_id: todo_id,
          task1_index: task_index,
          task2_index: task_index+1
        }));
      });
    }
  };
  const completeTask = (e) => {
    ipcRenderer.send("complete-task", {
      task_id: task.task_id,
      task_done: task.task_done == 0 ? 1 : 0,
    });
    ipcRenderer.once("complete-task", () => {
      dispatch(taskSlice.completeTask({
        todo_id: todo_id,
        task_index: task_index,
        task_type: props.task_type,
      }));
    })
    
  };

  return (
  <div draggable="true" className="task-container">
    <input type="checkbox" checked={task.task_done != 0}
      onChange={completeTask}></input>
    <input value={task.task_name} type="text"
      onChange={onChange_taskName}></input>
      
    { todo_list[todo_index].showMultipleTasks ?
      <button type="button"
          onClick={onClick_moveUp}>
        <i className="bi bi-chevron-up"></i>
      </button> : null
    }
    { todo_list[todo_index].showMultipleTasks ?
      <button type="button"
          onClick={onCilck_moveDown}>
        <i className="bi bi-chevron-down"></i>
      </button> : null
    }

    <button type="button" onClick={onClick_deleteTask}>
      <i className="bi bi-trash"></i>
    </button>
  </div>);
}