import { Injectable } from '@angular/core';
import { DefaultService as RestApiService } from 'src/app/swagger-api/api/default.service';
import { UserBasic } from '../swagger-api';
import { Observable, of } from 'rxjs';
import { mockUserBasic } from '../components/public/user-profile/mock-users';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private apiService: RestApiService,
  ) { }

  public get users(): Observable<UserBasic[]> {
    return of([mockUserBasic]);
    return this.apiService.usersGet();
  }

  public getUser(userId: string): Observable<UserBasic> {
    return of(mockUserBasic);
    return this.apiService.usersUserIdGet(userId);
  }
}
