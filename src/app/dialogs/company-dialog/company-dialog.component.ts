import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AcademicProgram} from '../../core/model/academicProgram';
import {AcademicProgramService} from '../../core/services/academic-program.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {forkJoin, of} from 'rxjs';
import {User} from '../../core/model/user';
import {CompanyService} from '../../core/services/company.service';
import {RegisterCompany} from '../../core/model/registerCompany';
import {UserService} from '../../core/services/user.service';
import {CsvParserService} from '../../services/csv-parser.service';
import {switchMap} from 'rxjs/operators';
import {DialogService} from '../../services/dialog.service';
import {Router} from '@angular/router';
import {UserType} from "../../core/enum/userType";
import {getFormControlErrors} from "../../utils/form-utils";

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrl: './company-dialog.component.scss',
})
export class CompanyDialogComponent implements OnInit {
  isLoading = true;
  userId: string | null = this.data.id ?? null;
  multiple: boolean = this.data.multiple;
  fileName: string | null = null;
  user: User | null = null;

  form = this.fb.group({
    excel: this.fb.control<File | null>(null, {
      validators: this.multiple ? [Validators.required] : [],
    }),
    email: this.fb.control<string | null>(
      {
        value: null,
        disabled: !!this.data.id,
      },
      {validators: this.multiple ? [] : [Validators.required, Validators.email]}
    ),
    name: this.fb.control<string | null>(
      {value: null, disabled: !!this.data.id},
      {validators: this.multiple ? [] : [Validators.required]}
    ),
    academicProgram: this.fb.control<AcademicProgram | null>(
      {value: null, disabled: !!this.data.id},
      {validators: [Validators.required]}
    ),
  });
  academicPrograms: AcademicProgram[] = [];
  protected readonly getFormControlErrors = getFormControlErrors;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private userService: UserService,
    private csvParser: CsvParserService,
    private academicProgramService: AcademicProgramService,
    private dialogRef: MatDialogRef<CompanyDialogComponent>,
    private dialogService: DialogService,
    private router: Router,
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

      this.csvParser
        .parseExcel(file, UserType.Company)
        .pipe(
          switchMap((result) => {
            if (!result) {
              return of(null);
            }

            return this.userService.registerCompaniesFromJson(
              result.map((row) => {
                return {email: row.email!, companyName: row.companyName!};
              }),
              2,
              academicProgramId
            );
          })
        )
        .subscribe((result) => {
          this.isLoading = false;
          if (!result) {
            return;
          }
          this.dialogRef.close(result);
        });
    } else {
      const input = this.getInputFromForm();

      this.companyService.register(input).subscribe((result) => {
        this.isLoading = false;
        if (!result) {
          return;
        }
        this.dialogRef.close(result);
      });
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

    this.dialogService
      .openConfirmDialog({
        titleTranslationKey: 'companyDialog.confirmDeleteTitle',
        messageTranslationKey: 'companyDialog.confirmDeleteMessage',
      })
      .pipe(
        switchMap((result) => {
          if (!result) {
            return of(null);
          }
          return this.userService.deleteUser(userId);
        })
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.dialogRef.close(result);
      });
  }

  redirectToCompany(destination: string) {
    if (this.user && this.user.company && this.user.company.id) {
      this.router.navigate([`/${destination}/${this.user.company.id}`]);
      this.dialogRef.close();
    }
  }

  private loadNeededData() {
    forkJoin({
      user: this.userId ? this.userService.getUserById(this.userId) : of(null),
      academicPrograms: this.academicProgramService.getAcademicPrograms(),
    }).subscribe((result) => {
      if (result.user) {
        this.initForm(result.user);
        this.user = result.user;
      }
      if (result.academicPrograms) {
        this.academicPrograms = result.academicPrograms;
        if (this.academicPrograms.length > 0) {
          this.form.controls.academicProgram.patchValue(this.academicPrograms[0])
        }
      }
      this.isLoading = false;
    });
  }

  private getInputFromForm(): RegisterCompany {
    return {
      companyName: this.form.controls.name.value!,
      userEmail: this.form.controls.email.value!,
      academicProgramId: this.form.controls.academicProgram.value!.id,
    };
  }

  private initForm(user: User) {
    this.form.patchValue({
      email: user.email ?? '',
      academicProgram: user.academicProgram,
      name: user.company.name ?? '',
    });
  }
}
