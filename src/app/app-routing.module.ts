import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/view/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  // TODO: Add the routes here for componentss

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
