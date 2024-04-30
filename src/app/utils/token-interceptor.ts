import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {SnackbarService} from '../services/snackbar.service';
import {UserService} from "../core/services/user.service";
import {AuthService} from "../services/auth.service";
import {Router} from '@angular/router';
import {environment} from "../../environments/environment";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private snackBarService: SnackbarService,
    private userService: UserService,
    private authService: AuthService,
    private translateService: TranslateService,
    private router: Router
  ) {
  }

  //TODO Translate Error Messages with backend error codes

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthenticationToken(request)).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, request, next))
    );
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getAccessToken();
    return token ? request.clone({setHeaders: {Authorization: `Bearer ${token}`}}) : request;
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (error.error instanceof ErrorEvent) {
      return this.handleClientError(error);
    } else {
      return error.status === 401 ? this.handle401Error(request, next, error) : this.handleServerError(error);
    }
  }

  private handleClientError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = `Clientfehler: ${error.error.message}`;
    this.openSnackBar(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private handleServerError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = `Serverfehler: ${error.status} - ${error.statusText || error.error.message}`;
    this.openSnackBar(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse): Observable<HttpEvent<any>> {
    const refreshUrl = `${environment.apiBasePath}/User/Refresh`;
    if (request.url.includes(refreshUrl)) {
      return this.logoutUser();
    }
    return !this.isRefreshing ? this.refreshToken(request, next) : this.queueRequests(request, next);
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.userService.refresh().pipe(
      switchMap(response => {
        if (!response) {
          this.isRefreshing = false;
          return this.logoutUser();
        }
        this.isRefreshing = false;
        this.refreshTokenSubject.next(response.accessToken);
        return next.handle(this.addAuthenticationToken(request));
      }),
      catchError((_) => this.logoutUser())
    );
  }

  private queueRequests(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => next.handle(this.addAuthenticationToken(request)))
    );
  }

  private logoutUser(): Observable<never> {
    this.isRefreshing = false;
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.openSnackBar(this.translateService.instant('login.sessionExpired'));
    return throwError(() => new Error('Authentication required.'));
  }

  private openSnackBar(message: string) {
    this.snackBarService.error(message);
  }
}
