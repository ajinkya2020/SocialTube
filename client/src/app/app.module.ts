import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeModule } from './components/home/home.module';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthService } from './shared/services/auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/services/auth/shared.module';
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
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
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
