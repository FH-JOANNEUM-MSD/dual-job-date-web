import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/view/login.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [BrowserModule, AppRoutingModule, TranslateModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
