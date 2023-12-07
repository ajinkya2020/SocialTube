import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from './shared/services/auth/auth.interface';
import { Store } from '@ngrx/store';
import { GET_USER_REQUEST } from './app.actionTypes';
import { Observable } from 'rxjs';
import { UserResponseObservable } from './app.interface';
import { logUserIn } from './components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  public loggedUserData$!: Observable<UserResponseObservable>;

  constructor(
    private router : Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.loggedUserData$ = this.store.select(logUserIn);
    this.store.dispatch(GET_USER_REQUEST());
    this.loggedUserData$.subscribe((res: UserResponseObservable) => {
      if(!res.data && !res.isFetching) {
        this.router.navigate(['/']);
      }
    })
  }
}
