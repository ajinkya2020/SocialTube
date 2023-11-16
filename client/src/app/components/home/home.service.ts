import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) { }

  public fetchVideos(): Observable<Object[]> {
    return this.http.get<Object[]>('http://localhost:3000/videos');
  }
}
