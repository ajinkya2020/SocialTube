import { Component, OnInit } from "@angular/core";
import { HomeService } from "./home.service";

@Component({
  selector: 'app-home',
  template: `
    <video *ngIf="!!postedVideos.length" controls src="{{postedVideos[0]?.videoUrl}}" type="video/mp4"></video>
  `
})
export class HomeComponent implements OnInit {
  public postedVideos: any[] = [];

  constructor(public homeService: HomeService) { }

  ngOnInit() {
    this.homeService.fetchVideos().subscribe((res: Object[]) => {
      console.log(res);
      this.postedVideos = res;
    })
  }
}