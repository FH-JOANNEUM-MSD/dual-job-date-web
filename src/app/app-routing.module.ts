import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/view/login.component';
import { HomeComponent } from './pages/home/view/home.component';
import { CompanyComponent } from './pages/company/view/company.component';
import { StudentComponent } from './pages/student/view/student.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'home', component: HomeComponent, title: 'Startseite' },
  { path: 'company', component: CompanyComponent, title: 'Unternehmen' },
  { path: 'student', component: StudentComponent, title: 'Studenten' },

  // TODO: Add the routes here for components
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
