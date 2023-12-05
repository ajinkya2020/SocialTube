import { AppReducerState } from "./app.interface";
import * as actionTypes from "./app.actionTypes";

const INITIAL_STATE: AppReducerState = {
  user: {
    data: null,
    isFetching: false,
    error: null
  }
}

const appReducer = (state: AppReducerState = INITIAL_STATE, actions: any): AppReducerState => {
  switch(actions.action) {
    case actionTypes.GET_USER_REQUEST:
      return {
        ...state,
        user: {
          data: null,
          isFetching: true,
          error: null
        }
      }
    
    case actionTypes.GET_USER_SUCCESS:
      return {
        ...state,
        user: {
          data: actions.payload,
          isFetching: false,
          error: null
        }
      }

    case actionTypes.GET_USER_ERROR:
      return {
        ...state,
        user: {
          data: null,
          isFetching: false,
          error: actions.payload
        }
      }
  }

  return state;
}

export default appReducer;