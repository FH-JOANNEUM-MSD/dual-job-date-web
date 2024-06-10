import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {map, Observable} from "rxjs";
import {ComponentType} from "@angular/cdk/overlay";
import {StudentDialogComponent} from "../dialogs/student-dialog/student-dialog.component";
import {CompanyDialogComponent} from "../dialogs/company-dialog/company-dialog.component";
import {ChangePasswordDialogComponent} from "../dialogs/change-password-dialog/change-password-dialog.component";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog/confirm-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {
  }

  openConfirmDialog(data: { titleTranslationKey: string; messageTranslationKey: string }): Observable<boolean> {
    const dialogRef = this.openDialog(data, ConfirmDialogComponent)

    return dialogRef.afterClosed();
  }

  openStudentDialog(data: { id?: string, multiple: boolean }): Observable<boolean> {
    const dialogRef = this.openSideDialog(data, StudentDialogComponent)

    return dialogRef.afterClosed();
  }

  openChangePasswordDialog(isNew: boolean = false): Observable<boolean> {
    const dialogRef = this.openDialog(isNew, ChangePasswordDialogComponent)

    return dialogRef.afterClosed().pipe(
      map(_ => true)
    );
  }


  openCompanyDialog(data: { id?: string, multiple: boolean }): Observable<boolean> {
    const dialogRef = this.openSideDialog(data, CompanyDialogComponent)

    return dialogRef.afterClosed();
  }

  private openSideDialog<T, K>(data: K, component: ComponentType<T>): MatDialogRef<T> {
    return this.dialog.open(component,
      {
        data: data,
        panelClass: 'side-dialog-container'
      });
  }

  private openDialog<T, K>(data: K, component: ComponentType<T>): MatDialogRef<T> {
    return this.dialog.open(component,
      {
        data: data,
        panelClass: 'dialog-container'
      });
  }

}

