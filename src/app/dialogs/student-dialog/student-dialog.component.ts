import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {AcademicProgram} from "../../core/model/academicProgram";
import {UserService} from "../../core/services/user.service";
import {RegisterUserInput} from "../../core/model/registerUserInput";
import {User} from "../../core/model/user";
import {InstitutionService} from "../../core/services/institution.service";
import {AcademicProgramService} from "../../core/services/academic-program.service";
import {forkJoin, of} from "rxjs";
import {UserType} from "../../core/enum/userType";
import {switchMap} from "rxjs/operators";
import {CsvParserService} from "../../services/csv-parser.service";
import {DialogService} from "../../services/dialog.service";
import {getFormControlErrors} from "../../utils/form-utils";

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss'
})
export class StudentDialogComponent implements OnInit {

  isLoading = true;
  userId: string | null = this.data.id ?? null;
  multiple: boolean = this.data.multiple;
  fileName: string | null = null;

  form = this.fb.group({
    excel: this.fb.control<File | null>(
      null, {validators: this.multiple ? [Validators.required] : []}
    ),
    email: this.fb.control<string | null>({value: null, disabled: !!this.data.id},
      {validators: this.multiple ? [] : [Validators.required, Validators.email]}),
    academicProgram: this.fb.control<AcademicProgram | null>(
      {value: null, disabled: !!this.data.id},
      {validators: [Validators.required]}
    ),
  });
  academicPrograms: AcademicProgram[] = [];
  protected readonly getFormControlErrors = getFormControlErrors;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private institutionService: InstitutionService,
    private csvParser: CsvParserService,
    private academicProgramService: AcademicProgramService,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  ngOnInit(): void {
    this.loadNeededData();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.multiple) {
      const file = this.form.controls.excel.value!;
      const academicProgramId = this.form.controls.academicProgram.value!.id;
      const institutionId = this.form.controls.academicProgram.value!.institutionId;
      this.csvParser.parseExcel(file, UserType.Student).pipe(
        switchMap(result => {

          if (!result) {
            // TODO Show Parsing Error somewhere
            return of(null);
          }

          return this.userService.registerStudentsFromJson(result.map(row => {
            return {email: row.email!};
          }), institutionId, academicProgramId)
        })
      ).subscribe(
        result => {
          this.isLoading = false;
          if (!result) {
            return;
          }
          this.dialogRef.close(result);
        }
      );
    } else {
      const input = this.getInputFromForm();
      this.userService.register(input)
        .subscribe(
          result => {
            this.isLoading = false;
            if (!result) {
              return;
            }
            this.dialogRef.close(result);
          }
        );
    }
  }

  onFileSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }

    const file = inputElement.files[0];
    this.form.patchValue({excel: file});
    this.fileName = file.name;
  }

  delete(): void {
    const userId = this.userId;
    if (!userId) {
      return;
    }

    this.dialogService.openConfirmDialog({
      titleTranslationKey: "studentDialog.confirmDeleteTitle",
      messageTranslationKey: "studentDialog.confirmDeleteMessage"
    }).pipe(
      switchMap(result => {
        if (!result) {
          return of(null);
        }

        return this.userService.deleteUser(userId);
      })
    ).subscribe(
      result => {
        if (!result) {
          return;
        }
        this.dialogRef.close(result);
      }
    );
  }

  private loadNeededData() {

    forkJoin({
      user: this.userId ? this.userService.getUserById(this.userId) : of(null),
      academicPrograms: this.academicProgramService.getAcademicPrograms()
    }).subscribe(result => {
      if (result.user) {
        this.initForm(result.user);
      }
      if (result.academicPrograms) {
        this.academicPrograms = result.academicPrograms;
        if (this.academicPrograms.length > 0) {
          this.form.controls.academicProgram.patchValue(this.academicPrograms[0])
        }
      }
      this.isLoading = false;
    })

  }

  private getInputFromForm(): RegisterUserInput {

    return {
      email: this.form.controls.email.value!,
      institutionId: this.form.controls.academicProgram.value!.institutionId ?? null,
      academicProgramId: this.form.controls.academicProgram.value!.id ?? null,
      role: UserType.Student,
      companyId: null
    }

  }

  private initForm(user: User) {
    this.form.patchValue({
      email: user.email ?? '',
      academicProgram: user.academicProgram,
    })
  }
}

