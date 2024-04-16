import {Injectable} from '@angular/core';
import {catchError, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Company} from "../model/company";
import {CompanyDetails} from "../model/companyDetails";
import {Activity} from "../model/activity";
import {ActivityInput} from "../model/activityInput";
import {CompanyInput} from "../model/companyInput";
import {CompanyDetailsInput} from "../model/companyDetailsInput";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private urlPath: string = '/Company';

  constructor(private http: HttpClient) {
  }

  // ****** GET ****** \\

  getCompanies(): Observable<Company[] | null> {
    // TODO institutionId and academicProgramId ???
    return this.http.get<Company[]>(`${environment.apiBasePath}${this.urlPath}/Companies?institutionId=${''}&academicProgramId=${''}`).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  getActiveCompanies(): Observable<Company[] | null> {
    // TODO institutionId and academicProgramId ???
    return this.http.get<Company[]>(`${environment.apiBasePath}${this.urlPath}/ActiveCompanies`).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  getCompanyById(id: string): Observable<Company | null> {
    return this.http.get<Company>(`${environment.apiBasePath}${this.urlPath}/GetCompany?id=${id}`).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  getCompanyDetails(id: string): Observable<CompanyDetails | null> {
    return this.http.get<CompanyDetails>(`${environment.apiBasePath}${this.urlPath}/Details?id=${id}`).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  getCompanyActivities(id: string): Observable<Activity[] | null> {
    return this.http.get<Activity[]>(`${environment.apiBasePath}${this.urlPath}/Activities?id=${id}`).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }


  // ****** POST ****** \\

  createCompany(email: string, companyName: string, academicProgramId: string): Observable<Company | null> {
    return this.http.post<Company>(`${environment.apiBasePath}${this.urlPath}/Register`, {
      companyName: companyName,
      email: email,
      academicProgramId: academicProgramId
    }).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  createCompanyActivities(activities: ActivityInput[]): Observable<any> {
    // TODO implement GlobalStorage / LocalStorage something
    return this.http.post<any>(`${environment.apiBasePath}${this.urlPath}/Activities`, activities).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  // ****** PUT ****** \\

  updateCompany(companyInput: CompanyInput): Observable<Company | null> {
    return this.http.put<Company>(`${environment.apiBasePath}${this.urlPath}`, companyInput).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  activateOrDeactivateCompany(id: string, isActive: boolean): Observable<any> {
    return this.http.put<any>(`${environment.apiBasePath}${this.urlPath}/IsActive`, {id: id, isActive: isActive}).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }

  updateCompanyDetails(companyDetailsInput: CompanyDetailsInput): Observable<any> {
    return this.http.put<any>(`${environment.apiBasePath}${this.urlPath}/Details`, companyDetailsInput).pipe(
      catchError(error => {
        // TODO implement Error Handling
        console.error(error);
        return of(null);
      }),
    );
  }


}
