import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {UserType} from 'src/app/core/enum/userType';
import {UserService} from 'src/app/core/services/user.service';
import {User} from '../../../core/model/user';
import {Institution} from '../../../core/model/institution';
import {FormBuilder, Validators} from '@angular/forms';
import {AcademicProgram} from '../../../core/model/academicProgram';
import {InstitutionService} from '../../../core/services/institution.service';
import {AcademicProgramService} from '../../../core/services/academic-program.service';
import {forkJoin} from 'rxjs';
import {DialogService} from '../../../services/dialog.service';
import {CompanyService} from '../../../core/services/company.service';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  form = this.fb.group({
    institution: this.fb.nonNullable.control<Institution | null>(null, {
      validators: [Validators.required],
    }),
    academicProgram: this.fb.nonNullable.control<AcademicProgram | null>(null, {
      validators: [Validators.required],
    }),
  });

  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'name',
    'email',
    'academicProgram',
    'industry',
    'companyWebsite',
    'status',
    'actions',
  ];
  institutions: Institution[] = [];
  academicPrograms: AcademicProgram[] = [];

  isLoadingResults = true;
  userLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private companyService: CompanyService,
    private institutionService: InstitutionService,
    private academicProgramService: AcademicProgramService,
    private dialogService: DialogService,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.loadNeededData();
    this.form.valueChanges.subscribe((_) => this.reloadCompanies());
  }

  openCompanyDialog(id?: string, multiple: boolean = false): void {
    this.dialogService.openCompanyDialog({id: id, multiple: multiple}).subscribe(result => {
      if (!result) {
        return;
      }
      this.reloadCompanies();
    });
  }

  updateStatus(user: User, event: MouseEvent): void {
    event.stopPropagation();

    this.companyService
      .activateOrDeactivateCompany(user.company.id, !user.company.isActive)
      .subscribe({
        next: (_) => {
          user.company.isActive = !user.company.isActive;
        },
      });
  }

  sendMail(user: User, event: MouseEvent) {
    event.stopPropagation();

    this.userService.generateUserCredentials(user.id).subscribe(
      result => {
        if (!result) {
          return;
        }
        this.userService.sendCredentials(user, result.password)
      });
  }

  private loadNeededData() {
    forkJoin({
      users: this.userService.getUser(UserType.Company, 2, 2),
      institutions: this.institutionService.getInstitutions(),
      academicPrograms: this.academicProgramService.getAcademicPrograms(),
    }).subscribe((result) => {
      if (result.users) {
        this.dataSource.data = result.users;
      }
      if (result.academicPrograms) {
        this.academicPrograms = result.academicPrograms;
      }
      if (result.institutions) {
        this.institutions = result.institutions;
      }
      this.isLoadingResults = false;
      this.configureDataSource();
    });
  }

  private reloadCompanies() {
    this.userLoading = true;

    const institutionId = this.form.controls.institution.value?.id ?? 1;
    const academicProgramId = this.form.controls.academicProgram.value?.id ?? 1;
    this.userService
      .getUser(UserType.Company, institutionId, academicProgramId)
      .subscribe((result) => {
        this.userLoading = false;

        if (!result) {
          return;
        }
        this.dataSource.data = result;
        this.configureDataSource();
      });
  }

  private configureDataSource(): void {
    this.changeDetector.detectChanges();
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'industry':
          return item.company.industry;
        case 'companyWebsite':
          return item.company.website;
        case 'status':
          return item.company.isActive ? 1 : 0;
        default:
          // @ts-ignore
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
