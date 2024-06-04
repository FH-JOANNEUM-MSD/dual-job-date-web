import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import { UserType } from 'src/app/core/enum/userType';
import { DialogService } from '../../../services/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {CompanyService} from '../../../core/services/company.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-headernavigation',
  templateUrl: './header-navigation.component.html',
  styleUrl: './header-navigation.component.scss',
})
export class HeadernavigationComponent implements OnInit {
  navLinks: any[] = [];
  currentPage: string | undefined;
  userType: UserType | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService,
    private translateService: TranslateService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.userType = this.authService.getUserType();
    const companyId = this.authService.getCompanyId();

    if (this.userType === UserType.Company) {
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

  ngAfterViewInit(): void {
    // Defer the call to updatePageTitle to ensure the view is fully initialized
    setTimeout(() => {
      this.updatePageTitle(this.router.url);
    });
  }

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
      this.currentPage = this.translateService.instant(
        'navigation.companyProfile'
      );
    }else if(url.startsWith('/appointments/')){
      if(this.userType === UserType.Company){
        this.currentPage = this.translateService.instant(
          'navigation.appointments'
        );
      }else{
        let companyId: any = this.route.snapshot.paramMap.get('companyId');
        companyId = Number(companyId);
        this.companyService.getCompanyById(companyId).subscribe((result) => {
          if (!result) {
            return;
          }
          console.log(result)
          this.currentPage = result.name;
        });
      }
    } else {
      // Map URLs to human-readable page names
      switch (url) {
        case '/home':
          this.currentPage = this.translateService.instant(
            'navigation.homePage'
          );
          break;
        case '/company':
          this.currentPage = this.translateService.instant(
            'navigation.companies'
          );
          break;
        case '/student':
          this.currentPage = this.translateService.instant(
            'navigation.students'
          );
          break;
        // Add other cases as needed
        default:
          this.currentPage = this.translateService.instant(
            '404.notFound'
          );
          break;
      }
    }
  }
}
