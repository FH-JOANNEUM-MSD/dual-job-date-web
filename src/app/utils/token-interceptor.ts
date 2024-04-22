import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SnackbarService} from '../services/snackbar.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private snackBarService: SnackbarService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Füge den Bearer-Token zum Header hinzu, wenn vorhanden
    const token = localStorage.getItem('accessTokenKey');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Handle die Anfrage und fange Fehler ab
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let errorMessage;
        if (error.error instanceof ErrorEvent) {
          // Client-seitiger Fehler
          errorMessage = `Clientfehler: ${error.error.message}`;
        } else {
          // Server-seitiger Fehler
          errorMessage = `Serverfehler: ${error.status} - ${
            error.error.message || error.statusText
          }`;
        }
        this.openSnackBar(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

  openSnackBar(message: string) {
    this.snackBarService.error(message);
  }
}
