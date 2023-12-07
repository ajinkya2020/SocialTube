import { Component, OnInit } from "@angular/core";
import { VideoDto } from "./video.interface";
import { HomeService } from "../home/home.service";
import { ActivatedRoute } from "@angular/router";
import * as faSolidIcons from '@fortawesome/free-solid-svg-icons';
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { UserResponseObservable } from "src/app/app.interface";
import { logUserIn } from "../header/header.component";
import { UserInfo } from "src/app/shared/services/auth/auth.interface";

@Component({
  selector: 'app-video',
  template: `
    <div class="video-content m-3">
      <video controls src="{{displayedVideo?.videoUrl}}" type="video/mp4" width="1300" height="600"></video>
      <div class="video-footer">
        <div class="d-flex">
          <div class="d-inline">
            <span class="d-block text-truncate" style="max-width: 50rem;" title="{{displayedVideo?.title}}"><b>{{displayedVideo?.title}}</b></span>
            <span class="d-block video-username">{{displayedVideo?.username}}</span>
          </div>
          <button class="btn btn-secondary my-auto ms-5 subscribe-button">Subscribe</button>
        </div>
        <div>
          <div class="d-inline video-action">
            <button
              class="btn me-2"
              [ngClass]="likedByUser ? 'btn-light' : 'btn-secondary'"
              (click)="likeVideo()"
            >
              <fa-icon
                class="me-1"
                [icon]="faSolidIcons.faThumbsUp"
              ></fa-icon>
              <b>{{displayedVideo?.likes}}</b>
            </button>
            <button
              class="btn me-2"
              [ngClass]="dislikedByUser ? 'btn-light' : 'btn-secondary'"
              (click)="dislikeVideo()"
            >
              <fa-icon
                class="me-1"
                [icon]="faSolidIcons.faThumbsDown"
              ></fa-icon>
              <b>{{displayedVideo?.dislikes}}</b>
            </button>
          </div>
          <span><b>{{displayedVideo?.viewsCount + ' '}} view(s)</b></span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  public displayedVideo!: VideoDto;
  public faSolidIcons = faSolidIcons;
  public likedByUser: boolean = false;
  public dislikedByUser: boolean = false;
  public loggedUser!: UserInfo;
  public loggedUserData$!: Observable<UserResponseObservable>;

  constructor(
    private router: ActivatedRoute,
    private homeService: HomeService,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    this.loggedUserData$ = this.store.select(logUserIn);
    this.loggedUserData$.subscribe((res) => {
      if(!!res.data && !res.isFetching) {
        this.loggedUser = res.data;
      }
    })
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
      if(this.loggedUser?.likedVideos.includes(this.displayedVideo._id)) {
        this.likedByUser = true;
      } else {
        this.likedByUser = false;
      }
      if(this.loggedUser?.dislikedVideos.includes(this.displayedVideo._id)) this.dislikedByUser = true;
      else this.dislikedByUser = false;
      this.updateVideo();
    })
  }

  public updateVideo() {
    this.homeService.updateVideo(this.displayedVideo).subscribe((res) => {
      console.log(res);
    })
  }

  public updateUser() {
    this.authService.updateUser(this.loggedUser).subscribe((res) => {
      console.log(res);
      localStorage.setItem('loggedUser', JSON.stringify(res))
      this.loggedUser = res;
    })
  }

  public likeVideo() {
    this.likedByUser = !this.likedByUser;
    if(this.displayedVideo?.likes != null || this.displayedVideo?.likes != undefined) {
      if(this.likedByUser) this.displayedVideo.likes++;
      else this.displayedVideo.likes--;
    } else {
      if(this.likedByUser) this.displayedVideo.likes = 1;
    }
    if(this.likedByUser) {
      this.loggedUser.likedVideos.push(this.displayedVideo._id);
      this.updateVideo();
      this.updateUser();
    }
    else {
      let videoIdx: number = this.loggedUser.likedVideos.findIndex((video: string) => (video === this.displayedVideo._id));
      if(videoIdx !== -1) this.loggedUser.likedVideos.splice(videoIdx, 1);
      this.updateVideo();
      this.updateUser();
    }
  }

  public dislikeVideo() {
    this.dislikedByUser = !this.dislikedByUser;
    if(this.displayedVideo?.dislikes != null || this.displayedVideo?.dislikes != undefined) {
      if(this.dislikedByUser) this.displayedVideo.dislikes++;
      else this.displayedVideo.dislikes--;
    } else {
      if(this.dislikedByUser) this.displayedVideo.dislikes = 1;
    }
    if(this.dislikedByUser) {
      this.loggedUser.dislikedVideos.push(this.displayedVideo._id);
      this.updateVideo();
      this.updateUser();
    }
    else {
      let videoIdx: number = this.loggedUser.dislikedVideos.findIndex((video: string) => (video === this.displayedVideo._id));
      if(videoIdx !== -1) this.loggedUser.dislikedVideos.splice(videoIdx, 1);
      this.updateVideo();
      this.updateUser();
    }
  }
}