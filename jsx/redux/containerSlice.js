const { createSlice } = require('@reduxjs/toolkit');
const {ipcRenderer} = require('electron');

export const containerSlice = createSlice({
  name: "container",
  initialState: {
    selected: "",
    containers: []
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload.selected;
    },
    addContainer: (state, action) => {
      state.containers.push(action.payload.container);
    }
  }
});

export const { setSelected } = containerSlice.actions

export default containerSlice.reducer

export const selectSelected = state => state.container.selected