import { Injectable } from '@angular/core';
import { AuthenticationResponse } from '../core/model/authenticationResponse';
import { UserType } from '../core/enum/userType';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessTokenKey: string = 'accessTokenKey';
  refreshTokenKey: string = 'refreshTokenKey';
  userType: string = 'userType';
  userID: string = 'userID';

  constructor() {}

  setCredentials(authResponse: AuthenticationResponse): void {
    localStorage.setItem(this.accessTokenKey, authResponse.accessToken);
    localStorage.setItem(this.refreshTokenKey, authResponse.refreshToken);
    localStorage.setItem(this.userType, `${authResponse.userType}`);
    localStorage.setItem(this.userID, authResponse.userId);
  }

  isAuthenticated(): boolean {
    return (
      localStorage.getItem(this.accessTokenKey) !== null &&
      localStorage.getItem(this.refreshTokenKey) !== null
    );
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userType);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getUserType(): UserType | null {
    const userTypeString = localStorage.getItem(this.userType);
    if (userTypeString !== null) {
      const userTypeNumber = parseInt(userTypeString, 10);
      if (!isNaN(userTypeNumber) && userTypeNumber in UserType) {
        return userTypeNumber as UserType;
      }
    }
    return null;
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userID);
  }
}
