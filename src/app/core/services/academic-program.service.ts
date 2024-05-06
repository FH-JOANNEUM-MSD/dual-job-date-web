import {Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AcademicProgram} from "../model/academicProgram";

@Injectable({
  providedIn: 'root',
})
export class AcademicProgramService {
  private urlPath: string = '/Util';

  constructor(private http: HttpClient) {
  }

  // ****** GET ****** \\

  getAcademicPrograms(id?: number): Observable<AcademicProgram[] | null> {

    let params = new HttpParams()
    if (id !== undefined) {
      params = params.set('institutionId', id.toString());
    }

    return this.http
      .get<AcademicProgram[]>(
        `${environment.apiBasePath}${
          this.urlPath
        }/AcademicPrograms`, {params}
      )
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }
}
