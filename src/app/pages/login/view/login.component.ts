import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../services/auth.service';

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
    private fb: FormBuilder
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    this.userService.login(email, password).subscribe((result) => {
      if (!result) {
        return;
      }

      this.authService.setCredentials(result);

      console.log(result);
      this.router.navigate(['/home']);
    });

    /*TODO if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }*/
  }
}
