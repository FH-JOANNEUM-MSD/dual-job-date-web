import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import {catchError, map, Observable, of} from "rxjs";
import {SnackbarService} from "./snackbar.service";
import {TranslateService} from "@ngx-translate/core";
import {UserType} from "../core/enum/userType";

@Injectable({
  providedIn: 'root',
})
export class CsvParserService {

  constructor(private snackBarService: SnackbarService, private translateService: TranslateService,
  ) {}
  parseExcel(file: File, userType: UserType): Observable<DataRow[] | null> {
    return this.readFileAsBinaryString(file).pipe(
      map(e => XLSX.read(e, {type: 'binary'})),
      map(workbook => this.extractDataFromWorkbook(workbook)),
      map(rows => {
        if (this.validateEmail(rows)) {
          if(this.validateHeaders(rows, userType)){
            return this.formatDataWithHeaders(rows);
          }
          else {
            if(userType === UserType.Company){
              this.snackBarService.error(
                this.translateService.instant(
                  'csvParserService.wrongHeaderCompany'
                )
              );
            }else{
              this.snackBarService.error(
                this.translateService.instant(
                  'csvParserService.wrongHeaderStudent'
                )
              );
            }

            return null;
          }
        } else {
          this.snackBarService.error(
            this.translateService.instant(
              'csvParserService.error'
            )
          );
          return null;
        }
      }),
      catchError(_ => {
        return of(null);
      })
    );
  }

  private readFileAsBinaryString(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        observer.next(e.target.result);
        observer.complete();
      };
      reader.onerror = (e) => {
        observer.error('Error reading file');
      };

      reader.readAsBinaryString(file);

      return () => reader.abort();
    });
  }

  private extractDataFromWorkbook(workbook: XLSX.WorkBook): any[] {
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, {header: 1});
  }

  private validateEmail(rows: any[]): boolean {
    if (rows.length === 0) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (let i = 1; i < rows.length; i++) {
      if (emailRegex.test(rows[i][0])) {
        return true;
      }
    }
    return false;
  }

  private validateHeaders(rows: any[], userType: UserType): boolean{
    const headers = rows[0];
    const requiredHeadersForCompany = ['email', 'companyName'];
    const requiredHeadersForStudent = ['email'];

    if(userType === UserType.Student){
        return requiredHeadersForStudent.every(header => headers.includes(header));
    }
    else if(userType === UserType.Company){
      return requiredHeadersForCompany.every(header => headers.includes(header));
    }
    return false;
  }

  private formatDataWithHeaders(rows: any[]): DataRow[] {
    const headers = rows[0];
    return rows.slice(1).map((row) => {
      let obj: DataRow = {};
      row.forEach((cell: any, index: number) => {
        const key = headers[index] as keyof DataRow;
        obj[key] = cell;
      });
      return obj;
    });
  }
}

interface DataRow {
  email?: string;
  companyName?: string;
}
