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
import {forkJoin, of} from 'rxjs';
import {DialogService} from '../../../services/dialog.service';
import {CompanyService} from '../../../core/services/company.service';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {switchMap} from "rxjs/operators";
import {SnackbarService} from 'src/app/services/snackbar.service';
import {TranslateService} from '@ngx-translate/core';

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
    academicProgram: this.fb.nonNullable.control<AcademicProgram | null>({value: null, disabled: true}, {
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
    private translateService: TranslateService,
    private snackbarService: SnackbarService,
  ) {
  }

  ngOnInit() {
    this.loadNeededData();

    this.form.controls.academicProgram.valueChanges.subscribe((_) => this.reloadCompanies());

    this.form.controls.institution.valueChanges.pipe(
      switchMap(result => {
        if (!result) {
          this.academicPrograms = [];
          this.form.controls.academicProgram.disable();
          this.form.controls.academicProgram.patchValue(null);
          return of(null);
        }

        return this.academicProgramService.getAcademicPrograms(result.id);
      })
    ).subscribe(result => {

      if (!result) {
        return;
      }
      this.academicPrograms = result;
      this.form.controls.academicProgram.enable();
      this.reloadCompanies();
    });
  }

  openCompanyDialog(id?: string, multiple: boolean = false): void {
    this.dialogService.openCompanyDialog({id: id, multiple: multiple}).subscribe(result => {
      if (!result) {
        return;
      }
      this.reloadCompanies();
    });
  }
  openConfirmationDialog(user: User, event: MouseEvent ,isActive: boolean): void {
    var data = {
      titleTranslationKey: "companyDialog.confirmChangeTitle",
      messageTranslationKey: "companyDialog.confirmAdminActiveMessage"
    };
    if(isActive) {
      data.messageTranslationKey = "companyDialog.confirmAdminInactiveMessage";
    }
    this.dialogService.openConfirmDialog(data).pipe().subscribe(result => {
      if (!result) {
        return;
      }
      this.updateStatus(user,event);
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
    if (user.company.isActive) {
      this.snackbarService.success(this.translateService.instant(
        'companyProfilePage.snackBar.success.setInactive'
      ))
    } else {
      this.snackbarService.success(this.translateService.instant(
        'companyProfilePage.snackBar.success.setActive'
      ))
    }

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadNeededData() {
    forkJoin({
      users: this.userService.getUser(UserType.Company, null, null),
      institutions: this.institutionService.getInstitutions(),
    }).subscribe((result) => {
      if (result.users) {
        this.dataSource.data = result.users;
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

    const institutionId = this.form.controls.institution.value?.id ?? null;
    const academicProgramId = this.form.controls.academicProgram.value?.id ?? null;
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

    const previousPageSize = this.dataSource.paginator ? this.dataSource.paginator.pageSize : 10;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name':
          return item.company.name;
        case 'industry':
          return item.company.industry;
        case 'companyWebsite':
          return item.company.website;
        case 'status':
          return item.company.isActive ? 1 : 0;
        case 'academicProgram':
          return item.academicProgram.name;
        default:
          // @ts-ignore
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageSize = previousPageSize;
    }

    this.dataSource.filterPredicate = function (user, filter: string): boolean {
      return user.company.name.toLowerCase().includes(filter) || user.email!.toLowerCase().includes(filter) ||
        user.academicProgram.name.toLowerCase().includes(filter) || (user.company.industry?.toLowerCase().includes(filter) ?? false) ||
        (user.company.website?.toLowerCase().includes(filter) ?? false);
    };
  }
}
