import { NgModule } from "@angular/core";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { NotificationComponent } from "src/app/shared/components/notification.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatMenuModule } from '@angular/material/menu'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { AppModal } from "src/app/shared/components/modal/modal.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    SpinnerComponent,
    NotificationComponent,
    AppModal
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  exports:[
    FontAwesomeModule,
    SpinnerComponent,
    NotificationComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    AppModal
  ]
})
export class SharedModule { }