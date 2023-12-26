import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
  templateUrl: './header.component.html',
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
  public userLoggedUsername: string = '';
  public authAction: 'Login' | 'Register' | null = null;
  public isLoading: boolean = false;
  public profilePicture!: File;
  public loggedUser!: UserInfo;
  public uploadedProfilePicUrl: any = '';
  public loggedUserData$!: Observable<UserResponseObservable>;
  public showProfilePicActions: boolean = false;

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
        this.userLoggedUsername = this.loggedUser.username;
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

    let reader = new FileReader();
    if(fileEvent.target.files && fileEvent.target.files.length > 0) {
      let file = fileEvent.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadedProfilePicUrl = reader.result; 
      };
    }
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
    userReq.set('username', this.userLoggedUsername);
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