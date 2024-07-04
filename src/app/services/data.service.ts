import { Injectable } from '@angular/core';
import { DefaultService as RestApiService } from 'src/app/swagger-api/api/default.service';
import { UserBasic } from '../swagger-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private apiService: RestApiService,
  ) { }

  public get users(): Observable<UserBasic[]> {
    return this.apiService.usersGet();
  }

  public getUser(userId: string): Observable<UserBasic> {
    return this.apiService.usersUserIdGet(userId);
  }
}
