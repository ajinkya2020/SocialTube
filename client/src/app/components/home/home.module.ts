import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { HomeService } from "./home.service";

const homeRoutes: Routes = [
  { path: '',  component: HomeComponent }
];

export const homeRouting = RouterModule.forChild(homeRoutes);

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    homeRouting,
    CommonModule,
    HttpClientModule
  ],
  providers: [ HomeService ]
})
export class HomeModule { }