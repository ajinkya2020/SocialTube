import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from './auth.interface';
import { API_BASE_PATH } from './constants/common.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  public registerUser(userCreds: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(API_BASE_PATH + 'app/register', userCreds);
  }

  public loginUser(userCreds: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(API_BASE_PATH + 'app/login', userCreds);
  }
  
  public logoutUser(): Observable<any> {
    return this.http.post<any>(API_BASE_PATH + 'app/logout', {});
  }
}
