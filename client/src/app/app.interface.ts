import { UserInfo } from "./shared/services/auth/auth.interface"

export interface UserResponseObservable {
  data: UserInfo | null,
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