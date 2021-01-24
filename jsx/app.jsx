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
  }

  load_todos = () => {
    ipcRenderer.send("get-todo");
    ipcRenderer.on("get-todo", (event, data) => {
      this.setState({
        to_dos: data,
      });
    });
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
  onChange_todo_name = (e) => {
    console.log(e.target.value);
  }

  create_todos = () => {
    return this.state.to_dos.map((todo, index) => {
      return (
        <div key={todo.id}>
          <input type="text" 
            value={todo.name}
            onChange={this.onChange_todo_name}></input>
          <button type="button"
            todo_id={todo.id}
            onClick={this.onClick_create_todo_item}>+</button>
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