import {Injectable} from '@angular/core';
import {catchError, map, Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Appointment} from "../model/appointment";
import {GenerateAppointmentModel} from "../model/generateAppointmentModel";
import {toLocalISOString} from "../../utils/date-utils";

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private urlPathUtil: string = '/Util';
  private urlPathMatching: string = '/StudentCompany';

  constructor(private http: HttpClient) {
  }

  // ****** GET ****** \\

  getAppointments(companyId?: number): Observable<Appointment[] | null> {
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId);
    }

    return this.http
      .get<Appointment[]>(`${environment.apiBasePath}${this.urlPathUtil}/AppointmentsByCompanyId`,
        {params: params,})
      .pipe(
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
  }

  generateAppointments(model: GenerateAppointmentModel): Observable<boolean> {
    let params = new HttpParams();
    params = params.set('AcademicProgramId', model.academicProgramId);
    params = params.set('StartTime', toLocalISOString(model.startTime));
    params = params.set('EndTime', toLocalISOString(model.endTime));
    params = params.set('MatchesPerStudent', model.matchesPerResult);

    return this.http
      .get(`${environment.apiBasePath}${this.urlPathMatching}/MatchCompaniesToStudent`, {params: params})
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
