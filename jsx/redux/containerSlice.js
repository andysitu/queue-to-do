const { createSlice } = require('@reduxjs/toolkit');
const {ipcRenderer} = require('electron');

export const containerSlice = createSlice({
  name: "container",
  initialState: {
    selected: "main",
    containers: []
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload.selected;
    },
    addContainer: (state, action) => {
      state.containers.push(action.payload.container);
    },
    setContainers: (state, action) => {
      console.log(action.payload)
      state.containers = action.payload.containers;
    }
  }
});

export const { 
  setSelected, setContainers, addContainer } = containerSlice.actions

export default containerSlice.reducer

export const selectSelected = state => state.container.selected
export const selectContainers = state => state.container.containers;