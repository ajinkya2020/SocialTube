import { Action, createAction, props } from "@ngrx/store"
import { UserCredentials, UserResponse } from "./shared/services/auth/auth.interface";

export const GET_USER_REQUEST = createAction('[auth] Get User Request', props<{payload: UserCredentials}>());
export const GET_USER_SUCCESS = createAction('[auth] Get User Success', props<{payload: UserResponse}>());
export const GET_USER_ERROR = createAction('[auth] Get User Error', props<{payload: any}>());