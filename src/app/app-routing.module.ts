import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './pages/login/view/login.component';
import { HomeComponent } from './pages/home/view/home.component';
import { CompanyComponent } from './pages/company/view/company.component';
import { StudentComponent } from './pages/student/view/student.component';
import { CompanyProfileComponent } from './pages/company-profile/view/company-profile.component';

const routes: Routes = [
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
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
