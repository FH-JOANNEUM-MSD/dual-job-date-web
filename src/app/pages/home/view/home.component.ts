import {Component} from '@angular/core';
import {SnackbarService} from "../../../services/snackbar.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private snackBarService: SnackbarService) {
  }

  generateAppointments() {
    // TODO Implement
    this.snackBarService.error('Not implemented yet...')
  }
}
