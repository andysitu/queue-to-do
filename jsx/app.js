const React = require('react');
const ReactDom = require('react-dom');

class App extends React.Component {
  render() {
    return (
      <div>Hello, how are you?</div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("container"));