export { store, }

// import { createStore } from 'redux'
// const { createStore } = require('redux');
// import { todoReducer } from "./reducers/todoreducer.js"
import containerReducer from "./containerSlice.js"
import todoReducer from "./todoSlice.js"
import taskReducer from "./taskSlice.js"

const { configureStore } = require('@reduxjs/toolkit')
// const update = require('immutability-helper');

// Need to create store & create state after the function declaration
// const store = createStore(todoReducer);
const store = configureStore({
  reducer: {
    container: containerReducer,
    todo: todoReducer,
    task: taskReducer,
  }
});