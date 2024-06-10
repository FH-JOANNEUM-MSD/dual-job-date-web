import {Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Institution} from "../model/institution";

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private urlPath: string = '/Util';

  constructor(private http: HttpClient) {
  }

  // ****** GET ****** \\

  getInstitutions(): Observable<Institution[] | null> {
    return this.http
      .get<Institution[]>(`${environment.apiBasePath}${this.urlPath}/Institutions`)
      .pipe(
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
  }
}
