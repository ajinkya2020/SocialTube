import { Component, OnInit } from "@angular/core";
import { HomeService } from "./home.service";

@Component({
  selector: 'app-home',
  template: `
    <video *ngIf="!!postedVideos.length" controls src="{{postedVideos[0]?.videoUrl}}" type="video/mp4"></video>
    <input type="file" class="file-upload" (change)="attachFile($event)">
    <button (click)="uploadFile()">Upload file</button>
    <app-spinner *ngIf="isLoading"></app-spinner>
  `
})
export class HomeComponent implements OnInit {
  public postedVideos: any[] = [];
  public isLoading: boolean = false;
  public uploadedFile!: File;

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

  public attachFile(fileEvent: any) {
    this.uploadedFile = fileEvent.target.files[0];
    console.log(this.uploadedFile);
  }

  public uploadFile() {
    this.isLoading = true;
    this.homeService.uploadFile(this.uploadedFile).subscribe((res) => {
      console.log(res);
      this.isLoading = false;
    })
  }
}