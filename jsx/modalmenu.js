const React = require('react');
const ReactDom = require('react-dom');
const {ipcRenderer} = require('electron');

class ModalMenu extends React.Component {
  show = () => {
    var container = document.getElementById("modalmenu-container");
    container.classList.toggle("reveal");
  };

  render() {
    return (<div id="modalmenu-container">
      Test
    </div>);
  }
}
