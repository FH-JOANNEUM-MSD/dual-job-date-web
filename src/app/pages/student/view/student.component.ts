import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../core/services/user.service';
import {UserType} from '../../../core/enum/userType';
import {MatTableDataSource} from '@angular/material/table';
import {User} from '../../../core/model/user';
import {DialogService} from '../../../services/dialog.service';
import {InstitutionService} from '../../../core/services/institution.service';
import {forkJoin, of} from 'rxjs';
import {AcademicProgramService} from '../../../core/services/academic-program.service';
import {Institution} from '../../../core/model/institution';
import {AcademicProgram} from '../../../core/model/academicProgram';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent implements OnInit {
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

  isLoading = true;
  userLoading = false;

  displayedColumns: string[] = ['email', 'institution', 'academicProgram', 'actions'];
  dataSource = new MatTableDataSource<User>();
  institutions: Institution[] = [];
  academicPrograms: AcademicProgram[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private institutionService: InstitutionService,
    private academicProgramService: AcademicProgramService,
    private dialogService: DialogService,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.loadNeededData();

    this.form.controls.academicProgram.valueChanges.subscribe((_) => this.reloadUser());

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
      this.reloadUser();
    });
  }

  openStudentDialog(id?: string, multiple: boolean = false): void {
    this.dialogService.openStudentDialog({id: id, multiple: multiple}).subscribe((result) => {
      if (!result) {
        return;
      }
      this.reloadUser();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadNeededData() {
    forkJoin({
      users: this.userService.getUser(UserType.Student, null, null),
      institutions: this.institutionService.getInstitutions(),
    }).subscribe((result) => {
      if (result.users) {
        this.dataSource.data = result.users;
      }
      if (result.institutions) {
        this.institutions = result.institutions;
      }
      this.isLoading = false;
      this.configureDataSource();
    });
  }

  private reloadUser() {
    this.userLoading = true;

    const institutionId = this.form.controls.institution.value?.id ?? null;
    const academicProgramId = this.form.controls.academicProgram.value?.id ?? null;
    this.userService
      .getUser(UserType.Student, institutionId, academicProgramId)
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

    const previousPageSize = this.paginator.pageSize || 10;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'institution':
          return item.institution.name;
        case 'academicProgram':
          return item.academicProgram.name;
        default:
          // @ts-ignore
          return item[property];
      }
    };

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = previousPageSize;

    this.dataSource.filterPredicate = (user, filter: string): boolean => {
      return user.email?.toLowerCase().includes(filter) ||
        user.academicProgram.name.toLowerCase().includes(filter) ||
        user.institution.name.toLowerCase().includes(filter);
    };
  }
}
