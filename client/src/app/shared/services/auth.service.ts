import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from './auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  public registerUser(userCreds: any): Observable<UserResponse> {
    return this.http.post<UserResponse>('http://localhost:3000/app/register', userCreds);
  }

  public loginUser(userCreds: any): Observable<UserResponse> {
    return this.http.post<UserResponse>('http://localhost:3000/app/login', userCreds);
  }
  
  public logoutUser(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/app/logout', {});
  }
}
