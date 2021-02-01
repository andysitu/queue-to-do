export { store, }

// import { createStore } from 'redux'
// const { createStore } = require('redux');
// import { todoReducer } from "./reducers/todoreducer.js"
import todoReducer from "./todoSlice.js"

const { configureStore } = require('@reduxjs/toolkit')
// const update = require('immutability-helper');

// Need to create store & create state after the function declaration
// const store = createStore(todoReducer);
const store = configureStore({
  reducer: {
    todo: todoReducer
  }
});