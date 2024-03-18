import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from "../../../Services/auth.service";
import {Router} from '@angular/router';
import {SnackbarService} from "../../../services/snackbar.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // Todo remove after login is implemented
  invalidData = false;

  loginForm = this.fb.group({
    email: this.fb.nonNullable.control<string>('', {
      validators: [Validators.required, Validators.email]
    }),
    password: this.fb.nonNullable.control<string>('', {
      validators: [Validators.required]
    }),
  });

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private snackbarService: SnackbarService) {
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    this.authService.login(email, password)

    /*TODO if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }*/

    this.invalidData = true;
  }
}
