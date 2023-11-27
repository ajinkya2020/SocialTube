import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_PATH } from 'src/app/shared/services/auth/constants/common.constant';
import { VideoDto } from '../video/video.interface';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) { }

  public fetchVideos(): Observable<VideoDto[]> {
    return this.http.get<VideoDto[]>(API_BASE_PATH + '/videos');
  }

  public fetchVideoById(id: string): Observable<VideoDto> {
    return this.http.get<VideoDto>(API_BASE_PATH + '/videos/' + id);
  }

  public uploadFile(fileParam: any) {
    let fileForm: FormData = new FormData;
    fileForm.set('file', fileParam.video);
    fileForm.set('title', fileParam.title);
    fileForm.set('desc', fileParam.desc);
    return this.http.post(API_BASE_PATH + '/videos', fileForm);
  }

  public updateVideo(videoParam: VideoDto) {
    return this.http.put(API_BASE_PATH + '/videos', videoParam);
  }
}
