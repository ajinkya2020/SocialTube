import { Action, createAction, props } from "@ngrx/store"
import { UserCredentials, UserInfo, UserResponse } from "./shared/services/auth/auth.interface";

export const GET_USER_REQUEST = createAction('[auth] Get User Request');
export const GET_USER_SUCCESS = createAction('[auth] Get User Success', props<{payload: UserInfo}>());
export const GET_USER_ERROR = createAction('[auth] Get User Error', props<{payload: any}>());