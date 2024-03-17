import { Component } from '@angular/core';

@Component({
  selector: 'app-headernavigation',
  templateUrl: './header-navigation.component.html',
  styleUrl: './header-navigation.component.scss',
})
export class HeadernavigationComponent {
  navLinks = [
    { path: '/home', label: 'Startseite' },
    { path: '/company', label: 'Unternehmen' },
    { path: '/student', label: 'Studenten' },
  ];
}
