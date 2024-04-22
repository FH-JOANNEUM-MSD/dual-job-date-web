import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {UserType} from 'src/app/core/enum/userType';
import {UserService} from 'src/app/core/services/user.service';
import {User} from "../../../core/model/user";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'name',
    'email',
    'status',
    'industry',
    'companyWebsite',
  ];
  users: User[] = [];
  isLoadingResults: boolean = true;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.loadNeededData();
  }

  private loadNeededData() {
    this.userService.getUser(UserType.Company).subscribe({
      next: (result) => {
        if (result) {
          this.dataSource.data = result;
          console.log(result);
        }
        this.isLoadingResults = false;
      },
    });
  }
}
