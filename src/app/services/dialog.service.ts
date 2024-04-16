import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {ComponentType} from "@angular/cdk/overlay";
import {StudentDialogComponent} from "../dialogs/student-dialog/student-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {
  }

  openStudentDialog(id?: string): Observable<any> {
    const dialogRef = this.openGenericDialog(id, StudentDialogComponent)

    return dialogRef.afterClosed();
  }

  private openGenericDialog<T, K>(data: K, component: ComponentType<T>): MatDialogRef<T, any> {
    return this.dialog.open(component,
      {
        data: data,
        panelClass: 'dialog-container'
      });
  }

}

