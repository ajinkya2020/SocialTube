import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeModule } from './components/home/home.module';
import { ProfileComponent } from './components/profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from './shared/services/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/services/auth/shared.module';
import { VideoComponent } from './components/video/video.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { appReducer } from './app.reducer';
import { VideoModule } from './components/video/video.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    StoreModule.forRoot({ appReducer: appReducer }),
    EffectsModule.forRoot(AppEffects),
    SharedModule,
    HomeModule,
    VideoModule
  ],
  providers: [ AuthService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
