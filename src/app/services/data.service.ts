import { Injectable } from '@angular/core';
import { DefaultService as RestApiService } from 'src/app/swagger-api/api/default.service';
import { UserBasic } from '../swagger-api';
import { Observable, Subject, of } from 'rxjs';
import { mockUserBasic } from '../components/public/user-profile/mock-users';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private user$: Subject<UserBasic> = new Subject();
  private users$: Subject<UserBasic[]> = new Subject();

  constructor(
    private apiService: RestApiService,
  ) { }

  public get users(): Observable<UserBasic[]> {
    this.apiService.usersGet().subscribe({
      next: (response: UserBasic[]) => this.users$.next(response),
      error: (error: HttpErrorResponse) => this.users$.next([mockUserBasic]),
    });
    return this.users$.asObservable();
  }

  public getUser(userId: string): Observable<UserBasic> {
    this.apiService.usersUserIdGet(userId).subscribe({
      next: (response: UserBasic) => this.user$.next(response),
      error: (error: HttpErrorResponse) => this.user$.next(mockUserBasic),
    });
    return this.user$.asObservable();
  }
}
