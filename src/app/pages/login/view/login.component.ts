import {Component} from '@angular/core';
import {LoginService} from "../core/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  constructor(private loginService: LoginService) {
  }
}