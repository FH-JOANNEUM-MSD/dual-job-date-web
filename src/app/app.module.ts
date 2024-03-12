import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/view/login.component';
import {TranslateModule} from '@ngx-translate/core';
import {HomeComponent} from "./pages/home/view/home.component";
import {CompanyComponent} from "./pages/company/view/company.component";
import {StudentComponent} from "./pages/student/view/student.component";

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, CompanyComponent, StudentComponent],
  imports: [BrowserModule, AppRoutingModule, TranslateModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
