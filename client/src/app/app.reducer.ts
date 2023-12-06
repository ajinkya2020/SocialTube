import { ActionTypes, AppReducerState } from "./app.interface";
import * as actionTypes from "./app.actionTypes";
import { Action, State, createReducer, on } from "@ngrx/store";

const INITIAL_STATE: AppReducerState = {
  user: {
    data: null,
    isFetching: false,
    error: null
  }
}

const reducer = createReducer(
  INITIAL_STATE,
  on(actionTypes.GET_USER_REQUEST, (state) => ({
    ...state,
    user: {
      data: null,
      isFetching: true,
      error: null,
    },
  })),
  on(actionTypes.GET_USER_SUCCESS, (state, { payload }) => ({
    ...state,
    user: {
      data: payload,
      isFetching: false,
      error: null,
    },
  })),
  on(actionTypes.GET_USER_ERROR, (state, { payload }) => ({
    ...state,
    user: {
      data: null,
      isFetching: false,
      error: payload,
    },
  })),
);

export function appReducer(state: AppReducerState | undefined, action: Action) {
  return reducer(state, action);
}