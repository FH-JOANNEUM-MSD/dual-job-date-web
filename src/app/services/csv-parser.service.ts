import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CsvParserService {
  parseExcel(file: File): Observable<DataRow[] | null> {
    return this.readFileAsBinaryString(file).pipe(
      map(e => XLSX.read(e, {type: 'binary'})),
      map(workbook => this.extractDataFromWorkbook(workbook)),
      map(rows => {
        if (this.validateHeaders(rows)) {
          return this.formatDataWithHeaders(rows);
        } else {
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

  private validateHeaders(rows: any[]): boolean {
    //TODO Better validation!
    if (rows.length === 0) return false;
    const headers = rows[0];
    return headers.includes('email'); // Only checking for 'email' as required
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
