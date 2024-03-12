import {Injectable} from '@angular/core';
import {Album, AlbumsServiceInterface} from "../../../../../generated-api";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private a: AlbumsServiceInterface) {
  }

  getAlbums(): Observable<Album[]> {
    return this.a.v1AlbumsGet() as Observable<Album[]>;
  }
}
