import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserType } from 'src/app/core/enum/userType';
import { UserInput } from 'src/app/core/model/userInput';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  dataSource = new MatTableDataSource<UserInput>();
  displayedColumns: string[] = ['email', 'userType'];

  users: UserInput[] | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadNeededData();
  }

  private loadNeededData() {
    this.userService.getUser(UserType.Company).subscribe((result) => {
      if (!result) {
        return;
      }
      this.dataSource.data = result;
    });
  }
}
