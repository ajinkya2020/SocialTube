import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCredentials, UserInfo, UserResponse } from './auth.interface';
import { API_BASE_PATH } from './constants/common.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_BASE_PATH: string = '/auth';

  constructor(private http: HttpClient) { }

  public registerUser(userCreds: UserCredentials): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_BASE_PATH}${this.AUTH_BASE_PATH}/register`, userCreds);
  }

  public loginUser(userCreds: UserCredentials): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_BASE_PATH}${this.AUTH_BASE_PATH}/login`, userCreds);
  }
  
  public logoutUser(): Observable<any> {
    return this.http.post<any>(`${API_BASE_PATH}${this.AUTH_BASE_PATH}/logout`, {});
  }

  public updateUser(user: UserInfo): Observable<any> {
    return this.http.put<any>(`${API_BASE_PATH}${this.AUTH_BASE_PATH}/user`, user);
  }

  public getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${API_BASE_PATH}${this.AUTH_BASE_PATH}/currentuser`);
  }
}
