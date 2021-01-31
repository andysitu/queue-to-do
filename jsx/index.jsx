// import { Provider } from 'react-redux'
import { store  } from './redux/store.js'
const { Provider } = require("react-redux")

import App from './app.js'

const React = require('react');
const ReactDom = require('react-dom');

console.log(store.getState());

ReactDom.render(
  (<Provider store={store}>
    <App />
  </Provider>), 
  document.getElementById("main-container")
);
