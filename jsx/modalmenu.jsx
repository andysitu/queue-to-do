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
          <label htmlFor="task-name-input" className="focus">Task Name: </label>
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
    var elements = document.getElementsByClassName("focus");
    if(elements.length > 0) {
      elements[0].focus();
    }
  };

  get_data = (form) => {
    var data = {};
    if (this.state.additional_data) {
      for (var k in this.state.additional_data) {
        data[k] = this.state.additional_data[k];
      }
    }
    var formData = new FormData(form);
    for (var key of formData.keys()) {
      data[key] = formData.get(key);
    }
    return data;
  };

  onSubmit_form = (e) => {
    e.preventDefault();
    var data = this.get_data(e.target);
    console.log(data);
  }

  render() {
    return (<div id="modalmenu-container">
      <div id="mm-overlay">
      </div>
      <div id="mm-content-container">
        <form onSubmit={this.onSubmit_form}>
        <button type="button" onClick={this.show}>Close</button>
        {this.create_menu()}

        <button type="submit">Submit</button>
        </form>
      </div>
    </div>);
  }
}
