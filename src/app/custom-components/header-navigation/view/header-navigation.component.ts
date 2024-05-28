import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserType } from 'src/app/core/enum/userType';
import { DialogService } from '../../../services/dialog.service';
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-headernavigation',
  templateUrl: './header-navigation.component.html',
  styleUrl: './header-navigation.component.scss',
})
export class HeadernavigationComponent implements OnInit {
  navLinks: any[] = [];
  currentPage: string | undefined;

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

    this.updatePageTitle(this.router.url);
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openChangePasswordDialog(): void {
    this.dialogService.openChangePasswordDialog().subscribe();
  }

  updatePageTitle(url: string) {
    // Here you can add logic to map URLs to human-readable page names
    if (url.startsWith('/company-profile/')) {
      this.currentPage = 'Unternehmensprofil';
    } else {
      // Map URLs to human-readable page names
      switch (url) {
        case '/home':
          this.currentPage = 'Startseite';
          break;
        case '/company':
          this.currentPage = 'Unternehmen';
          break;
        case '/student':
          this.currentPage = 'Studenten';
          break;
        // Add other cases as needed
        default:
          this.currentPage = '404';
          break;
      }
    }
  }
}
