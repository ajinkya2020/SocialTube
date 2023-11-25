import { Component, OnInit } from "@angular/core";
import { VideoDto } from "./video.interface";
import { HomeService } from "../home/home.service";

@Component({
  selector: 'app-video',
  template: `
    <div class="video-content m-3">
      <video controls src="{{displayedVideo?.videoUrl}}" type="video/mp4" width="1300" height="600"></video>
      <div class="video-footer">
        <span class="d-block"><b>{{displayedVideo?.title}}</b></span>
        <span class="d-block video-username">{{displayedVideo?.username}}</span>
      </div>
    </div>
  `
})
export class VideoComponent implements OnInit {
  public displayedVideo!: VideoDto;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.setVideo();
  }

  ngOnDestroy() {
    localStorage.removeItem('displayedVideo');
  }

  public setVideo() {
    let currentVideo = localStorage.getItem('displayedVideo');
    this.displayedVideo = !!currentVideo ? JSON.parse(currentVideo) : null;
    if(!!this.displayedVideo.viewsCount) {
      this.displayedVideo.viewsCount++;
    } else {
      this.displayedVideo.viewsCount = 1;
    }
    this.homeService.updateVideo(this.displayedVideo).subscribe((res) => {
      console.log(res);
    })
  }
}