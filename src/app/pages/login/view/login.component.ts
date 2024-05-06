import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { UserType } from 'src/app/core/enum/userType';
import { Component } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: this.fb.nonNullable.control<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.nonNullable.control<string>('', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {}

  save() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    this.userService
      .login(email, password)
      .pipe(
        switchMap((result) => {
          if (!result) {
            return of(null);
          }
          this.authService.setCredentials(result);

          this.authService.setCredentials(result);

          if (this.authService.getUserType() == UserType.Company) {
            this.router.navigate(['/company-profile/:id']);
          } else {
            this.router.navigate(['/home']);
          }

          if (result.isNew) {
            return this.dialogService.openChangePasswordDialog(true);
          }

          return of(true);
        })
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.router.navigate(['/home']);
      });
  }
}
