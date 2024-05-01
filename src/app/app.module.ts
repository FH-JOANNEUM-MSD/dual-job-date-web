import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/view/login.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule,} from '@angular/common/http';
import {HomeComponent} from './pages/home/view/home.component';
import {CompanyComponent} from './pages/company/view/company.component';
import {StudentComponent} from './pages/student/view/student.component';
import {HeadernavigationComponent} from './custom-components/header-navigation/view/header-navigation.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {TokenInterceptor} from './utils/token-interceptor';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {StudentDialogComponent} from './dialogs/student-dialog/student-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {CompanyDialogComponent} from "./dialogs/company-dialog/company-dialog.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {CompanyProfileComponent} from "./pages/company-profile/view/company-profile.component";
import {MatPaginatorModule} from "@angular/material/paginator";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CompanyComponent,
    StudentComponent,
    HeadernavigationComponent,
    StudentDialogComponent,
    CompanyDialogComponent,
    PageNotFoundComponent,
    CompanyProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinner,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    MatMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
