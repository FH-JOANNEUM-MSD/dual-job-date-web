import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {Institution} from "../../core/model/institution";
import {AcademicProgram} from "../../core/model/academicProgram";
import {UserService} from "../../core/services/user.service";
import {RegisterUserInput} from "../../core/model/registerUserInput";
import {User} from "../../core/model/user";
import {InstitutionService} from "../../core/services/institution.service";
import {AcademicProgramService} from "../../core/services/academic-program.service";
import {forkJoin, of} from "rxjs";
import {UserType} from "../../core/enum/userType";

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss'
})
export class StudentDialogComponent implements OnInit {

  isLoading = true;
  form = this.fb.group({
    email: this.fb.nonNullable.control({value: '', disabled: !!this.data}, {
      validators: [Validators.required]
    }),
    institution: this.fb.nonNullable.control<Institution | null>(
      {value: null, disabled: !!this.data},
      {validators: [Validators.required]}
    ),
    academicProgram: this.fb.nonNullable.control<AcademicProgram | null>(
      {value: null, disabled: !!this.data},
      {validators: [Validators.required]}
    ),
  });
  institutions: Institution[] = [];
  academicPrograms: AcademicProgram[] = [];
  userId: string | null = this.data;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private institutionService: InstitutionService,
    private academicProgramService: AcademicProgramService,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
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

    const input = this.getInputFromForm();


    this.userService.register(input)
      .subscribe(
        result => {
          if (!result) {
            return;
          }
          this.dialogRef.close(result);
        }
      );
  }

  delete(): void {
    if (!this.userId) {
      return;
    }

    this.userService.deleteUser(this.userId)
      .subscribe(
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
      institutions: this.institutionService.getInstitutions(),
      academicPrograms: this.academicProgramService.getAcademicPrograms()
    }).subscribe(result => {
      if (result.user) {
        this.initForm(result.user);
      }
      if (result.academicPrograms) {
        this.academicPrograms = result.academicPrograms;
      }
      if (result.institutions) {
        this.institutions = result.institutions;
      }
      this.isLoading = false;
    })

  }

  private getInputFromForm(): RegisterUserInput {

    return {
      email: this.form.controls.email.value,
      institutionId: this.form.controls.institution.value?.id ?? null,
      academicProgramId: this.form.controls.academicProgram.value?.id ?? null,
      role: UserType.Student,
      companyId: null
    }

  }

  private initForm(user: User) {
    this.form.patchValue({
      email: user.email ?? '',
      academicProgram: user.academicProgram,
      institution: user.institution
    })
  }
}

