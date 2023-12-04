import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultService as RestApiService } from 'src/app/swagger-api/api/default.service';
import { Observable } from 'rxjs';
import { Token, UserBasic } from '../swagger-api';
import { TokenBody } from '../swagger-api/model/tokenBody';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apiService: RestApiService,
  ) { }

  public createUser(payload: UserBasic): Observable<{} | Error> {
    return this.apiService.restAuthSignupPost(payload);
  }

  public updateUser(payload: UserBasic): Observable<{} | Error> {
    return this.apiService.restProfileUpdate(payload);
  }

  public deleteAccount(): Observable<{} | Error> {
    return this.apiService.restProfileDelete();
  }

  public login(payload: TokenBody): Observable<Token> {
    return this.apiService.restAuthLoginPost(payload);
  }

  public prolong(): Observable<Token> {
    return this.apiService.restAuthLoginPut();
  }

  public logout(): Observable<{} | Error> {
    return this.apiService.restAuthLogout();
  }

  
  
  /**
   * @desc Server expectation headers
   * @param headers
   * @returns {Headers}
   * @private
   */
  // private getHeaders(headers: {} = {}): HttpHeaders {
  //     const _headers = new HttpHeaders(headers);

  //     _headers.set('Access-Control-Allow-Origin', '*');
  //     _headers.set('Content-Type', 'application/json');
  //     _headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //     _headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
  //     // _headers.set('Accept', 'application/json');
  //     // _headers.set('Origin','http://localhost:3000');

  //     return _headers;
  // }
}
