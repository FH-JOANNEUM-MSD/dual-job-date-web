import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/view/login.component';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from "@angular/common/http";
import {HomeComponent} from "./pages/home/view/home.component";
import {CompanyComponent} from "./pages/company/view/company.component";
import {StudentComponent} from "./pages/student/view/student.component";
import { HeadernavigationComponent } from './custom-components/header-navigation/view/header-navigation.component';
import {environment} from "../environments/environment";
import {ApiModule, Configuration, ConfigurationParameters} from "../../generated-api";

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.apiBasePath,
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, CompanyComponent, StudentComponent, HeadernavigationComponent],
  imports: [
    ApiModule.forRoot(apiConfigFactory),
    BrowserModule, AppRoutingModule, TranslateModule, HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
