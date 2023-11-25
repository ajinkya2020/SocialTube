import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import * as faSolidIcons from '@fortawesome/free-solid-svg-icons';
import { finalize } from "rxjs";
import { UserInfo, UserResponse } from "src/app/shared/services/auth/auth.interface";
import { AuthService } from "src/app/shared/services/auth/auth.service";

@Component({
  selector: 'app-header',
  template: `
    <div class="header-container m-3">
      <span class="app-title action-item">
        <fa-icon class="me-1" [icon]="faSolidIcons.faVideo"></fa-icon>
        <span>SocialTube</span>
      </span>
      <span class="profile-menu">
        <div *ngIf="!loggedUser" class="d-inline">
          <button class="btn btn-primary me-2" (click)="toggleAuthAction('Login'); toggleProfileVisibility()">Login</button>
          <button class="btn btn-primary me-2" (click)="toggleAuthAction('Register'); toggleProfileVisibility()">Register</button>
        </div>
        <div *ngIf="!!loggedUser" class="d-inline">
          <span class="action-item">
            <fa-icon
              class="me-2"
              [icon]="faSolidIcons.faUser"
            ></fa-icon>
            <span class="me-4">{{ loggedUser.username }}</span>
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
        [ngStyle]="{ display: modalActive ? 'block' : 'none' }"
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
    </div>
    <app-spinner *ngIf="isLoading"></app-spinner>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public faSolidIcons = faSolidIcons;
  public modalActive: boolean = false;
  public userCreds = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  public loggedUser: UserInfo | undefined;
  public authAction: 'Login' | 'Register' | null = null;
  public isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    let currentUser = localStorage.getItem("loggedUser");
    this.loggedUser = !!currentUser ? JSON.parse(currentUser) : null;
  }

  public toggleProfileVisibility() {
    this.userCreds.get('username')?.setValue('');
    this.userCreds.get('password')?.setValue('');
    this.modalActive = !this.modalActive;
    console.log("modalActive " + this.modalActive);
  }

  public toggleAuthAction(action: 'Login' | 'Register' | null) {
    this.authAction = action;
    console.log("authAction " + this.authAction);
  }

  public authenticateUser(action: 'Login' | 'Register' | null) {
    if(!!action && action === 'Login') this.loginUser();
    else if(!!action && action === 'Register') this.registerUser();
  }

  public registerUser() {
    let userReq = {
      username: this.userCreds.get('username')?.value,
      password: this.userCreds.get('password')?.value
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
        this.loggedUser = res.user;
        localStorage.setItem("loggedUser", JSON.stringify(res.user));
        console.log("userInfo " + this.loggedUser);
        location.reload();
      })
  }

  public loginUser() {
    let userReq = {
      username: this.userCreds.get('username')?.value,
      password: this.userCreds.get('password')?.value
    }
    
    this.toggleProfileVisibility();
    this.toggleAuthAction(null);

    this.isLoading = true;
    this.authService.loginUser(userReq)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((res: UserResponse) => {
        console.log(res);
        this.loggedUser = res.user;
        localStorage.setItem("loggedUser", JSON.stringify(res.user));
        console.log("userInfo " + this.loggedUser);
        location.reload();
      })
  }

  public logoutUser() {
    this.isLoading = true;
    this.authService.logoutUser().subscribe((res) => {
      if(!!res) {
        localStorage.removeItem("loggedUser");
        this.loggedUser = undefined;
        this.isLoading = false;
        location.reload();
      }
    })
  }
}