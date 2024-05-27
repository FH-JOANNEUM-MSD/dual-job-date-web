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
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    const userType = this.authService.getUserType();
    const companyId = this.authService.getCompanyId();
    const companyProfileRegex = new RegExp(`^/company-profile/${companyId}$`);

    if (userType === UserType.Company && !companyProfileRegex.test(state.url)) {
      this.router.navigate([`/company-profile/${companyId}`]);
      return false;
    }

    return true;
  }
}
