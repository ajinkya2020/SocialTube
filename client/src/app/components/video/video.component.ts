import { Component, OnInit } from "@angular/core";
import { VideoDto } from "./video.interface";
import { HomeService } from "../home/home.service";
import { ActivatedRoute } from "@angular/router";
import * as faSolidIcons from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-video',
  template: `
    <div class="video-content m-3">
      <video controls src="{{displayedVideo.videoUrl}}" type="video/mp4" width="1300" height="600"></video>
      <div class="video-footer">
        <div class="d-flex">
          <div class="d-inline">
            <span class="d-block text-truncate" style="max-width: 50rem;"><b>{{displayedVideo.title}}</b></span>
            <span class="d-block video-username">{{displayedVideo.username}}</span>
          </div>
          <button class="btn btn-secondary my-auto ms-5 subscribe-button">Subscribe</button>
        </div>
        <div>
          <div class="d-inline video-action">
            <button
              class="btn btn-secondary me-2"
              (click)="likeVideo()"
            >
              <fa-icon
                class="me-1"
                [icon]="faSolidIcons.faThumbsUp"
              ></fa-icon>
              <b>{{displayedVideo.likes}}</b>
            </button>
            <button
              class="btn btn-secondary me-2"
              (click)="dislikeVideo()"
            >
              <fa-icon
                class="me-1"
                [icon]="faSolidIcons.faThumbsDown"
              ></fa-icon>
              <b>{{displayedVideo.dislikes}}</b>
            </button>
          </div>
          <span><b>{{displayedVideo.viewsCount + ' '}} view(s)</b></span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  public displayedVideo!: VideoDto;
  public faSolidIcons = faSolidIcons;

  constructor(
    private homeService: HomeService,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      this.setVideo(params['id']);
    })
  }

  ngOnDestroy() {
    localStorage.removeItem('displayedVideo');
  }

  public setVideo(videoId: string) {
    this.homeService.fetchVideoById(videoId).subscribe((res: VideoDto) => {
      this.displayedVideo = res;
      if(this.displayedVideo?.viewsCount != null || this.displayedVideo?.viewsCount != undefined) {
        this.displayedVideo.viewsCount++;
      } else {
        this.displayedVideo.viewsCount = 1;
      }
      this.updateVideo();
    })
  }

  public updateVideo() {
    this.homeService.updateVideo(this.displayedVideo).subscribe((res) => {
      console.log(res);
    })
  }

  public likeVideo() {
    if(this.displayedVideo?.likes != null || this.displayedVideo?.likes != undefined) {
      this.displayedVideo.likes++;
    } else {
      this.displayedVideo.likes = 1;
    }
    this.updateVideo();
  }

  public dislikeVideo() {
    if(this.displayedVideo?.dislikes != null || this.displayedVideo?.dislikes != undefined) {
      this.displayedVideo.dislikes++;
    } else {
      this.displayedVideo.dislikes = 1;
    }
    this.updateVideo();
  }
}