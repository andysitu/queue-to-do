const initialState = {
  test: 100,
  todo_list: [],
};


/***
 * NOTE : TRY TO RETURN ONLY A COMPONENT OF STATE
 * RATHER THAN COPY THE ENTIRE THING
 */
function todoReducer(state = initialState, action) {
  if (action.type == "load_todos") {
    return {
      ...state,
      todo_list: action.payload,
    };
  } else if (action.type == "change_todo_name") {
    let new_state = {...state};
    new_state.todo_list = [...state.todo_list];
    new_state.todo_list[action.payload.index] = action.payload.name;
    return new_state;
  } else if (action.type == "add_todo") {
    let new_state = {...state};
    new_state.todo_list = [...state.todo_list];
    new_state.todo_list.push(action.payload);
    return new_state;
  } else if (action.type == "add_task") {
    let new_state = {...state};
    new_state.todo_list[action.payload.index].tasks = [...state.todo_list[action.payload.index].tasks];
    new_state.todo_list[action.payload.index].tasks.unshift(action.payload.data);
    return new_state;
  } else if (action.type == "delete_todo") {
    let new_state = {...state};
    new_state.todo_list = [...state.todo_list];
    new_state.todo_list.splice(action.payload.index, 1);
    return new_state;
  } else if (action.type == "change_task_name") {
    let new_state = {...state};
    new_state.todo_list[action.payload.todo_index].tasks = 
      [...state.todo_list[action.payload.todo_index].tasks ];
    new_state.todo_list[action.payload.todo_index].tasks[action.payload.index]
      = action.payload.name;
    return new_state;
  } else {
    return state;
  }
}