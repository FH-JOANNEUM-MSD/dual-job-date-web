import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../core/services/user.service";
import {UserType} from "../../../core/enum/userType";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../core/model/user";
import {DialogService} from "../../../services/dialog.service";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent implements OnInit {

  isLoading = true;

  displayedColumns: string[] = ['email', 'userType'];
  dataSource = new MatTableDataSource<User>();

  constructor(private userService: UserService, private dialogService: DialogService) {
  }

  ngOnInit() {
    this.loadNeededData();
  }

  openStudentDialog(id?: string): void {
    this.dialogService.openStudentDialog(id).subscribe();
  }

  private loadNeededData() {
    this.userService.getUser(UserType.Student).subscribe(result => {
      this.isLoading = false;
      if (!result) {
        return;
      }
      this.dataSource.data = result;
    })
  }
}
