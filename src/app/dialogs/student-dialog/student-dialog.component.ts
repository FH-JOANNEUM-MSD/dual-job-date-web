import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {Institution} from "../../core/model/institution";
import {AcademicProgram} from "../../core/model/academicProgram";
import {UserService} from "../../core/services/user.service";
import {RegisterUserInput} from "../../core/model/registerUserInput";
import {User} from "../../core/model/user";

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss'
})
export class StudentDialogComponent implements OnInit {

  isLoading = true;
  form = this.fb.group({
    email: this.fb.nonNullable.control('', {
      validators: [Validators.required]
    }),
    institutionId: this.fb.nonNullable.control<string | null>(
      null,
      {validators: [Validators.required]}
    ),
    academicProgramId: this.fb.nonNullable.control<string | null>(
      null,
      {validators: [Validators.required]}
    ),
  });
  institutions: Institution[] = [];
  academicPrograms: AcademicProgram[] = [];
  userId: string | null = this.data;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
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

    /*
    this.userService.createStudent(email, role)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        result => {
          if (!result) {
            return;
          }
          this.dialogRef.close(result);
        }
      );*/
  }

  private loadNeededData() {

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(result => {
        if (!result) {
          return;
        }
        this.initForm(result);
      })
    }

  }

  private getInputFromForm(): RegisterUserInput {

    throw new DOMException();

  }

  private initForm(user: User) {
    this.form.patchValue({
      email: user.email ?? '',
    })
  }
}

