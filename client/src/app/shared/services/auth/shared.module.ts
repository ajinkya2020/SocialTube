import { NgModule } from "@angular/core";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { NotificationComponent } from "../../components/notification.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatMenuModule } from '@angular/material/menu'; 
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SpinnerComponent,
    NotificationComponent
  ],
  imports: [
    FontAwesomeModule,
    MatMenuModule,
    MatIconModule
  ],
  exports:[
    FontAwesomeModule,
    SpinnerComponent,
    NotificationComponent,
    MatMenuModule,
    MatIconModule
  ]
})
export class SharedModule { }