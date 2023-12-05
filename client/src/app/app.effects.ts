import { Injectable } from "@angular/core";
import { AuthService } from "./shared/services/auth/auth.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as actionTypes from './app.actionTypes';
import { catchError, map, of, switchMap, mergeMap } from "rxjs";
import { UserCredentials } from "./shared/services/auth/auth.interface";
import { UserResponseObservable } from "./app.interface";

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}

  loadLoggedUser$ = createEffect(() => this.actions$.pipe(
    ofType(actionTypes.GET_USER_REQUEST),
    switchMap((req: UserCredentials) => {
      return this.authService.loginUser(req).pipe(
        map((res: any) => new actionTypes.GetUserSuccess(res)),
        catchError(error => of(new actionTypes.GetUserError(error)))
      )
    })
  ))
}