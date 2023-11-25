import { NgModule } from "@angular/core";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { NotificationComponent } from "../../components/notification.component";

@NgModule({
  declarations: [
    SpinnerComponent,
    NotificationComponent
  ],
  exports:[
    SpinnerComponent,
    NotificationComponent
  ]
})
export class SharedModule { }