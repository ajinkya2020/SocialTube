import { Component, OnInit } from "@angular/core";
import { HomeService } from "./home.service";

@Component({
  selector: 'app-home',
  template: `
    <video *ngIf="!!postedVideos.length" controls src="{{postedVideos[0]?.videoUrl}}" type="video/mp4"></video>
    <app-spinner *ngIf="isLoading"></app-spinner>
  `
})
export class HomeComponent implements OnInit {
  public postedVideos: any[] = [];
  public isLoading: boolean = false;

  constructor(public homeService: HomeService) { }

  ngOnInit() {
    this.fetchVideos();
  }

  public fetchVideos() {
    this.isLoading = true;
    this.homeService.fetchVideos().subscribe((res: Object[]) => {
      console.log(res);
      this.postedVideos = res;
      this.isLoading = false;
    });
  }
}