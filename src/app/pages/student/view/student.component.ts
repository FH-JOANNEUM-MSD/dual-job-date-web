import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/user.service';
import {UserType} from '../../../core/enum/userType';
import {MatTableDataSource} from '@angular/material/table';
import {User} from '../../../core/model/user';
import {DialogService} from '../../../services/dialog.service';
import {InstitutionService} from '../../../core/services/institution.service';
import {forkJoin} from 'rxjs';
import {AcademicProgramService} from '../../../core/services/academic-program.service';
import {Institution} from '../../../core/model/institution';
import {AcademicProgram} from '../../../core/model/academicProgram';
import {FormBuilder, Validators} from '@angular/forms';
import {CsvParserService} from 'src/app/services/csv-parser.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent implements OnInit {
  form = this.fb.group({
    institution: this.fb.nonNullable.control<Institution | null>(null, {
      validators: [Validators.required],
    }),
    academicProgram: this.fb.nonNullable.control<AcademicProgram | null>(null, {
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
    private csvParser: CsvParserService
  ) {
  }

  ngOnInit() {
    this.loadNeededData();

    this.form.valueChanges.subscribe((_) => this.reloadUser());
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

  onFileSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }

    const file = inputElement.files[0];
    this.isLoading = true;

    this.csvParser.parseExcel(file).subscribe(
      {
        next: (result) => {
          console.log('Parsed JSON Data:', result);
          inputElement.value = '';
          this.isLoading = false;
        },
        error: (error) => {
          inputElement.value = '';
          this.isLoading = false;
          // TODO show error somehow
          console.error('Error parsing file:', error);
        }
      }
    )
  }

  private loadNeededData() {
    forkJoin({
      users: this.userService.getUser(UserType.Student, 2, 2),
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
      this.isLoading = false;
    });
  }

  private reloadUser() {
    this.userLoading = true;

    const institutionId = this.form.controls.institution.value?.id ?? 1;
    const academicProgramId = this.form.controls.academicProgram.value?.id ?? 1;
    this.userService
      .getUser(UserType.Student, institutionId, academicProgramId)
      .subscribe((result) => {
        this.userLoading = false;

        if (!result) {
          return;
        }
        this.dataSource.data = result;
      });
  }
}
