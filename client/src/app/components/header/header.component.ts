import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import * as faSolidIcons from '@fortawesome/free-solid-svg-icons';
import { Store, createFeatureSelector, createSelector } from "@ngrx/store";
import { Observable, finalize } from "rxjs";
import { GET_USER_REQUEST } from "src/app/app.actionTypes";
import { AppReducerState, UserResponseObservable } from "src/app/app.interface";
import { UserCredentials, UserInfo, UserResponse } from "src/app/shared/services/auth/auth.interface";
import { AuthService } from "src/app/shared/services/auth/auth.service";

@Component({
  selector: 'app-header',
  template: `
    <div class="header-container m-3">
      <span class="app-title action-item" (click)="routeToHome()">
        <fa-icon class="me-1" [icon]="faSolidIcons.faVideo"></fa-icon>
        <span>SocialTube</span>
      </span>
      <span class="profile-menu">
        <div *ngIf="!(loggedUserData$ | async)?.data" class="d-inline">
          <button class="btn btn-primary me-2" (click)="toggleAuthAction('Login'); toggleProfileVisibility()">Login</button>
          <button class="btn btn-primary me-2" (click)="toggleAuthAction('Register'); toggleProfileVisibility()">Register</button>
        </div>
        <div *ngIf="!!(loggedUserData$ | async)?.data" class="d-inline">
          <span class="action-item" (click)="toggleProfilePicModalVisibility()">
            <fa-icon
              *ngIf="!(loggedUserData$ | async)?.data?.profilePictureUrl"
              class="me-2"
              [icon]="faSolidIcons.faUser"
            ></fa-icon>
            <img
              mat-icon-button
              class="profile-pic me-2"
              *ngIf="!!(loggedUserData$ | async)?.data?.profilePictureUrl"
              src="{{(loggedUserData$ | async)?.data?.profilePictureUrl}}"
              [matMenuTriggerFor]="profileMenu"
            >
            <span class="me-4">{{ (loggedUserData$ | async)?.data?.username }}</span>
          </span>
          <fa-icon
            class="action-item me-2"
            title="Logout"
            [icon]="faSolidIcons.faRightFromBracket"
            (click)="logoutUser()"
          ></fa-icon>
        </div>
      </span>
      <div
        class="modal"
        tabindex="-1"
        role="dialog"
        [ngStyle]="{ display: signinModalActive ? 'block' : 'none' }"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content bg-dark">
            <div class="modal-header">
              <h5 class="modal-title">{{ authAction }}</h5>
              <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="toggleProfileVisibility()"></button>
            </div>
            <div class="modal-body">
              <form [formGroup]="userCreds">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control bg-dark text-white" id="username" formControlName="username">
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control bg-dark text-white" id="password" formControlName="password">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="toggleProfileVisibility()">Close</button>
              <button type="button" class="btn btn-primary" (click)="authenticateUser(authAction)">{{ authAction }}</button>
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        class="modal"
        tabindex="-1"
        role="dialog"
        [ngStyle]="{ display: profilePicModalActive ? 'block' : 'none' }"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content bg-dark">
            <div class="modal-header">
              <h5 class="modal-title">{{ authAction }}</h5>
              <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="toggleProfilePicModalVisibility()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="password" class="form-label">Profile Picture</label>
                <input class="file-upload" type="file" (change)="attachFile($event)">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="toggleProfilePicModalVisibility()">Close</button>
              <button type="button" class="btn btn-primary" (click)="updateUser()">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <mat-menu #profileMenu="matMenu">
      <span>profile menu displayed</span>
    </mat-menu>
    <app-spinner
      *ngIf="
        isLoading
        || (loggedUserData$ | async)?.isFetching
      ">
    </app-spinner>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public faSolidIcons = faSolidIcons;
  public signinModalActive: boolean = false;
  public profilePicModalActive: boolean = false;
  public userCreds = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  public userProfilePic: FormControl = new FormControl('');
  public authAction: 'Login' | 'Register' | null = null;
  public isLoading: boolean = false;
  public profilePicture!: File;
  public loggedUser!: UserInfo;
  public loggedUserData$!: Observable<UserResponseObservable>;

  constructor(
    private router : Router,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    this.loggedUserData$ = this.store.select(logUserIn);
    this.loggedUserData$.subscribe((res) => {
      if(!!res.data && !res.isFetching) {
        console.log(res);
        this.loggedUser = JSON.parse(JSON.stringify(res.data));
      }
    })
  }

  public toggleProfileVisibility() {
    this.userCreds.get('username')?.setValue('');
    this.userCreds.get('password')?.setValue('');
    this.signinModalActive = !this.signinModalActive;
    console.log("modalActive " + this.signinModalActive);
  }

  public toggleProfilePicModalVisibility() {
    this.profilePicModalActive = !this.profilePicModalActive;
  }

  public toggleAuthAction(action: 'Login' | 'Register' | null) {
    this.authAction = action;
    console.log("authAction " + this.authAction);
  }

  public authenticateUser(action: 'Login' | 'Register' | null) {
    if(!!action && action === 'Login') this.loginUser();
    else if(!!action && action === 'Register') this.registerUser();
  }

  public attachFile(fileEvent: any) {
    this.profilePicture = fileEvent.target.files[0];
    console.log(this.profilePicture);
  }

  public registerUser() {
    let userReq: UserCredentials = {
      username: this.userCreds.get('username')?.value || '',
      password: this.userCreds.get('password')?.value || '',
      file: this.profilePicture
    }
    
    this.toggleProfileVisibility();
    this.toggleAuthAction(null);

    this.isLoading = true;
    this.authService.registerUser(userReq)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((res: UserResponse) => {
        console.log(res);
        location.reload();
      })
  }

  public loginUser() {
    let userReq: UserCredentials = {
      username: this.userCreds.get('username')?.value || '',
      password: this.userCreds.get('password')?.value || ''
    }
    
    this.toggleProfileVisibility();
    this.toggleAuthAction(null);

    this.authService.loginUser(userReq)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((res: UserResponse) => {
        console.log(res);
        location.reload();
      })
  }

  public logoutUser() {
    this.isLoading = true;
    this.authService.logoutUser().subscribe((res) => {
      if(!!res) {
        this.isLoading = false;
        location.reload();
      }
    })
  }

  public updateUser() {
    this.loggedUser.file = this.profilePicture;
    let userReq: FormData = new FormData;
    userReq.set('_id', this.loggedUser._id);
    userReq.set('file', this.profilePicture);
    this.authService.updateUserProfilePic(userReq).subscribe((res) => {
      console.log(res);
      this.store.dispatch(GET_USER_REQUEST());
    })
  }

  public routeToHome() {
    this.router.navigate(['/']);
  }
}

export const selectActivityState =
  createFeatureSelector<AppReducerState>('appReducer');

// select the property "activities" defined in Activity State. 
export const logUserIn = createSelector(
  selectActivityState,
  (state) => state.user
);