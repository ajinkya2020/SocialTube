import { Action } from "@ngrx/store"
import { UserCredentials, UserInfo } from "./shared/services/auth/auth.interface";

export const GET_USER_REQUEST = 'auth/GET_USER_REQUEST'
export const GET_USER_SUCCESS = 'auth/GET_USER_SUCCESS'
export const GET_USER_ERROR = 'auth/GET_USER_ERROR'

export class GetUserRequest implements Action {
  readonly type = GET_USER_REQUEST;
  constructor(public payload: UserCredentials) {}
}

export class GetUserSuccess implements Action {
  readonly type = GET_USER_SUCCESS;
  constructor(public payload: UserInfo) {}
}

export class GetUserError implements Action {
  readonly type = GET_USER_ERROR;
  constructor(public payload: any) {}
}