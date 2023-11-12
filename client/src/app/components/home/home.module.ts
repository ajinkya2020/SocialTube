import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { RouterModule, Routes } from "@angular/router";

const homeRoutes: Routes = [
  { path: '',  component: HomeComponent }
];

export const homeRouting = RouterModule.forChild(homeRoutes);

@NgModule({
  declarations: [ HomeComponent ],
  imports: [ homeRouting ],
  providers: []
})
export class HomeModule { }