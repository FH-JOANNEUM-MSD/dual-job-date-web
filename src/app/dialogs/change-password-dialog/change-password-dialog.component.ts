import {Component, Inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../core/services/user.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {DialogService} from "../../services/dialog.service";
import {getFormControlErrors} from "../../utils/form-utils";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {

  isNewDialog: boolean = this.data;
  isLoading = false;

  form = this.fb.group({
    currentPassword: this.fb.control<string | null>(
      null, {validators: [Validators.required]}
    ),
    // TODO Add Backend Password Validator to new Password Form Control
    newPassword: this.fb.control<string | null>(
      null, {validators: [Validators.required]}
    ),
    confirmPassword: this.fb.control<string | null>(
      null, {validators: [Validators.required]}
    ),
  }, {validators: this.passwordMatchValidator()});
  protected readonly getFormControlErrors = getFormControlErrors;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private dialogService: DialogService,
    private userService: UserService, @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const newPassword = formGroup.get('newPassword')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      if (newPassword !== confirmPassword) {
        return {'mismatch': true};
      }
      return null;
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const oldPassword = this.form.controls.currentPassword.value!;
    const newPassword = this.form.controls.newPassword.value!;

    if (this.isNewDialog) {
      this.userService.changePassword(oldPassword, newPassword).subscribe(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }
        this.dialogRef.close();
      })
    } else {
      this.dialogService.openConfirmDialog({
        titleTranslationKey: "changePasswordDialog.confirmChangeTitle",
        messageTranslationKey: "changePasswordDialog.confirmChangeMessage"
      }).pipe(
        switchMap(result => {
          if (!result) {
            return of(null);
          }

          return this.userService.changePassword(oldPassword, newPassword);
        })
      ).subscribe(
        result => {
          if (!result) {
            this.isLoading = false;
            return;
          }
          this.dialogRef.close(result);
        }
      );
    }


  }
}
