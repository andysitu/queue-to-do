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
    ipcRenderer.on("get-todo", (event, data) => {
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
      new_todos[index].name = new_name;

      return {to_dos: new_todos,};
    });

    this["todo_name_timer"] = setTimeout(() => {
      var data = {
        todo_id: id,
        property: "name",
        value: new_name,
      };
      ipcRenderer.send("edit-todo", data);
    }, 1000);
  };

  onClick_create_todo = () => {
    var to_dos = [...this.state.to_dos];
    to_dos.push({name: "New To-Do"});
    ipcRenderer.send("create-todo", {name: "New To-Do"});
    ipcRenderer.on("create-todo", (event, data) => {
      this.setState({to_dos: to_dos,}, () => {

      });
    });
  };
  onClick_create_todo_item = (e) => {
    // console.log("create");
    // this.modalmenu.current.show();
    ipcRenderer.send("create-task", {todo_id: e.target.getAttribute("todo_id")});
  };
  onClick_delete_todo = (e) => {
    var id = e.target.getAttribute("todo_id"),
        index = e.target.getAttribute("index");
    ipcRenderer.send("delete-todo", {todo_id: id});
    ipcRenderer.on("delete-todo", (event, data) => {
      this.setState((state) => {
        var new_todos = [...state.to_dos];
        new_todos.splice(index, 1);
        return {
          to_dos: new_todos,
        }
      });
    });
  }

  create_todos = () => {
    return this.state.to_dos.map((todo, index) => {
      return (
        <div key={todo.id}>
          <input type="text" 
            value={todo.name}
            id={todo.id} index={index}
            onChange={this.onChange_todo_name_timer}></input>
          <button type="button"
            todo_id={todo.id}
            onClick={this.onClick_create_todo_item}
          >+</button>
          <button type="button"
            todo_id={todo.id} index={index}
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