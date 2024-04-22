import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserType } from '../../../core/enum/userType';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../core/model/user';
import { DialogService } from '../../../services/dialog.service';
import { InstitutionService } from '../../../core/services/institution.service';
import { forkJoin } from 'rxjs';
import { AcademicProgramService } from '../../../core/services/academic-program.service';
import { Institution } from '../../../core/model/institution';
import { AcademicProgram } from '../../../core/model/academicProgram';
import { FormBuilder, Validators } from '@angular/forms';
import { CsvParserService } from 'src/app/services/csv-parser.service';

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

  displayedColumns: string[] = ['email', 'userType', 'actions'];
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
  ) {}

  ngOnInit() {
    this.loadNeededData();

    this.form.valueChanges.subscribe((_) => this.reloadUser());
  }

  openStudentDialog(id?: string): void {
    this.dialogService.openStudentDialog(id).subscribe((result) => {
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

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.csvParser
        .parseExcel(file)
        .then((jsonData) => {
          console.log('Parsed JSON Data:', jsonData);
        })
        .catch((error) => {
          console.error('Error parsing file:', error);
        });
    }
  }

  fileInputClick() {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.click();
  }
}
