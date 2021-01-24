const React = require('react');
const ReactDom = require('react-dom');

const {ipcRenderer} = require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to_dos: [],
    };
    this.load_todos();
  }

  load_todos = () => {
    ipcRenderer.send("get-todo");
    ipcRenderer.on("get-todo", (event, data) => {
      console.log(data);
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
  onClick_create_todo_item = () => {

  };
  onChange_todo_name = (e) => {
    console.log(e.target.value);
  }

  create_todos = () => {
    return this.state.to_dos.map((todo, index) => {
      return (
        <div key={index}>
          <input type="text" 
            value={todo.name}
            onChange={this.onChange_todo_name}></input>
          <button type="button" 
            onClick={this.onClick_create_todo_item}>+</button>
        </div>);
    });
  };


  render() {
    console.log(this.state);
    return (
      <div>
        <button type="button"
          onClick={this.onClick_create_todo}>Create To-Do
        </button>

        {this.create_todos()}
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("main-container"));