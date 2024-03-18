import {Component} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {AuthService} from "../../../Services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService,private router: Router) {
  }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    if(typeof username === 'string' && typeof password === 'string'){
      this.authService.login(username,password)
    }


    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }
}
