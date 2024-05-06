import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Company } from '../model/company';
import { CompanyDetails } from '../model/companyDetails';
import { RegisterCompany } from '../model/registerCompany';
import { Activity } from '../model/activity';
import { Address } from '../model/address';

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

  getCompanyById(id: number): Observable<Company | null> {
    return this.http
      .get<Company>(`${environment.apiBasePath}${this.urlPath}?id=${id}`)
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }

  getCompanyDetails(id: number): Observable<CompanyDetails | null> {
    return this.http
      .get<CompanyDetails>(
        `${environment.apiBasePath}${this.urlPath}/Details?id=${id}`
      )
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          console.log('test2');
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

  register(input: RegisterCompany): Observable<Company | null> {
    return this.http
      .post<Company>(
        `${environment.apiBasePath}${this.urlPath}/Register`,
        input
      )
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }

  createCompanyActivities(activities: Activity[]): Observable<any> {
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

  createCompanyLocation(addresses: Address[]): Observable<any> {
    return this.http
      .post<Location[]>(
        `${environment.apiBasePath}${this.urlPath}/Locations`,
        addresses
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
      .put<Company>(
        `${environment.apiBasePath}${this.urlPath}/UpdateCompany`,
        company
      )
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
