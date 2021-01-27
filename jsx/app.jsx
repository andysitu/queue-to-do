const React = require('react');
const ReactDom = require('react-dom');

const {ipcRenderer} = require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to_dos: [],
    };
    this.modalmenu = React.createRef();
    this.load_todos();
    this.todo_name_timer = null;
  }

  load_todos = () => {
    ipcRenderer.send("get-todo");
    ipcRenderer.once("get-todo", (event, data) => {
      console.log(data);
      if (!data) {
        data = [];
      }
      this.setState({
        to_dos: data,
      });
    });
  };

  onChange_todo_name_timer = (e) => {
    var id = e.target.getAttribute("id"),
        new_name = e.target.value,
        index = e.target.getAttribute("index");

    clearTimeout(this["todo_name_timer"]);

    this.setState((state) => {
      var new_todos = [...this.state.to_dos];
      new_todos[index].todo_name = new_name;

      return {to_dos: new_todos,};
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
        var new_todo = [...state.to_dos];
        new_todo.push(data);
        return {
          to_dos: new_todo,
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
        var new_todos = [...state.to_dos];
        new_todos.splice(index, 1);
        return {
          to_dos: new_todos,
        }
      });
    });
  };

  create_todos = () => {
    return this.state.to_dos.map((todo, index) => {
      return (
        <div key={todo.todo_id}>
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