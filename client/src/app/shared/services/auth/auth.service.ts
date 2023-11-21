import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from './auth.interface';
import { API_BASE_PATH } from './constants/common.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_BASE_PATH: string = '/auth';

  constructor(private http: HttpClient) { }

  public registerUser(userCreds: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_BASE_PATH}${this.AUTH_BASE_PATH}/register`, userCreds);
  }

  public loginUser(userCreds: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_BASE_PATH}${this.AUTH_BASE_PATH}/login`, userCreds);
  }
  
  public logoutUser(): Observable<any> {
    return this.http.post<any>(`${API_BASE_PATH}${this.AUTH_BASE_PATH}/logout`, {});
  }
}
