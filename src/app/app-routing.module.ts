import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './pages/login/view/login.component';
import { HomeComponent } from './pages/home/view/home.component';
import { CompanyComponent } from './pages/company/view/company.component';
import { StudentComponent } from './pages/student/view/student.component';
import { CompanyProfileComponent } from './pages/company-profile/view/company-profile.component';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
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
  { path: 'company-details/:id', component: CompanyProfileComponent },

  // TODO: Add the routes here for components
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
