import { UserResponse } from "./shared/services/auth/auth.interface"

export interface UserResponseObservable {
  data: UserResponse | null,
  isFetching: boolean,
  error: any
}

export interface ActionTypes {
  action: any,
  payload: any
};

export interface AppReducerState {
  user: UserResponseObservable
}