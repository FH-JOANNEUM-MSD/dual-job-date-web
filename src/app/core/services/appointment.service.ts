import {Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Appointment} from "../model/appointment";

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private urlPath: string = '/Util';

  constructor(private http: HttpClient) {
  }

  // ****** GET ****** \\

  getAppointments(companyId?: number): Observable<Appointment[] | null> {
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId);
    }

    return this.http
      .get<Appointment[]>(`${environment.apiBasePath}${this.urlPath}/AppointmentsByCompanyId`,
        {params: params,})
      .pipe(
        catchError((error) => {
          // TODO implement Error Handling
          console.error(error);
          return of(null);
        })
      );
  }
}
