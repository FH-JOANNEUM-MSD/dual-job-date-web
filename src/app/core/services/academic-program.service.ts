import {Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
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

  getAcademicPrograms(): Observable<AcademicProgram[] | null> {
    // TODO institutionId and academicProgramId ???
    return this.http
      .get<AcademicProgram[]>(
        `${environment.apiBasePath}${
          this.urlPath
        }/AcademicPrograms`
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
