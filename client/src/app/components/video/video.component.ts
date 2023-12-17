import { Component, OnInit } from "@angular/core";
import { CommentDto, VideoDto } from "./video.interface";
import { HomeService } from "../home/home.service";
import { ActivatedRoute } from "@angular/router";
import * as faSolidIcons from '@fortawesome/free-solid-svg-icons';
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { UserResponseObservable } from "src/app/app.interface";
import { logUserIn } from "../header/header.component";
import { UserInfo } from "src/app/shared/services/auth/auth.interface";
import { GET_USER_REQUEST } from "src/app/app.actionTypes";

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
          <button *ngIf="displayedVideo?.userId !== loggedUser?._id" class="btn btn-secondary my-auto ms-5 subscribe-button" (click)="subscribeToUser()">Subscribe</button>
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
      <div class="comment-container mt-5">
        <input id="commentField" class="form-control bg-dark text-white" type="text" placeholder="Add a comment" [(ngModel)]="commentToAdd.comment">
        <button type="button" class="btn btn-secondary mt-1 mb-3" [disabled]="!commentToAdd" (click)="addComment(commentToAdd)">Comment</button>
        <ng-container *ngFor="let comment of displayedVideo?.comments">
          <video-comment [comment]="comment.comment" [username]="comment.username"></video-comment>
        </ng-container>
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
  public commentToAdd: CommentDto = {username: '', comment: ''};
  public loggedUserData$!: Observable<UserResponseObservable>;

  constructor(
    private router: ActivatedRoute,
    private homeService: HomeService,
    private authService: AuthService,
    private store: Store
  ) {
    this.router.queryParams.subscribe((params) => {
      this.setVideo(params['id']);
    })
  }

  ngOnInit() {
    this.loggedUserData$ = this.store.select(logUserIn);
    this.loggedUserData$.subscribe((res) => {
      if(!!res.data && !res.isFetching) {
        console.log(res.data);
        this.setUser(res);
      }
    })
  }

  public setUser(userInfo: UserResponseObservable) {
    console.log(userInfo);
    this.loggedUser = JSON.parse(JSON.stringify(userInfo.data));
    console.log(this.loggedUser);
    
    this.commentToAdd.username = this.loggedUser.username;
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
      this.store.dispatch(GET_USER_REQUEST());
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

  public addComment(comment: CommentDto) {
    this.displayedVideo.comments?.push(comment);
    this.updateVideo();
  }

  public subscribeToUser() {
    console.log(this.displayedVideo);
    console.log(this.loggedUser);
    
    if(!!this.displayedVideo && !!this.loggedUser) {
      let subscribeUser = {
        _id: this.displayedVideo.userId,
        subscribers: [this.loggedUser._id]
      }
      console.log(subscribeUser);

      this.authService.updateUser(subscribeUser).subscribe((res) => {
        console.log(res);
      })
    }
  }
}