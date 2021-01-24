var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDom = require('react-dom');

var _require = require('electron'),
    ipcRenderer = _require.ipcRenderer;

var ModalMenu = function (_React$Component) {
  _inherits(ModalMenu, _React$Component);

  function ModalMenu(props) {
    _classCallCheck(this, ModalMenu);

    var _this = _possibleConstructorReturn(this, (ModalMenu.__proto__ || Object.getPrototypeOf(ModalMenu)).call(this, props));

    _this.show = function () {
      var container = document.getElementById("modalmenu-container");
      container.classList.toggle("reveal");
    };

    _this.state = {
      menu_type: "none"
    };
    return _this;
  }

  _createClass(ModalMenu, [{
    key: 'show_menu',
    value: function show_menu(menu_type) {}
  }, {
    key: 'set_menu',
    value: function set_menu(menu_typee) {}
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'modalmenu-container' },
        React.createElement('div', { id: 'mm-overlay' }),
        React.createElement(
          'div',
          { id: 'mm-content-container' },
          React.createElement(
            'button',
            { type: 'button', onClick: this.show },
            'Close'
          )
        )
      );
    }
  }]);

  return ModalMenu;
}(React.Component);