import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {LoginComponent} from './pages/login/view/login.component';
import {HomeComponent} from './pages/home/view/home.component';
import {CompanyComponent} from './pages/company/view/company.component';
import {StudentComponent} from './pages/student/view/student.component';
import {CompanyProfileComponent} from './pages/company-profile/view/company-profile.component';
import {AppointmentsComponent} from "./pages/appointments/appointments.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";

// TODO Translate title
const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, title: 'Login'},
  {
    path: 'home',
    component: HomeComponent,
    title: 'Startseite',
    canActivate: [AuthGuard],
  },
  {
    path: 'company',
    component: CompanyComponent,
    title: 'Unternehmen',
    canActivate: [AuthGuard],
  },
  {
    path: 'student',
    component: StudentComponent,
    title: 'Studenten',
    canActivate: [AuthGuard],
  },
  {
    path: 'company-profile/:companyId',
    component: CompanyProfileComponent,
    title: 'Unternehmen',
    canActivate: [AuthGuard],
  },
  {
    path: 'appointments/:companyId',
    component: AppointmentsComponent,
    title: 'Termine',
    canActivate: [AuthGuard],
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
