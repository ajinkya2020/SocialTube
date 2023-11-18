import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { HomeService } from "./home.service";
import { SpinnerComponent } from "../spinner/spinner.component";
import { SharedModule } from "src/app/shared/services/auth/shared.module";

const homeRoutes: Routes = [
  { path: '',  component: HomeComponent }
];

export const homeRouting = RouterModule.forChild(homeRoutes);

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    homeRouting,
    CommonModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [ HomeService ]
})
export class HomeModule { }