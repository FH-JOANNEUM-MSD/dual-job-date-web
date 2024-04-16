import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  success(message: string, action: string = 'OK', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  error(message: string, action: string = 'OK', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}

