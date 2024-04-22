import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class CsvParserService {
  parseExcel(file: File): Promise<DataRow[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const rows: any[] = this.extractDataFromWorkbook(workbook);
          if (this.validateHeaders(rows)) {
            const formattedData: DataRow[] = this.formatDataWithHeaders(rows);
            resolve(formattedData);
          } else {
            reject('Missing required headers');
          }
        } catch (err) {
          reject('Failed to parse the Excel file');
        }
      };
      reader.onerror = () => reject('Error reading file');
      reader.readAsBinaryString(file);
    });
  }

  private extractDataFromWorkbook(workbook: XLSX.WorkBook): any[] {
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  }

  private validateHeaders(rows: any[]): boolean {
    if (rows.length === 0) return false;
    const headers = rows[0];
    return headers.includes('email'); // Only checking for 'email' as required
  }

  private formatDataWithHeaders(rows: any[]): DataRow[] {
    const headers = rows[0];
    const dataWithHeaders = rows.slice(1).map((row) => {
      let obj: DataRow = {};
      row.forEach((cell: any, index: number) => {
        const key = headers[index] as keyof DataRow;
        obj[key] = cell;
      });
      return obj;
    });
    return dataWithHeaders;
  }
}

interface DataRow {
  email?: string;
  company?: string;
}
