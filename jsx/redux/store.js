export { store, }

// import { createStore } from 'redux'
const { createStore } = require('redux');
import { todoReducer } from "./reducer.js"

// const { configureStore } = require('@reduxjs/toolkit')
// const update = require('immutability-helper');

// Need to create store & create state after the function declaration
const store = createStore(todoReducer);