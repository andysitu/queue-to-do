var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDom = require('react-dom');

var _require = require('electron'),
    ipcRenderer = _require.ipcRenderer;

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.load_todos = function () {
      ipcRenderer.send("get-todo");
      ipcRenderer.on("get-todo", function (event, data) {
        _this.setState({
          to_dos: data
        });
      });
    };

    _this.onClick_create_todo = function () {
      var to_dos = [].concat(_toConsumableArray(_this.state.to_dos));
      to_dos.push({ name: "New To-Do" });
      ipcRenderer.send("create-todo", { name: "New To-Do" });
      ipcRenderer.on("create-todo", function (event, data) {
        _this.setState({ to_dos: to_dos }, function () {});
      });
    };

    _this.onClick_create_todo_item = function () {};

    _this.onChange_todo_name = function (e) {
      console.log(e.target.value);
    };

    _this.create_todos = function () {
      return _this.state.to_dos.map(function (todo, index) {
        return React.createElement(
          'div',
          { key: index },
          React.createElement('input', { type: 'text',
            value: todo.name,
            onChange: _this.onChange_todo_name }),
          React.createElement(
            'button',
            { type: 'button',
              onClick: _this.onClick_create_todo_item },
            '+'
          )
        );
      });
    };

    _this.state = {
      to_dos: []
    };
    _this.load_todos();
    return _this;
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      console.log(this.state);
      return React.createElement(
        'div',
        null,
        React.createElement(
          'button',
          { type: 'button',
            onClick: this.onClick_create_todo },
          'Create To-Do'
        ),
        this.create_todos(),
        React.createElement(ModalMenu, null)
      );
    }
  }]);

  return App;
}(React.Component);

ReactDom.render(React.createElement(App, null), document.getElementById("main-container"));