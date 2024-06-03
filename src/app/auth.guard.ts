import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot,} from '@angular/router';
import {AuthService} from './services/auth.service'; // Your authentication service
import {UserType} from './core/enum/userType';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    const userType = this.authService.getUserType();
    const companyId = this.authService.getCompanyId();

    if (userType === UserType.Admin) {
      return true;
    } else if (userType === UserType.Company) {
      const allowedRoutes = [`/appointments/${companyId}`, `/company-profile/${companyId}`];
      if (allowedRoutes.includes(state.url)) {
        return true;
      } else {
        this.router.navigate(['/not-authorized']);
        return false;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
