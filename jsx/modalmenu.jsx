export {
  ModalMenu,
}

const React = require('react');
const ReactDom = require('react-dom');
const {ipcRenderer} = require('electron');

class ModalMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu_type : "none",
      data: {},
      callback: null,
    };
    this.callback = null;
  }
  show_menu(menu_type, callback, data) {
    this.callback = callback;
    if (menu_type == "create_task" || menu_type == "google_api") {
      this.setState({
        menu_type: menu_type,
        data: data,
      }, ()=> {
        this.show();
      });
    } else {
      this.callback = null;
      this.setState({
        data: {},
        menu_type: "none",})
    }
  }
  create_menu() {
    const menu_type = this.state.menu_type;
    if (menu_type == "create_task") {
      return (<div>
        <div>
          <label htmlFor="task-name-input" className="focus">Task Name: </label>
          <input type="text" id="task-name-input" name="name"></input>
        </div>
      </div>)
    } else if (menu_type == "google_api") {
      const data = (this.state.data) ? this.state.data : {};
      return (<div>
        <div>
          <label htmlFor="client-id-input" className="focus">Client ID: </label>
          <input type="text" id="client-id-input" name="clientId"
            defaultValue={data.clientId} required></input>
        </div>
        <div>
          <label htmlFor="api-key-input" className="focus">API Key </label>
          <input type="text" id="api-key-input" name="apiKey"
            defaultValue={data.apiKey} required></input>
        </div>
        <div>
          <label htmlFor="client-id-input" className="focus">Password</label>
          <input type="text" id="password-input" name="password" required></input>
        </div>
      </div>)
    } else {
      return;
    }
  }
  show = () => {
    var container = document.getElementById("modalmenu-container");
    container.classList.toggle("reveal");
    // Destroys the menu element when hidden
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
    if (this.callback) {
      this.callback(data);
    }
    this.show();
  };

  render() {
    return (<div id="modalmenu-container">
      <div id="mm-overlay" onClick={this.show}></div>
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
