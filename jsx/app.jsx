import { ModalMenu } from "./modalmenu.js"

const React = require('react');
const ReactDom = require('react-dom');
const {ipcRenderer, remote} = require('electron');
const { Menu, MenuItem } = remote;

const { useSelector, useDispatch } = require('react-redux')
import { decrement, increment, incrementByAmount, selectTest } from './redux/todoSlice.js'


function Test() {
  const test = useSelector(selectTest);
  const dispatch = useDispatch();

  let increase =() => {
    console.log("increase");
    dispatch(increment());
  }

  return (<div>
    <button onClick={increase}>Increase</button>
    <div>{test}</div>
  </div>)
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo_list: [],
    };
    this.modalmenu = React.createRef();
    this.load_todos();
    this.todo_name_timer = null;
    this.task_name_timer = null;

    this.todo_contextmenu = null;
  }

  create_todo_contextmenu = () => {

  }

  extract_data_to_todo = (data) => {
    return {
      todo_id: data.todo_id,
      todo_name: data.todo_name,
      tasks: [],
    }
  }
  extract_data_to_task = (data) => {
    return {
      task_name: data.task_name,
      task_id: data.task_id,
    }
  }

  load_todos = () => {
    ipcRenderer.send("get-todo");
    ipcRenderer.once("get-todo", (event, data) => {
      let todo_list = [], 
          todo_map = {},
          index, todo;
      
      for (let i=0; i<data.length; i++) {
        if (!(data[i].todo_id in todo_map)) {
          todo_map[data[i].todo_id] = todo_list.length;
          todo = this.extract_data_to_todo(data[i]);
          if (data[i].task_id !== null) {
            todo.tasks.push(this.extract_data_to_task(data[i]));
          }

          todo_list.push(todo);
        } else {
          if (data[i].task_id !== null) {
            index = todo_map[data[i].todo_id];
            todo_list[index].tasks.push(this.extract_data_to_task(data[i]));
          }
        }
      }
      console.log(todo_list);
      this.setState({
        todo_list: todo_list,
      });
    });
  };

  onChange_todo_name_timer = (e) => {
    var id = e.target.getAttribute("id"),
        new_name = e.target.value,
        index = e.target.getAttribute("index");

    clearTimeout(this["todo_name_timer"]);

    this.setState((state) => {
      var new_todos = [...this.state.todo_list];
      new_todos[index].todo_name = new_name;

      return {todo_list: new_todos,};
    });

    this["todo_name_timer"] = setTimeout(() => {
      var data = {
        todo_id: id,
        property: "name",
        value: new_name,
      };
      ipcRenderer.send("edit-todo", data);
    }, 700);
  };

  onClick_create_todo = () => {
    ipcRenderer.send("create-todo", {name: "New To-Do"});
    ipcRenderer.once("create-todo", (event, data) => {
      console.log(data);
      this.setState((state) => {
        var new_list = [...state.todo_list];
        new_list.push(this.extract_data_to_todo(data));
        return {
          todo_list: new_list,
        };
      });
    });
  };

  onClick_create_task = (e) => {
    var todo_id = e.target.getAttribute("todo_id"),
        index = e.target.getAttribute("index");
    this.modalmenu.current.show_menu(
      "create_task", 
      (data) => {
        data.todo_id = todo_id;
        ipcRenderer.send("create-task", data);
        ipcRenderer.once("create-task",  (event, return_data) => {
          this.setState( state => {
            var new_list = [...state.todo_list];
            new_list[index].tasks = [...state.todo_list[index].tasks];
            new_list[index].tasks.unshift(
              this.extract_data_to_task(return_data)
            );
            return {
              todo_list: new_list
            };
          });
        });
      });
  };
  onClick_delete_todo = (e) => {
    let id = e.target.getAttribute("todo_id"),
        index = e.target.getAttribute("index");
    let result = window.confirm(`Are you sure you want to delete todo ${this.state.todo_list[index].todo_name}?`);
    if (result)  {
      ipcRenderer.send("delete-todo", {todo_id: id});
      ipcRenderer.once("delete-todo", (event, data) => {
        this.setState((state) => {
          var new_todos = [...state.todo_list];
          new_todos.splice(index, 1);
          return {
            todo_list: new_todos,
          }
        });
      });
    }
  };
  
  onContextMenu_todo = (e) => {
    // e.stopPropagation();
    // e.preventDefault();
    console.log(e.target);
  }

  onChange_taskName = (e) => {
    var index = e.target.getAttribute("index"),
    task_id = e.target.getAttribute("task_id"),
        todo_index = e.target.getAttribute("todo_index"),
        value = e.target.value;
    this.setState(state => {
      var new_list = [...state.todo_list];
      new_list[todo_index].tasks[index].task_name = value;
      return { todo_list: new_list, };
    });
    clearTimeout(this["task_name_timer"]);
    this["task_name_timer"] = setTimeout(() => {
      var data = {
        task_id: task_id,
        property: "name",
        value: value,
      };
      ipcRenderer.send("edit-task", data);
    }, 700);
  };

  create_todos = () => {
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

  render() {
    return (
      <div>
        <Test />
        <div>{this.test}</div>
        <button type="button"
          onClick={this.onClick_create_todo}>Create To-Do
        </button>

        {this.create_todos()}

        <ModalMenu ref={this.modalmenu}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  
}

export default App