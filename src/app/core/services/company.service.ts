import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Company } from '../model/company';
import { Activity } from '../model/activity';
import { ActivityInput } from '../model/activityInput';
import { CompanyDetails } from '../model/companyDetails';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private urlPath: string = '/Company';

  constructor(private http: HttpClient) {}

  // ****** GET ****** \\

  getCompanies(): Observable<Company[] | null> {
    // TODO institutionId and academicProgramId ???
    return this.http
      .get<Company[]>(
        `${environment.apiBasePath}${
          this.urlPath
        }/Companies?institutionId=${2}&academicProgramId=${2}`
      )
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }

  getCompanyById(id: string): Observable<Company | null> {
    return this.http
      .get<Company>(
        `${environment.apiBasePath}${this.urlPath}/GetCompany?id=${id}`
      )
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }

  getCompanyDetails(id: string): Observable<CompanyDetails | null> {
    return this.http
      .get<CompanyDetails>(
        `${environment.apiBasePath}${this.urlPath}/Details?id=${id}`
      )
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }

  // TODO: NEEDED ?
  getCompanyActivities(id: string): Observable<Activity[] | null> {
    return this.http
      .get<Activity[]>(
        `${environment.apiBasePath}${this.urlPath}/Activities?id=${id}`
      )
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }

  // ****** POST ****** \\

  createCompany(
    email: string,
    companyName: string,
    academicProgramId: string
  ): Observable<Company | null> {
    return this.http
      .post<Company>(`${environment.apiBasePath}${this.urlPath}/Register`, {
        companyName: companyName,
        email: email,
        academicProgramId: academicProgramId,
      })
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }
  // TODO: NEEDED ?

  createCompanyActivities(activities: ActivityInput[]): Observable<any> {
    // TODO implement GlobalStorage / LocalStorage something
    return this.http
      .post<any>(
        `${environment.apiBasePath}${this.urlPath}/Activities`,
        activities
      )
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }

  // ****** PUT ****** \\

  updateCompany(company: Company): Observable<Company | null> {
    return this.http
      .put<Company>(`${environment.apiBasePath}${this.urlPath}`, company)
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }

  activateOrDeactivateCompany(
    id: number,
    isActive: boolean
  ): Observable<Company> {
    const params = new HttpParams()
      .set('id', id)
      .set('isActive', isActive.toString());

    return this.http
      .put<any>(`${environment.apiBasePath}${this.urlPath}/IsActive`, null, {
        params: params,
      })
      .pipe(
        catchError((error) => {
          console.error('Failed to update company status', error);
          return throwError(() => new Error('Failed to update company status'));
        })
      );
  }

  updateCompanyDetails(companyDetails: CompanyDetails): Observable<any> {
    return this.http
      .put<any>(
        `${environment.apiBasePath}${this.urlPath}/Details`,
        companyDetails
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
