import { Component, OnInit } from "@angular/core";
import { HomeService } from "./home.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { VideoDto } from "../video/video.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserResponseObservable } from "src/app/app.interface";
import { Store } from "@ngrx/store";
import { logUserIn } from "../header/header.component";

@Component({
  selector: 'app-home',
  template: `
    <div class="video-container">
      <div class="video-content" *ngFor="let postedVideo of postedVideos">
        <div (click)="redirectToVideo(postedVideo)">
          <video src="{{postedVideo?.videoUrl}}" type="video/mp4"></video>
          <div class="video-footer">
            <span class="d-block"><b>{{postedVideo?.title}}</b></span>
            <span class="d-block video-username">{{postedVideo?.username}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="file-upload-container">
      <div *ngIf="!!(loggedUserData$ | async)?.data" class="upload-content">
        <form class="d-flex" [formGroup]="uploadVideoForm">
          <input class="file-upload" type="file" (change)="attachFile($event)">
          <div class="d-flex">
            <input id="videoTitle" class="form-control bg-dark text-white me-2" type="text" placeholder="Video title" formControlName="title">
            <textarea  id="videoDesc" class="form-control bg-dark text-white me-2" type="text" placeholder="Video description" formControlName="desc"></textarea>
          </div>
          <button class="btn btn-primary" [disabled]="!uploadVideoForm.valid || !uploadedFile" (click)="uploadFile()">Upload</button>
        </form>
      </div>
      <div *ngIf="!(loggedUserData$ | async)?.data" class="upload-placeholder">
        Login to upload a video
      </div>
    </div>
    <app-spinner *ngIf="isLoading"></app-spinner>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public postedVideos: any[] = [];
  public isLoading: boolean = false;
  public uploadedFile!: File;
  public uploadVideoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
  });
  public loggedUserData$!: Observable<UserResponseObservable>;

  constructor(
    public homeService: HomeService,
    public router: Router,
    private store: Store
  ) { }

  ngOnInit() {
    this.fetchVideos();
    this.loggedUserData$ = this.store.select(logUserIn);
  }

  public fetchVideos() {
    this.isLoading = true;
    this.homeService.fetchVideos()
      .subscribe({
        next: (res) => {
          this.postedVideos = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      })
  }

  public attachFile(fileEvent: any) {
    this.uploadedFile = fileEvent.target.files[0];
    console.log(this.uploadedFile);
  }

  public uploadFile() {
    this.isLoading = true;
    let uploadParams = {
      video: this.uploadedFile,
      title: this.uploadVideoForm.controls['title'].value,
      desc: this.uploadVideoForm.controls['desc'].value
    }
    this.homeService.uploadFile(uploadParams).subscribe((res) => {
      console.log(res);
      this.isLoading = false;
      this.fetchVideos();
    })
  }

  public redirectToVideo(videoParam: VideoDto) {
    this.router.navigate(['/video'], {
      queryParams: {
        id: videoParam._id
      }
    });
  }
}