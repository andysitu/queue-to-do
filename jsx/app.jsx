const React = require('react');
const ReactDom = require('react-dom');

const {ipcRenderer} = require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo_list: [],
    };
    this.modalmenu = React.createRef();
    this.load_todos();
    this.todo_name_timer = null;
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
          todo = {
            todo_id: data[i].todo_id,
            todo_name: data[i].todo_name,
            tasks: [],
          };
          if (data[i].task_id !== null) {
            todo.tasks.push({
              task_name: data[i].task_name,
              task_id: data[i].task_id,
              task_note: data[i].task_note,
            });
          }
          todo_list.push(todo);
        } else {
          if (data[i].task_id !== null) {
            index = todo_map[data[i].todo_id];
            todo_list[index].tasks.push({
              task_name: data[i].task_name,
              task_id: data[i].task_id,
              task_note: data[i].task_note,
            });
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
        var new_todo = [...state.todo_list];
        new_todo.push(data);
        return {
          todo_list: new_todo,
        };
      });
    });
  };
  onClick_create_todo_item = (e) => {
    this.modalmenu.current.show_menu("create_task", (data) => {console.log(data)});
    // ipcRenderer.send("create-task", {todo_id: e.target.getAttribute("todo_id")});
  };
  onClick_delete_todo = (e) => {
    var id = e.target.getAttribute("todo_id"),
        index = e.target.getAttribute("index");
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
  };

  create_todos = () => {
    return this.state.todo_list.map((todo, index) => {
      return (
        <div key={todo.todo_id}>
          <div>
            <input type="text" 
              value={todo.todo_name}
              id={todo.todo_id} index={index}
              onChange={this.onChange_todo_name_timer}></input>
            <button type="button"
              todo_id={todo.todo_id}
              onClick={this.onClick_create_todo_task}
            >+</button>
            <button type="button"
              todo_id={todo.todo_id} index={index}
              onClick={this.onClick_delete_todo}
            >
              x
            </button>
          </div>
          <div>
            <ul>
              {todo.tasks.map(task => {
                return (<li>{task.task_name}</li>);
              })}
            </ul>
          </div>
        </div>);
    });
  };

  render() {
    return (
      <div>
        <button type="button"
          onClick={this.onClick_create_todo}>Create To-Do
        </button>

        {this.create_todos()}

        <ModalMenu ref={this.modalmenu}/>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("main-container"));