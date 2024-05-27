import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { UserType } from 'src/app/core/enum/userType';
import { Component } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { CompanyService } from 'src/app/core/services/company.service';

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

  formError: string | null = null;

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
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

          if (this.authService.getUserType() === UserType.Company) {
            return this.authService.setCompanyId().pipe(
              tap(() => {
                const companyId = this.authService.getCompanyId();
                this.router.navigate([`/company-profile/${companyId}`]);
              })
            );
          } else if (this.authService.getUserType() == UserType.Admin) {
            this.router.navigate(['/home']);
          } else {
            this.formError = 'Nicht gültiger Benutzertyp';
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
      });
  }
}
