import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {UserType} from 'src/app/core/enum/userType';
import {DialogService} from '../../../services/dialog.service';

@Component({
  selector: 'app-headernavigation',
  templateUrl: './header-navigation.component.html',
  styleUrl: './header-navigation.component.scss',
})
export class HeadernavigationComponent implements OnInit {
  navLinks: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    const userType = this.authService.getUserType();
    const companyId = this.authService.getCompanyId();

    if (userType === UserType.Company) {
      this.navLinks = [
        {path: `/appointments/${companyId}`, label: 'Termine'},
        {path: `/company-profile/${companyId}`, label: 'Profil'},
      ];
    } else {
      this.navLinks = [
        {path: '/home', label: 'Startseite'},
        {path: '/company', label: 'Unternehmen'},
        {path: '/student', label: 'Studenten'},
      ];
    }
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openChangePasswordDialog(): void {
    this.dialogService.openChangePasswordDialog().subscribe();
  }
}
