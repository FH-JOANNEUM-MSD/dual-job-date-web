import {Injectable} from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {environment} from "../../../environments/environment";
import {AuthenticationResponse} from "../model/authenticationResponse";
import {UserType} from "../enum/userType";
import {RegisterUserInput} from "../model/registerUserInput";

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

  // TODO how should i know my userId if im not logged in
  resetPassword(userId: string): Observable<any | null> {
    // TODO implement GlobalStorage / LocalStorage something
    return this.http.post(`${environment.apiBasePath}${this.urlPath}/ResetPassword`, {id: userId}).pipe(
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
}
