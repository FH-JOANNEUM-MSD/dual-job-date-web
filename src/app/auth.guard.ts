import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './services/auth.service'; // Your authentication service
import { Observable } from 'rxjs';
import { UserType } from './core/enum/userType';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    const userType = this.authService.getUserType();
    console.log(userType);
    console.log(UserType.Company);
    if (userType === UserType.Company && state.url !== '/company-profile') {
      this.router.navigate(['/company-profile']);
      return true;
    }

    return false;
  }
}
