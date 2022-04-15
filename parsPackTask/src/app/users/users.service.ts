import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsers } from './users.interface';
import {Users} from './../core/urls'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsersList(): Observable<IUsers[]> {
    return this.http.get<IUsers[]>(Users.getUsersList);
  }
}
