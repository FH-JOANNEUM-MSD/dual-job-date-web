import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserType } from 'src/app/core/enum/userType';

@Component({
  selector: 'app-headernavigation',
  templateUrl: './header-navigation.component.html',
  styleUrl: './header-navigation.component.scss',
})
export class HeadernavigationComponent implements OnInit {
  navLinks: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    const userType = this.authService.getUserType();

    if (userType === UserType.Company) {
      this.navLinks = [];
    } else {
      this.navLinks = [
        { path: '/home', label: 'Startseite' },
        { path: '/company', label: 'Unternehmen' },
        { path: '/student', label: 'Studenten' },
      ];
    }
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
