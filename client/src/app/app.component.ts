import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from './shared/services/auth/auth.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  public static loggedUser: UserInfo;

  constructor(
    private router : Router
  ) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  public setCurrentUser() {
    let currentUser = localStorage.getItem("loggedUser");
    AppComponent.loggedUser = !!currentUser ? JSON.parse(currentUser) : null;
  }
}
