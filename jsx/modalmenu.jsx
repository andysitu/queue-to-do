const React = require('react');
const ReactDom = require('react-dom');
const {ipcRenderer} = require('electron');

class ModalMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu_type : "none",
    }
  }
  show_menu(menu_type) {
    if (menu_type == "create_task") {
      this.setState({menu_type: menu_type,}, ()=> {
        this.show();
      })
    } else {
      this.setState({menu_type: "none",})
    }
  }
  create_menu() {
    const menu_type = this.state.menu_type;
    if (menu_type == "none") {
      return;
    } else if (menu_type == "create_task") {
      return (<div>
        <div>
          <label htmlFor="task-name-input">Task Name: </label>
          <input type="text" id="task-name-input" name="name"></input>
        </div>
        <div>
          <label htmlFor="task-note-input">Note: </label>
          <input type="text" id="task-note-input" name="note"></input>
        </div>
      </div>)
    }
  }
  show = () => {
    var container = document.getElementById("modalmenu-container");
    container.classList.toggle("reveal");
    if (!container.classList.contains("reveal")) {
      this.setState({menu_type: "none"});
    }
  };

  onClick_submit = (e) => {
    e.preventDefault();
    console.log("submit");
  }

  render() {
    return (<div id="modalmenu-container">
      <div id="mm-overlay">
      </div>
      <div id="mm-content-container">
        <form>
        <button type="button" onClick={this.show}>Close</button>
        {this.create_menu()}

        <button type="submit" onClick={this.onClick_submit}>Submit</button>
        </form>
      </div>
    </div>);
  }
}
