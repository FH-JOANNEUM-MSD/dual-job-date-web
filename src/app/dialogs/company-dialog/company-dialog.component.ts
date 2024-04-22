import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AcademicProgram} from "../../core/model/academicProgram";
import {AcademicProgramService} from "../../core/services/academic-program.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {forkJoin, of} from "rxjs";
import {User} from "../../core/model/user";
import {CompanyService} from "../../core/services/company.service";
import {RegisterCompany} from "../../core/model/registerCompany";
import {UserService} from "../../core/services/user.service";

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrl: './company-dialog.component.scss'
})
export class CompanyDialogComponent implements OnInit {
  isLoading = true;
  form = this.fb.group({
    email: this.fb.nonNullable.control({value: '', disabled: !!this.data}, {
      validators: [Validators.required]
    }),
    name: this.fb.nonNullable.control<string>(
      {value: '', disabled: !!this.data},
      {validators: [Validators.required]}
    ),
    academicProgram: this.fb.nonNullable.control<AcademicProgram | null>(
      {value: null, disabled: !!this.data},
      {validators: [Validators.required]}
    ),
  });
  academicPrograms: AcademicProgram[] = [];
  userId: string | null = this.data;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private userService: UserService,
    private academicProgramService: AcademicProgramService,
    private dialogRef: MatDialogRef<CompanyDialogComponent>,
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


    this.companyService.register(input)
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
      academicPrograms: this.academicProgramService.getAcademicPrograms()
    }).subscribe(result => {
      if (result.user) {
        this.initForm(result.user);
      }
      if (result.academicPrograms) {
        this.academicPrograms = result.academicPrograms;
      }
      this.isLoading = false;
    })

  }

  private getInputFromForm(): RegisterCompany {
    return {
      companyName: this.form.controls.name.value,
      userEmail: this.form.controls.email.value,
      academicProgramId: this.form.controls.academicProgram.value!.id,
    }
  }

  private initForm(user: User) {
    this.form.patchValue({
      email: user.email ?? '',
      academicProgram: user.academicProgram,
      name: user.company.name ?? ''
    })
  }
}
