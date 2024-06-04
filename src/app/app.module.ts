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
import {CompanyProfileComponent} from "./pages/company-profile/view/company-profile.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ChangePasswordDialogComponent} from "./dialogs/change-password-dialog/change-password-dialog.component";
import {ConfirmDialogComponent} from "./dialogs/confirm-dialog/confirm-dialog.component";
import {AppointmentsComponent} from "./pages/appointments/appointments.component";
import {CalendarDateFormatter, CalendarModule, CalendarUtils, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {CustomDateFormatter} from "./utils/custom-date-formatter.provider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatCard} from "@angular/material/card";
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from "@danielmoncada/angular-datetime-picker";
import {MomentDateTimeAdapter, OwlMomentDateTimeModule} from "@danielmoncada/angular-datetime-picker-moment-adapter";

export const MY_FORMATS = {
  parseInput: 'DD.MM.YYYY HH:mm',
  fullPickerInput: 'DD.MM.YYYY HH:mm',
  datePickerInput: 'DD.MM.YYYY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

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
    CompanyProfileComponent,
    ChangePasswordDialogComponent,
    ConfirmDialogComponent,
    AppointmentsComponent,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatCard,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    CalendarUtils,
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'de'},
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_FORMATS}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
