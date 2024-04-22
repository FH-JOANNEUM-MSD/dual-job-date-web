import { Injectable } from '@angular/core';
import { AuthenticationResponse } from '../core/model/authenticationResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessTokenKey: string = 'accessTokenKey';
  refreshTokenKey: string = 'refreshTokenKey';

  constructor() {}

  setCredentials(authResponse: AuthenticationResponse): void {
    localStorage.setItem(this.accessTokenKey, authResponse.accessToken);
    localStorage.setItem(this.refreshTokenKey, authResponse.refreshToken);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.accessTokenKey) !== null;
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
  }
}
