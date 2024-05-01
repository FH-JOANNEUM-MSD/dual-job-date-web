import {Injectable} from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {User} from "../model/user";
import {environment} from "../../../environments/environment";
import {AuthenticationResponse} from "../model/authenticationResponse";
import {UserType} from "../enum/userType";
import {RegisterUserInput} from "../model/registerUserInput";
import {Credentials} from "../model/credentials";
import {AuthService} from "../../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlPath: string = '/User';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  // ****** GET ****** \\

  getUser(userType: UserType, institutionId: number | null, academicProgramId: number | null): Observable<User[] | null> {
    let params = new HttpParams();
    params = params.set('userType', userType);

    if (academicProgramId !== null) {
      params = params.set('academicProgramId', academicProgramId);
    }

    if (institutionId !== null) {
      params = params.set('institutionId', institutionId);
    }

    return this.http.get<User[]>(`${environment.apiBasePath}${this.urlPath}/GetAllUsers`, {
      params: params,
    }).pipe(
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
    const refreshToken = this.authService.getRefreshToken();
    if (!refreshToken) {
      return of(null);
    }
    return this.http.post<AuthenticationResponse>(`${environment.apiBasePath}${this.urlPath}/Refresh`, {refreshToken: refreshToken});
  }

  changePassword(oldPassword: string, newPassword: string): Observable<boolean | null> {
    return this.http.post(`${environment.apiBasePath}${this.urlPath}/ChangePassword`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    }).pipe(
      map(_ => {
        return true;
      }),
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(false);
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
        console.error(error);
        return of(null);
      }),
      map(result => !!result)
    );
  }

  registerCompaniesFromJson(input: {
    email: string,
    companyName: string
  }[], institutionId: number, academicProgramId: number): Observable<boolean> {
    return this.http.put(`${environment.apiBasePath}${this.urlPath}/RegisterCompaniesFromJson?institutionId=${institutionId}&academicProgramId=${academicProgramId}`,
      input, {responseType: 'text'}).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
      map(result => !!result)
    );
  }


  registerStudentsFromJson(input: {
    email: string
  }[], institutionId: number, academicProgramId: number): Observable<boolean> {
    return this.http.put(`${environment.apiBasePath}${this.urlPath}/RegisterStudentsFromJson?institutionId=${institutionId}&academicProgramId=${academicProgramId}`,
      input, {responseType: 'text'}).pipe(
      catchError(error => {
        // TODO implement Error Handling
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
