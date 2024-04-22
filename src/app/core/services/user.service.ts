﻿import {Injectable} from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {environment} from "../../../environments/environment";
import {AuthenticationResponse} from "../model/authenticationResponse";
import {UserType} from "../enum/userType";
import {RegisterUserInput} from "../model/registerUserInput";
import {Credentials} from "../model/credentials";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlPath: string = '/User';

  constructor(private http: HttpClient) {
  }

  // ****** GET ****** \\

  getUser(userType: UserType, institutionId: number, academicProgramId: number): Observable<User[] | null> {
    return this.http.get<User[]>(`${environment.apiBasePath}${this.urlPath}/GetAllUsers?userType=${userType}&institutionId=${institutionId}&academicProgramId=${academicProgramId}`).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  getUserById(id: string): Observable<User | null> {
    return this.http.get<User>(`${environment.apiBasePath}${this.urlPath}/GetUser?id=${id}`).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  // ****** POST ****** \\

  login(email: string, password: string): Observable<AuthenticationResponse | null> {
    return this.http.post<AuthenticationResponse>(`${environment.apiBasePath}${this.urlPath}/Login`, {
      password: password,
      email: email
    }).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  refresh(): Observable<AuthenticationResponse | null> {
    // TODO implement GlobalStorage / LocalStorage something
    return this.http.post<AuthenticationResponse>(`${environment.apiBasePath}${this.urlPath}/Refresh`, {refreshToken: ""}).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any | null> {
    // TODO implement GlobalStorage / LocalStorage something
    return this.http.post(`${environment.apiBasePath}${this.urlPath}/ChangePassword`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    }).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  generateUserCredentials(userId: string): Observable<Credentials | null> {
    return this.http.post<Credentials>(`${environment.apiBasePath}${this.urlPath}/ResetPassword?id=${userId}`, null).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  // TODO What is that
  deleteUserWithPassword(email: string, password: string): Observable<any | null> {
    return this.http.post<any>(`${environment.apiBasePath}${this.urlPath}/DeleteUserWithPassword`, {
      password: password,
      email: email,
    }).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  // ****** DELETE ****** \\

  deleteUser(id: string): Observable<any | null> {
    return this.http.delete(`${environment.apiBasePath}${this.urlPath}/DeleteUser?id=${id}`, {responseType: 'text'}).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
      map(result => !!result)
    );
  }

  // ****** PUT ****** \\

  register(input: RegisterUserInput): Observable<boolean> {
    return this.http.put(`${environment.apiBasePath}${this.urlPath}/Register`, input, {responseType: 'text'}).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.log('ERROR')
        console.error(error);
        return of(null);
      }),
      map(result => !!result)
    );
  }

  sendCredentials(user: User, password: string) {
    // TODO Translate
    let subject = '';
    let body = '';
 
    switch (user.userType) {
      case UserType.Student:
        subject = 'Einladung zum Dual Job Dating';
        body = `Liebe/r Student,\n\n` +
          'Wir laden dich herzlich zum Dual Job Dating ein.\n' +
          '\n' +
          'Hier sind deine Anmeldedaten:\n' +
          `\nE-Mail: ${user.email}\n` +
          `Passwort: ${password}\n` +
          '\n' +
          'Wir freuen uns darauf, dich beim Job-Dating-Event zu sehen und wünschen dir viel Erfolg!\n' +
          '\nMit freundlichen Grüßen,\nFH Joanneum';
        break;
      case UserType.Company:
        subject = 'Einladung zur Registrierung für das Dual Job Dating';
        body = `Sehr geehrte Damen und Herren,\n\n` +
          'Wir laden Sie herzlich zur Registrierung für das Dual Job Dating ein.\n' +
          '\n' +
          'Bitte registrieren Sie sich über folgenden Link:\n' +
          `${environment.apiBasePath}/login` +
          '\n' +
          'Wir freuen uns darauf, Sie beim Job-Dating-Event zu sehen!\n' +
          '\nMit freundlichen Grüßen,\nFH Joanneum';
        break;
      default:
        subject = 'Neue Anmeldeinformationen';
        body = 'Hier sind die neuen Anmeldedaten:\n' +
          `\nE-Mail: ${user.email}\n` +
          `Passwort: ${password}`;
        break;
    }

    window.location.href = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}