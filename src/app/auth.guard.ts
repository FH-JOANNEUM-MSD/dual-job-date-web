import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './pages/login/core/auth.service'; // Your authentication service

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // If the user is authenticated, return true to allow the route activation
      return true;
    } else {
      // If the user is not authenticated, redirect them to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
