import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  login(username: string, password: string): void {
    // TODO implement login logik
    if(localStorage.getItem('isAuthenticated') !== 'true'){
      localStorage.setItem('isAuthenticated', 'true');
    }
  }

  // Check if the user is logged in
  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  // Simulate a logout
  logout(): void {
    localStorage.removeItem('isAuthenticated');
  }
}
