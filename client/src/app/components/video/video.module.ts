import { NgModule } from "@angular/core";
import { VideoComponent } from "./video.component";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "src/app/shared/services/auth/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { CommentComponent } from "./comment/comment.component";

const videoRoutes: Routes = [
  { path: '', component: VideoComponent }
];

const videoRouting = RouterModule.forChild(videoRoutes);

@NgModule({
  declarations: [
    VideoComponent,
    CommentComponent
  ],
  imports: [
    videoRouting,
    CommonModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class VideoModule { }