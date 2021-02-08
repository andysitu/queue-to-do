const React = require('react');
const { useSelector, useDispatch } = require('react-redux')
const {ipcRenderer} = require('electron');
import * as todoSlice from './redux/todoSlice.js'

export { TaskRow }

function TaskRow(props) {
  const dispatch = useDispatch();

  const todo_list = useSelector(todoSlice.selectTodoList);
  const timer_interval = 700;
  const task_index = props.task_index,
        todo_index = props.todo_index;
  let task_name_timer = null;
        
  const task = todo_list[todo_index].tasks[task_index];

  const onChange_taskName = (e) => {
    const value = e.target.value;
    dispatch(todoSlice.editTask({
      property: "name",
      index: task_index,
      todo_index: todo_index,
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
      todo_list[todo_index].tasks[task_index].task_name}?`);
    if (result) {
      ipcRenderer.send("delete-task", {task_id: task.task_id});
      ipcRenderer.once("delete-task", () => {
        dispatch(todoSlice.deleteTask({
          todo_index: todo_index,
          task_index: task_index,
        }));
      });
    }
  };

  const onClick_moveUp = (e) => {
    if (task_index >= 1) {
      ipcRenderer.send("switch-tasks", {
        task1: task.task_id, 
        task2: todo_list[todo_index].tasks[task_index-1].task_id
      });
      ipcRenderer.once("switch-tasks", () => {
        dispatch(todoSlice.switchTasks({
          todo_index: todo_index,
          task1_index: task_index,
          task2_index: task_index-1
        }));
      });
    }
  };
  const onCilck_moveDown = (e) => {
    if (task_index < todo_list[todo_index].tasks.length - 1) {
      ipcRenderer.send("switch-tasks", {
        task1: task.task_id, 
        task2: todo_list[todo_index].tasks[task_index+1].task_id
      });
      ipcRenderer.once("switch-tasks", () => {
        dispatch(todoSlice.switchTasks({
          todo_index: todo_index,
          task1_index: task_index,
          task2_index: task_index+1
        }));
      });
    }
  };

  return (
  <li key={"task-"+task.task_id}>
    <input value={task.task_name}
      onChange={onChange_taskName}
    ></input>
    <button type="button"
      onClick={onClick_deleteTask}
    >x</button>
    <button type="button"
      onClick={onClick_moveUp}>
      UP</button>
      <button type="button"
      onClick={onCilck_moveDown}>
      DOWN</button>
  </li>);
}