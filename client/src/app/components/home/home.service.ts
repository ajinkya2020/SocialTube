import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_PATH } from 'src/app/shared/services/auth/constants/common.constant';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) { }

  public fetchVideos(): Observable<Object[]> {
    return this.http.get<Object[]>(API_BASE_PATH + '/videos');
  }

  public uploadFile(fileParam: any) {
    let fileForm: FormData = new FormData;
    fileForm.set('file', fileParam);
    return this.http.post(API_BASE_PATH + '/videos', fileForm);
  }
}
