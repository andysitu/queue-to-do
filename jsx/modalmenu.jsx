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

  }
  set_menu(menu_typee) {
    
  }
  show = () => {
    var container = document.getElementById("modalmenu-container");
    container.classList.toggle("reveal");
  };

  render() {
    return (<div id="modalmenu-container">
      <div id="mm-overlay"></div>
      <div id="mm-content-container">
        <button type="button" onClick={this.show}>Close</button>
      </div>
    </div>);
  }
}
