import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Company} from '../model/company';
import {CompanyDetails} from '../model/companyDetails';
import {RegisterCompany} from '../model/registerCompany';
import {Activity} from "../model/activity";

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private urlPath: string = '/Company';

  constructor(private http: HttpClient) {
  }

  // ****** GET ****** \\

  getCompanyById(id?: number): Observable<Company | null> {
    const url = id
      ? `${environment.apiBasePath}${this.urlPath}?id=${id}`
      : `${environment.apiBasePath}${this.urlPath}`;

    return this.http.get<Company>(url).pipe(
      tap((company) => {
        if (company && company.id) {
          return;
        }
      }),
      catchError((error) => {
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
          console.error(error);
          return of(null);
        })
      );
  }

  createCompanyActivities(activities: Activity[]): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiBasePath}${this.urlPath}/Activities`,
        activities
      )
      .pipe(
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
  }

  // ****** PUT ****** \\

  updateCompany(company: CompanyDetails): Observable<boolean> {
    return this.http
      .put(
        `${environment.apiBasePath}${this.urlPath}/UpdateCompany`,
        company
      )
      .pipe(
        map(_ => {
          return true;
        }),
        catchError(error => {
          console.error(error);
          return of(false);
        }),
      );
  }

  activateOrDeactivateCompany(
    id: number,
    isActive: boolean
  ): Observable<boolean> {
    const params = new HttpParams()
      .set('id', id)
      .set('isActive', isActive.toString());

    return this.http
      .put(`${environment.apiBasePath}${this.urlPath}/IsActive`, null, {
        params: params,
      })
      .pipe(
        map(_ => {
          return true;
        }),
        catchError(error => {
          console.error(error);
          return of(false);
        }),
      );
  }
}
